<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const root = ref<HTMLDivElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (!root.value) return
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) return
  cleanup = init(root.value)
})
onUnmounted(() => cleanup?.())

function init(container: HTMLDivElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = container.clientWidth || window.innerWidth
  let h = container.clientHeight || window.innerHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, w / h, 1, 3000)
  camera.position.z = 640

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const COUNT = 520
  const BOX_X = 1500, BOX_Y = 950, BOX_Z = 700
  const base = new Float32Array(COUNT * 3)
  const scatter = new Float32Array(COUNT * 3)
  const offsets = new Float32Array(COUNT * 3)
  const velocities = new Float32Array(COUNT * 3)
  const positions = new Float32Array(COUNT * 3)
  const sizes = new Float32Array(COUNT)
  const seeds = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * BOX_X
    const y = (Math.random() - 0.5) * BOX_Y
    const z = (Math.random() - 0.5) * BOX_Z
    base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z
    // start dispersed far out — they "fly in" on first view
    const ang = Math.random() * Math.PI * 2
    const rad = 900 + Math.random() * 1100
    scatter[i * 3] = Math.cos(ang) * rad
    scatter[i * 3 + 1] = Math.sin(ang) * rad
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 1600 - 400
    positions[i * 3] = scatter[i * 3]
    positions[i * 3 + 1] = scatter[i * 3 + 1]
    positions[i * 3 + 2] = scatter[i * 3 + 2]
    sizes[i] = 1 + Math.random() * 2.4
    seeds[i] = Math.random() * 1000
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  function theme() {
    const dark = document.documentElement.getAttribute('data-theme') !== 'light'
    return { color: new THREE.Vector3(201 / 255, 42 / 255, 42 / 255), alpha: dark ? 0.62 : 0.4 }
  }
  const tc = theme()
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: tc.color },
      uAlpha: { value: tc.alpha },
      uDpr: { value: dpr },
      uFade: { value: 0 },
    },
    vertexShader: `
      precision mediump float;
      attribute float aSize;
      varying float vDepth;
      uniform float uDpr;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uDpr * (320.0 / max(-mv.z, 1.0));
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform vec3 uColor; uniform float uAlpha; uniform float uFade;
      varying float vDepth;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.18, d);
        if (a < 0.01) discard;
        float fade = clamp(1.0 - (vDepth - 340.0) / 1000.0, 0.25, 1.0);
        gl_FragColor = vec4(uColor, a * uAlpha * fade * uFade);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
  const points = new THREE.Points(geo, material)
  scene.add(points)

  // ── interaction state ──
  let mx = 0, my = 0, tmx = 0, tmy = 0
  let cursorX = Infinity, cursorY = Infinity
  const onMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect()
    const px = e.clientX - r.left
    const py = e.clientY - r.top
    tmx = (px / r.width - 0.5) * 2
    tmy = (py / r.height - 0.5) * 2
    cursorX = (px / r.width - 0.5) * BOX_X
    cursorY = (0.5 - py / r.height) * BOX_Y
  }
  const onLeave = () => { cursorX = Infinity; cursorY = Infinity }
  window.addEventListener('pointermove', onMove, { passive: true })
  container.addEventListener('pointerleave', onLeave)

  const onResize = () => {
    w = container.clientWidth || window.innerWidth
    h = container.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  const themeObs = new MutationObserver(() => {
    const t = theme()
    material.uniforms.uColor.value = t.color
    material.uniforms.uAlpha.value = t.alpha
  })
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // assemble (fly-in) once the section is on screen; pause render off screen
  let visible = false
  let assembleT = 0
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
  io.observe(container)

  // scroll velocity → particles scatter while scrolling, settle when still
  let lastScrollY = window.scrollY
  let scrollBoost = 0

  let raf = 0
  let lastT = performance.now()
  const pa = geo.attributes.position.array as Float32Array
  const animate = (now: number) => {
    raf = requestAnimationFrame(animate)
    if (!visible) { lastScrollY = window.scrollY; return }
    const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now
    const t = now * 0.001

    assembleT = Math.min(1, assembleT + dt * 0.5)
    const ease = 1 - Math.pow(1 - assembleT, 3)
    material.uniforms.uFade.value = Math.min(1, assembleT * 1.4)

    mx += (tmx - mx) * 0.05
    my += (tmy - my) * 0.05

    const sy = window.scrollY
    scrollBoost += Math.min(Math.abs(sy - lastScrollY) * 0.02, 6)
    lastScrollY = sy
    scrollBoost *= 0.9

    const repelR = 150, repelR2 = repelR * repelR
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3, iy = ix + 1, iz = ix + 2
      const seed = seeds[i]
      const driftX = Math.sin(t * 0.3 + seed) * 10
      const driftY = Math.cos(t * 0.26 + seed * 1.3) * 9
      const driftZ = Math.sin(t * 0.2 + seed * 0.7) * 14

      // cursor repel
      if (cursorX !== Infinity) {
        const dx = (base[ix] + offsets[ix]) - cursorX
        const dy = (base[iy] + offsets[iy]) - cursorY
        const d2 = dx * dx + dy * dy
        if (d2 < repelR2) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / repelR) * 9
          velocities[ix] += (dx / d) * f
          velocities[iy] += (dy / d) * f
        }
      }
      // scroll scatter — random nudge scaled by scroll speed
      if (scrollBoost > 0.1) {
        velocities[ix] += (Math.random() - 0.5) * scrollBoost
        velocities[iy] += (Math.random() - 0.5) * scrollBoost
      }
      // spring home + damping
      velocities[ix] += -offsets[ix] * 0.02
      velocities[iy] += -offsets[iy] * 0.02
      velocities[ix] *= 0.9
      velocities[iy] *= 0.9
      offsets[ix] += velocities[ix]
      offsets[iy] += velocities[iy]

      const fx = base[ix] + driftX + offsets[ix]
      const fy = base[iy] + driftY + offsets[iy]
      const fz = base[iz] + driftZ
      pa[ix] = scatter[ix] * (1 - ease) + fx * ease
      pa[iy] = scatter[iy] * (1 - ease) + fy * ease
      pa[iz] = scatter[iz] * (1 - ease) + fz * ease
    }
    geo.attributes.position.needsUpdate = true

    points.rotation.y = mx * 0.12 + t * 0.01
    points.rotation.x = -my * 0.08
    camera.position.x = -mx * 24
    camera.position.y = my * 16
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(animate)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove)
    container.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('resize', onResize)
    themeObs.disconnect()
    io.disconnect()
    geo.dispose()
    material.dispose()
    renderer.dispose()
    if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement)
  }
}
</script>

<template>
  <div ref="root" class="exp-field" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.exp-field {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  :deep(canvas) { display: block; width: 100% !important; height: 100% !important; }
}
</style>
