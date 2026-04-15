<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { animate as anime } from 'animejs'
import PageFrame from '../components/PageFrame.vue'

const { t, tm } = useI18n()
interface Stage { name: string; desc: string; eta: string; out: string }

const stages = computed(() => tm('process.stages') as Stage[])
const active = ref(0)
const canvasEl = ref<HTMLCanvasElement | null>(null)

const currentStage = computed(() => stages.value[active.value])

function setActive(i: number) { active.value = i }

function onKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  const len = stages.value.length
  if (!len) return
  e.preventDefault()
  const step = e.key === 'ArrowDown' ? 1 : -1
  setActive((active.value + step + len) % len)
}

// Wheel scroll — switch active stage vertically
let lastWheelAt = 0
const WHEEL_COOLDOWN = 500
function onWheelNav(e: WheelEvent) {
  const absX = Math.abs(e.deltaX)
  const absY = Math.abs(e.deltaY)
  if (absY < 20 || absY < absX) return
  const now = Date.now()
  if (now - lastWheelAt < WHEEL_COOLDOWN) { e.preventDefault(); return }
  lastWheelAt = now
  const step = e.deltaY > 0 ? 1 : -1
  const len = stages.value.length
  if (len) setActive((active.value + step + len) % len)
  e.preventDefault()
}

// -------- THREE.JS scene --------
interface ShapeData { obj: THREE.Object3D; update: (t: number) => void }

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let shapes: ShapeData[] = []
let currentShape: ShapeData | null = null
let rafId = 0
let themeObserver: MutationObserver | null = null

// Drag-to-rotate state
let userRotY = 0, userRotX = 0
let userRotYTarget = 0, userRotXTarget = 0
let isDragging = false
let lastPtrX = 0, lastPtrY = 0
let dragVelY = 0, dragVelX = 0

function getStrokeColor() {
  const dark = document.documentElement.getAttribute('data-theme') !== 'light'
  return new THREE.Color(dark ? 0xececec : 0x0a0a0a)
}
function getBgColor() {
  const dark = document.documentElement.getAttribute('data-theme') !== 'light'
  return new THREE.Color(dark ? 0x0a0a0a : 0xf5f5f0)
}

function makeLineMat(color: THREE.Color) {
  return new THREE.LineBasicMaterial({ color: color.clone(), transparent: true, opacity: 1 })
}
function makePointsMat(color: THREE.Color, size = 0.05) {
  return new THREE.PointsMaterial({ color: color.clone(), size, transparent: true, opacity: 1, sizeAttenuation: true })
}

// 1. TALK — placeholder empty group (phone will be rendered via Spline Viewer overlay — see template)
function makeTalk(_color: THREE.Color): ShapeData {
  return {
    obj: new THREE.Group(),
    update: () => {},
  }
}

// 2. PLAN — clipboard (3D board with depth, clip, checklist)
function makePlan(color: THREE.Color): ShapeData {
  const outer = new THREE.Group()
  const g = new THREE.Group()
  const mat = () => makeLineMat(color)

  const w = 1.35, h = 1.85, d = 0.08
  // 3D clipboard base
  g.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
    mat(),
  ))

  // Clip on top — 3D small box
  const clip = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, 0.2, d + 0.05)),
    mat(),
  )
  clip.position.y = h / 2 + 0.08
  g.add(clip)

  // Text lines + checkbox squares on front face
  const front = d / 2 + 0.001
  const lineSegs: THREE.Vector3[] = []
  const rowWs = [0.9, 0.7, 1.0, 0.6, 0.85, 0.75]
  const startY = h / 2 - 0.32
  rowWs.forEach((lw, i) => {
    const y = startY - i * 0.22
    const boxSize = 0.08
    const bx = -w / 2 + 0.14
    // Checkbox outline
    lineSegs.push(
      new THREE.Vector3(bx, y - boxSize / 2, front),
      new THREE.Vector3(bx + boxSize, y - boxSize / 2, front),
      new THREE.Vector3(bx + boxSize, y - boxSize / 2, front),
      new THREE.Vector3(bx + boxSize, y + boxSize / 2, front),
      new THREE.Vector3(bx + boxSize, y + boxSize / 2, front),
      new THREE.Vector3(bx, y + boxSize / 2, front),
      new THREE.Vector3(bx, y + boxSize / 2, front),
      new THREE.Vector3(bx, y - boxSize / 2, front),
    )
    // First two items have checkmarks (already done)
    if (i < 2) {
      lineSegs.push(
        new THREE.Vector3(bx + 0.01, y, front),
        new THREE.Vector3(bx + 0.035, y - boxSize / 2 + 0.015, front),
        new THREE.Vector3(bx + 0.035, y - boxSize / 2 + 0.015, front),
        new THREE.Vector3(bx + 0.07, y + boxSize / 2 - 0.01, front),
      )
    }
    // Row line
    lineSegs.push(
      new THREE.Vector3(bx + boxSize + 0.1, y, front),
      new THREE.Vector3(bx + boxSize + 0.1 + lw, y, front),
    )
  })
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lineSegs), mat()))
  outer.add(g)

  return {
    obj: outer,
    update: () => { /* still — user rotates via drag */ },
  }
}

// 3. SKETCH — pencil (hexagonal body, cone tip, ferrule, eraser) — tilted
function makeSketch(color: THREE.Color): ShapeData {
  const outer = new THREE.Group()
  const pencil = new THREE.Group()
  const mat = () => makeLineMat(color)

  const bodyH = 1.6
  // Body (hex cylinder)
  const body = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.16, 0.16, bodyH, 6)),
    mat(),
  )
  pencil.add(body)
  // Tip cone
  const tip = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.ConeGeometry(0.16, 0.38, 6)),
    mat(),
  )
  tip.position.y = -bodyH / 2 - 0.19
  pencil.add(tip)
  // Ferrule (short cylinder at top)
  const fer = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 12)),
    mat(),
  )
  fer.position.y = bodyH / 2 + 0.07
  pencil.add(fer)
  // Eraser (cylinder cap)
  const eraser = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.15, 0.15, 0.22, 12)),
    mat(),
  )
  eraser.position.y = bodyH / 2 + 0.14 + 0.11
  pencil.add(eraser)

  // Tilt the pencil
  pencil.rotation.z = Math.PI / 5
  outer.add(pencil)

  return {
    obj: outer,
    update: () => { /* still — user rotates via drag */ },
  }
}

// 4. BUILD — tower: stacked floors with window verticals
function makeBuild(color: THREE.Color): ShapeData {
  const g = new THREE.Group()
  const floors = 4
  const floorH = 0.5
  const floorW = 1.1
  const gap = 0.04
  const totalH = floors * floorH + (floors - 1) * gap

  for (let i = 0; i < floors; i++) {
    // Floor box (wireframe)
    const floor = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(floorW, floorH, floorW)),
      makeLineMat(color),
    )
    floor.position.y = -totalH / 2 + floorH / 2 + i * (floorH + gap)
    g.add(floor)

    // Windows on front face — 3 short vertical slits
    const winPts: THREE.Vector3[] = []
    for (let w = 0; w < 3; w++) {
      const wx = -floorW / 2 + 0.22 + w * 0.33
      const y1 = floor.position.y - 0.15
      const y2 = floor.position.y + 0.15
      winPts.push(
        new THREE.Vector3(wx, y1, floorW / 2 + 0.001),
        new THREE.Vector3(wx, y2, floorW / 2 + 0.001),
      )
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(winPts), makeLineMat(color)))
  }

  return {
    obj: g,
    update: () => { /* still — user rotates via drag */ },
  }
}

// 5. SHIP — paper plane flying + particle trail
function makeShip(color: THREE.Color): ShapeData {
  const g = new THREE.Group()
  const plane = new THREE.Group()

  // Paper plane vertices
  const v = {
    nose:      new THREE.Vector3(1.4, 0, 0),
    leftTip:   new THREE.Vector3(-0.9, 0.1, 1.0),
    rightTip:  new THREE.Vector3(-0.9, 0.1, -1.0),
    center:    new THREE.Vector3(-0.6, -0.18, 0),
    foldBack:  new THREE.Vector3(-0.9, 0.1, 0),
  }
  const edges: THREE.Vector3[] = [
    v.nose, v.leftTip,
    v.nose, v.rightTip,
    v.nose, v.center,
    v.nose, v.foldBack,
    v.leftTip, v.foldBack,
    v.rightTip, v.foldBack,
    v.center, v.foldBack,
    v.leftTip, v.center,
    v.rightTip, v.center,
  ]
  plane.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(edges),
    makeLineMat(color),
  ))
  g.add(plane)

  // Particle trail
  const count = 80
  const trailGeom = new THREE.BufferGeometry()
  const pos = new Float32Array(count * 3)
  const base: { x: number; y: number; z: number; phase: number }[] = []
  for (let i = 0; i < count; i++) {
    const t = i / count
    const x = -1.0 - t * 1.8
    const y = (Math.random() - 0.5) * 0.22
    const z = (Math.random() - 0.5) * 0.45 * (1 - t * 0.6)
    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
    base.push({ x, y, z, phase: Math.random() * Math.PI * 2 })
  }
  trailGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const trail = new THREE.Points(trailGeom, makePointsMat(color, 0.045))
  g.add(trail)

  return {
    obj: g,
    update: (t) => {
      // Internal: plane banks + bobs, trail drifts (no outer rotation)
      plane.rotation.z = Math.sin(t) * 0.13
      plane.rotation.y = Math.sin(t * 0.55) * 0.25
      plane.position.y = Math.sin(t * 1.2) * 0.1
      const p = trail.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < count; i++) {
        const b = base[i]
        p.setY(i, b.y + Math.sin(t * 1.3 + b.phase) * 0.05)
        p.setZ(i, b.z + Math.cos(t * 0.8 + b.phase) * 0.04)
      }
      p.needsUpdate = true
    },
  }
}

function initThree() {
  if (!canvasEl.value) return
  const parent = canvasEl.value.parentElement!
  const w = parent.clientWidth
  const h = parent.clientHeight
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
  camera.position.z = 4.6
  renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h, false)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // Lights — soft 3-point setup for shaded materials
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const key = new THREE.DirectionalLight(0xffffff, 0.9)
  key.position.set(3, 4, 5)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffffff, 0.35)
  fill.position.set(-4, -2, -3)
  scene.add(fill)

  const color = getStrokeColor()
  shapes = [
    makeTalk(color),
    makePlan(color),
    makeSketch(color),
    makeBuild(color),
    makeShip(color),
  ]
  shapes.forEach(s => { s.obj.visible = false; scene.add(s.obj) })
  currentShape = shapes[active.value]
  currentShape.obj.visible = true

  tick()

  themeObserver = new MutationObserver(() => {
    const c = getStrokeColor()
    shapes.forEach(s => s.obj.traverse(o => {
      const m = (o as any).material
      if (!m?.color) return
      // Skip materials with explicit role (phone parts have their own palette)
      if (m.userData?.role) return
      m.color.copy(c)
    }))
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

function tick() {
  rafId = requestAnimationFrame(tick)
  const t = performance.now() * 0.001

  // Inertia when released — drag velocity decays
  if (!isDragging) {
    userRotYTarget += dragVelY
    userRotXTarget += dragVelX
    dragVelY *= 0.93
    dragVelX *= 0.93
  }
  // Smooth lerp toward target
  userRotY += (userRotYTarget - userRotY) * 0.14
  userRotX += (userRotXTarget - userRotX) * 0.14

  if (currentShape && currentShape.obj.visible) {
    // User drag-controlled rotation
    currentShape.obj.rotation.y = userRotY
    currentShape.obj.rotation.x = userRotX
    // Inner motion (particles, banking, etc.)
    currentShape.update(t)
  }
  if (renderer) renderer.render(scene, camera)
}

function switchShape(index: number) {
  const next = shapes[index]
  if (!next || next === currentShape) return
  const prev = currentShape
  if (prev) {
    anime(prev.obj.scale, {
      x: 0, y: 0, z: 0,
      duration: 340,
      ease: 'inQuad',
      onComplete: () => {
        prev.obj.visible = false
        prev.obj.scale.set(1, 1, 1)
      },
    })
  }
  next.obj.visible = true
  next.obj.scale.set(0, 0, 0)
  anime(next.obj.scale, {
    x: 1, y: 1, z: 1,
    duration: 620,
    delay: 260,
    ease: 'outBack(1.7)',
  })
  currentShape = next
}

// -------- Pointer: drag to rotate --------
function onPointerDown(e: PointerEvent) {
  if (!canvasEl.value) return
  isDragging = true
  lastPtrX = e.clientX
  lastPtrY = e.clientY
  dragVelY = 0
  dragVelX = 0
  canvasEl.value.style.cursor = 'grabbing'
  canvasEl.value.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging) return
  const dx = e.clientX - lastPtrX
  const dy = e.clientY - lastPtrY
  const deltaY = dx * 0.008
  const deltaX = dy * 0.008
  userRotYTarget += deltaY
  userRotXTarget += deltaX
  dragVelY = deltaY * 0.6
  dragVelX = deltaX * 0.6
  lastPtrX = e.clientX
  lastPtrY = e.clientY
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging) return
  isDragging = false
  if (canvasEl.value) {
    canvasEl.value.style.cursor = 'grab'
    if (canvasEl.value.hasPointerCapture(e.pointerId)) {
      canvasEl.value.releasePointerCapture(e.pointerId)
    }
  }
}

function onResize() {
  if (!canvasEl.value || !renderer || !camera) return
  const parent = canvasEl.value.parentElement!
  const w = parent.clientWidth
  const h = parent.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

watch(active, i => switchShape(i))

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', onResize)
  window.addEventListener('wheel', onWheelNav, { passive: false })
  nextTick(() => {
    initThree()
    if (canvasEl.value) {
      canvasEl.value.style.cursor = 'grab'
      canvasEl.value.style.touchAction = 'none'
      canvasEl.value.addEventListener('pointerdown', onPointerDown)
      canvasEl.value.addEventListener('pointermove', onPointerMove)
      canvasEl.value.addEventListener('pointerup', onPointerUp)
      canvasEl.value.addEventListener('pointercancel', onPointerUp)
      canvasEl.value.addEventListener('pointerleave', onPointerUp)
    }
  })
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('wheel', onWheelNav)
  if (canvasEl.value) {
    canvasEl.value.removeEventListener('pointerdown', onPointerDown)
    canvasEl.value.removeEventListener('pointermove', onPointerMove)
    canvasEl.value.removeEventListener('pointerup', onPointerUp)
    canvasEl.value.removeEventListener('pointercancel', onPointerUp)
    canvasEl.value.removeEventListener('pointerleave', onPointerUp)
  }
  themeObserver?.disconnect()
  renderer?.dispose()
  shapes.forEach(s => s.obj.traverse(o => {
    const m = (o as any).material
    const g = (o as any).geometry
    m?.dispose?.()
    g?.dispose?.()
  }))
})
</script>

<template>
  <PageFrame num="05" :section="t('nav.process')">
    <div class="pp-page">
      <div class="pp-grid">
        <!-- LEFT: vertical timeline absolute-positioned like on services page -->
        <nav class="vtl" role="tablist">
          <div class="vtl__rail" aria-hidden="true"></div>
          <button
            v-for="(s, i) in stages"
            :key="i"
            class="vtl__step"
            :class="{ 'is-active': active === i, 'is-passed': i < active }"
            role="tab"
            :aria-selected="active === i"
            @mouseenter="setActive(i)"
            @click="setActive(i)"
            @focus="setActive(i)"
          >
            <span class="vtl__dot"></span>
            <span class="vtl__name">{{ s.name }}</span>
          </button>
        </nav>

        <!-- CENTER: stage name + description + 3D canvas -->
        <section class="pp-stage">
          <Transition name="pp-fade" mode="out-in">
            <div :key="active" class="pp-stage__top">
              <h2 class="pp-stage__name">{{ currentStage?.name }}</h2>
              <p class="pp-stage__desc">{{ currentStage?.desc }}</p>
            </div>
          </Transition>

          <div class="pp-stage__canvas-wrap">
            <canvas ref="canvasEl" class="pp-stage__canvas"></canvas>
          </div>
        </section>
      </div>
    </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.pp-page {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;

  @media (max-width: 768px) { padding: 20px 8px; }
}

.pp-grid {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 960px) {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: none;
  }
}

// LEFT — vertical timeline, absolutely positioned like services page
.vtl {
  position: absolute;
  top: 0;
  left: -280px;
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-left: 24px;

  @media (max-width: 1400px) {
    left: max(20px, calc((100vw - 820px) / 2 - 260px));
  }

  @media (max-width: 960px) {
    position: static;
    left: auto;
    width: 100%;
  }
}

.vtl__rail {
  position: absolute;
  left: 5.5px;
  top: 10px;
  bottom: 10px;
  width: 1px;
  background: var(--border);
  pointer-events: none;
}

.vtl__step {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  background: none;
  border: none;
  padding: 2px 0;
  color: var(--muted);
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.25s ease, transform 0.25s ease;

  &:hover { color: var(--fg); }

  &.is-active {
    color: var(--accent);
    transform: translateX(4px);
  }
}

.vtl__dot {
  position: absolute;
  left: -24px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  .vtl__step.is-active & {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent);
  }
  .vtl__step.is-passed & {
    background: var(--accent);
    border-color: var(--accent);
    opacity: 0.55;
  }
}

.vtl__name {
  font-family: var(--font-sans);
  font-size: clamp(15px, 1.25vw, 18px);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
}

// CENTER — stage (title + desc + canvas)
.pp-stage {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  text-align: center;
}

.pp-stage__top {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  max-width: 620px;
}

.pp-stage__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(40px, 4.8vw, 72px);
  letter-spacing: -0.025em;
  line-height: 0.95;
  color: var(--fg);
}

.pp-stage__desc {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(14px, 1.1vw, 17px);
  line-height: 1.6;
  color: var(--muted);
  max-width: 56ch;
}

.pp-fade-enter-active,
.pp-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-fade-enter-from { opacity: 0; transform: translateY(8px); }
.pp-fade-leave-to   { opacity: 0; transform: translateY(-8px); }

// 3D canvas under the text
.pp-stage__canvas-wrap {
  width: 100%;
  max-width: 440px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) { max-width: 340px; }
}

.pp-stage__canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
