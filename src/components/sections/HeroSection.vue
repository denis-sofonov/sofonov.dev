<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

const { t, tm, locale } = useI18n()

const meta = computed(() => tm('heroMeta') as { k: string; v: string }[])
const looking = computed(() => tm('lookingFor.items') as { k: string; v: string }[])
const cvHref = '/denis-sofonov-cv.pdf'

// ── weekly activity strip — last 26 weeks ──────────────────────────
// Decorative by default (a deterministic "shipping rhythm"); upgrades to real
// GitHub data only if the public profile has enough signal to look alive.
const GITHUB_USER = 'denis-sofonov'
const ghUrl = `https://github.com/${GITHUB_USER}`
const WEEKS = 26
const isLive = ref(false)

function genWeekly(): number[] {
  let seed = 20021998
  const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  const out: number[] = []
  for (let i = 0; i < WEEKS; i++) {
    const recency = i / (WEEKS - 1)
    let lvl = 0
    if (r() < 0.5 + recency * 0.22) {
      const q = r() + recency * 0.35
      lvl = q > 1.05 ? 4 : q > 0.8 ? 3 : q > 0.55 ? 2 : 1
    }
    out.push(lvl)
  }
  return out
}
const activity = ref<number[]>(genWeekly())

async function loadGithub() {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
    if (!res.ok) return
    const data = await res.json() as { contributions?: { count: number }[] }
    const c = data.contributions ?? []
    const total = c.reduce((a, x) => a + (x.count || 0), 0)
    // Only switch to real data when there's enough to read as a living graph —
    // a near-empty public profile would just look dead.
    if (total < 60) return
    const last = c.slice(-WEEKS * 7)
    const weeks: number[] = []
    for (let w = 0; w < WEEKS; w++) {
      const sum = last.slice(w * 7, w * 7 + 7).reduce((a, x) => a + (x.count || 0), 0)
      weeks.push(sum === 0 ? 0 : sum < 3 ? 1 : sum < 6 ? 2 : sum < 12 ? 3 : 4)
    }
    activity.value = weeks
    isLive.value = true
  } catch { /* keep the decorative rhythm */ }
}

const heroRoot = ref<HTMLDivElement | null>(null)
let cleanup: (() => void) | null = null
let resample: ((text: string) => void) | null = null

function initHero(container: HTMLDivElement, initialText: string) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  // Canvas is fixed to the viewport so particles stay alive across every
  // section, not just while the hero is on screen. Dimensions are always
  // window-bound, not container-bound.
  let w = window.innerWidth
  let h = window.innerHeight
  let currentText = initialText

  const scene = new THREE.Scene()
  const fov = 45
  const camera = new THREE.PerspectiveCamera(fov, w / h, 1, 5000)
  let camDist = h / (2 * Math.tan((fov * Math.PI) / 360))
  camera.position.z = camDist

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.domElement.className = 'hero__canvas'
  container.appendChild(renderer.domElement)

  const group = new THREE.Group()
  scene.add(group)

  let targets = new Float32Array(0)
  let scatter = new Float32Array(0)
  let sizes = new Float32Array(0)
  let seeds = new Float32Array(0)
  let positions = new Float32Array(0)
  let offsets = new Float32Array(0)
  let velocities = new Float32Array(0)
  let geometry: THREE.BufferGeometry | null = null
  let points: THREE.Points | null = null
  let material: THREE.ShaderMaterial | null = null
  let pointCount = 0

  const sample = (txt: string) => {
    const off = document.createElement('canvas')
    off.width = w
    off.height = h
    const ctx = off.getContext('2d')!
    const fontSize = Math.min(w * 0.14, 170)
    ctx.font = `700 ${fontSize}px "Onest", "Inter Tight", Arial, sans-serif`
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${Math.round(fontSize * 0.04)}px`

    const lines = txt.split('\n')
    const lineHeight = fontSize * 1.0
    const totalH = lines.length * lineHeight
    const opticalOffset = h * 0.08
    const startY = (h - totalH) / 2 + lineHeight / 2 - opticalOffset
    lines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineHeight))

    const data = ctx.getImageData(0, 0, w, h).data
    const gap = 1.7
    const pts: { x: number; y: number; s: number }[] = []
    const alphaAt = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return 0
      return data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3]
    }
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const a = alphaAt(x, y)
        if (a < 128) continue
        if (a < 180 && Math.random() < 0.3) continue
        if (Math.random() < 0.02) continue

        const nearEdge =
          alphaAt(x - 3, y) < 200 ||
          alphaAt(x + 3, y) < 200 ||
          alphaAt(x, y - 3) < 200 ||
          alphaAt(x, y + 3) < 200
        const jitterMul = nearEdge ? 3.2 : 1.8
        const jx = (Math.random() - 0.5) * gap * jitterMul
        const jy = (Math.random() - 0.5) * gap * jitterMul
        pts.push({
          x: x + jx - w / 2,
          y: -(y + jy) + h / 2,
          s: 1.3 + Math.random() * 1.2,
        })

        if (Math.random() < 0.35) {
          pts.push({
            x: x + jx - w / 2 + (Math.random() - 0.5) * 3,
            y: -(y + jy) + h / 2 + (Math.random() - 0.5) * 3,
            s: 0.7 + Math.random() * 0.7,
          })
        }

        if (nearEdge && Math.random() < 0.45) {
          const ang = Math.random() * Math.PI * 2
          const r = 2 + Math.random() * 5
          pts.push({
            x: x - w / 2 + Math.cos(ang) * r,
            y: -(y) + h / 2 + Math.sin(ang) * r,
            s: 0.5 + Math.random() * 0.6,
          })
        }
      }
    }

    pointCount = pts.length
    targets = new Float32Array(pointCount * 3)
    scatter = new Float32Array(pointCount * 3)
    sizes = new Float32Array(pointCount)
    seeds = new Float32Array(pointCount)
    positions = new Float32Array(pointCount * 3)
    offsets = new Float32Array(pointCount * 3)
    velocities = new Float32Array(pointCount * 3)

    for (let i = 0; i < pointCount; i++) {
      const p = pts[i]
      targets[i * 3] = p.x
      targets[i * 3 + 1] = p.y
      targets[i * 3 + 2] = 0
      const ang = Math.random() * Math.PI * 2
      const rad = Math.sqrt(Math.random()) * Math.min(w, h) * 0.55
      scatter[i * 3] = Math.cos(ang) * rad
      scatter[i * 3 + 1] = Math.sin(ang) * rad
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 500 - 150
      positions[i * 3] = scatter[i * 3]
      positions[i * 3 + 1] = scatter[i * 3 + 1]
      positions[i * 3 + 2] = scatter[i * 3 + 2]
      sizes[i] = p.s
      seeds[i] = Math.random() * 1000
    }

    if (points) {
      group.remove(points)
      geometry?.dispose()
    }
    geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    if (!material) {
      material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Vector3(201 / 255, 42 / 255, 42 / 255) },
          uDpr: { value: dpr },
          uCamDist: { value: camDist },
          uFade: { value: 0 },
        },
        vertexShader: `
          precision highp float;
          attribute float aSize;
          varying float vDepth;
          uniform float uDpr;
          uniform float uCamDist;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
            float perspective = uCamDist / max(-mv.z, 1.0);
            gl_PointSize = aSize * uDpr * clamp(perspective, 0.4, 2.6);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform vec3 uColor;
          uniform float uCamDist;
          uniform float uFade;
          varying float vDepth;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float a = smoothstep(0.5, 0.35, d);
            if (a < 0.01) discard;
            float depthFade = clamp(1.0 - abs(vDepth - uCamDist) / 900.0, 0.55, 1.0);
            gl_FragColor = vec4(uColor, a * depthFade * uFade);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      })
    }

    points = new THREE.Points(geometry, material)
    group.add(points)
  }

  sample(currentText)

  let targetMX = 0, targetMY = 0, mouseX = 0, mouseY = 0
  let prevMouseWx = Infinity, prevMouseWy = Infinity
  // Decaying "recent activity" signal in [0,1]. Bumped to 1 on any real
  // pointer interaction, decays toward 0 whenever the user sits still. Drives
  // `idleDrift = 1 - recentActivity`, which in turn feeds a random jitter into
  // per-particle velocities — the letters scatter when idle, snap back when
  // the cursor moves.
  let recentActivity = 1
  const bumpActivity = () => { recentActivity = 1 }
  const onMouse = (e: MouseEvent) => {
    bumpActivity()
    const rect = container.getBoundingClientRect()
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top
    targetMX = (sx / rect.width - 0.5) * 2
    targetMY = (sy / rect.height - 0.5) * 2

    const mwx = sx - w / 2
    const mwy = h / 2 - sy
    if (prevMouseWx !== Infinity && assembleT >= 1 && pointCount > 0) {
      const mvx = mwx - prevMouseWx
      const mvy = mwy - prevMouseWy
      const speed = Math.hypot(mvx, mvy)
      if (speed > 1) {
        const nx = mvx / speed, ny = mvy / speed
        const force = Math.min(speed, 40)
        const R = 70
        const R2 = R * R
        for (let i = 0; i < pointCount; i++) {
          const ix = i * 3
          const dx = targets[ix] + offsets[ix] - mwx
          const dy = targets[ix + 1] + offsets[ix + 1] - mwy
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const prox = 1 - Math.sqrt(d2) / R
            const spread = (Math.random() - 0.5) * 0.6
            velocities[ix]     += (nx + -ny * spread) * force * prox * 0.5
            velocities[ix + 1] += (ny + nx * spread) * force * prox * 0.5
          }
        }
      }
    }
    prevMouseWx = mwx
    prevMouseWy = mwy
  }
  const onLeave = () => { targetMX = 0; targetMY = 0; prevMouseWx = Infinity; prevMouseWy = Infinity }
  const onClick = (e: MouseEvent) => {
    bumpActivity()
    if (assembleT < 1 || pointCount === 0) return
    const rect = container.getBoundingClientRect()
    const cx = e.clientX - rect.left - w / 2
    const cy = h / 2 - (e.clientY - rect.top)
    const R = Math.max(w, h) * 0.55
    const R2 = R * R
    for (let i = 0; i < pointCount; i++) {
      const ix = i * 3
      const dx = targets[ix] + offsets[ix] - cx
      const dy = targets[ix + 1] + offsets[ix + 1] - cy
      const d2 = dx * dx + dy * dy
      if (d2 > R2) continue
      const d = Math.sqrt(d2) || 1
      const falloff = 1 - d / R
      // quadratic falloff — close points get much more
      const force = 34 * falloff * falloff + 4
      const nx = dx / d, ny = dy / d
      const swirl = (Math.random() - 0.5) * 0.7
      velocities[ix]     += (nx + -ny * swirl) * force
      velocities[ix + 1] += (ny + nx * swirl) * force
    }
  }
  container.addEventListener('mousemove', onMouse, { passive: true })
  container.addEventListener('mouseleave', onLeave)
  container.addEventListener('click', onClick)

  let scrollP = 0
  const onScroll = () => {
    bumpActivity()
    const rect = container.getBoundingClientRect()
    const hh = rect.height || 1
    scrollP = Math.max(0, Math.min(1, -rect.top / hh))
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const onResize = () => {
    w = container.clientWidth
    h = container.clientHeight
    camera.aspect = w / h
    camDist = h / (2 * Math.tan((fov * Math.PI) / 360))
    camera.position.z = camDist
    camera.updateProjectionMatrix()
    if (material) material.uniforms.uCamDist.value = camDist
    renderer.setSize(w, h)
    const prev = currentText
    sample(prev)
    assembleT = 1
  }
  window.addEventListener('resize', onResize)

  // Reduced-motion users opt out of the autonomous idle scatter.
  const prefersReducedMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches

  let raf = 0
  let assembleT = 0
  let lastT = performance.now()
  // Smoothed idle drift in [0, 1]. 0 = letters sit flush with their targets;
  // 1 = every particle is getting a random nudge each frame so the word
  // visibly falls apart. Follows (1 - recentActivity) so the moment the cursor
  // moves anywhere, the letters snap back into place.
  let idleDrift = 0
  const animate = (now: number) => {
    raf = requestAnimationFrame(animate)
    const dt = Math.min((now - lastT) / 1000, 0.05)
    lastT = now
    assembleT = Math.min(1, assembleT + dt * 0.55)

    mouseX += (targetMX - mouseX) * 0.05
    mouseY += (targetMY - mouseY) * 0.05

    if (!points || !geometry) return
    const posAttr = geometry.attributes.position as THREE.BufferAttribute
    const pa = posAttr.array as Float32Array
    const t = now * 0.001
    const ease = 1 - Math.pow(1 - assembleT, 3)
    if (material) material.uniforms.uFade.value = Math.min(1, assembleT * 1.6)
    const disperse = scrollP
    const disperseEase = disperse * disperse

    // Decay activity to 0 over ~3.5s of pure idle. Scroll/scatter block the
    // effect entirely (there's already a scroll-disperse happening — stacking
    // jitter on top would read as noise, not behaviour).
    recentActivity = Math.max(0, recentActivity - dt * 0.28)
    const targetDrift = prefersReducedMotion || disperse > 0.02
      ? 0
      : (1 - recentActivity)
    idleDrift += (targetDrift - idleDrift) * Math.min(1, dt * 2.8)

    const assembled = assembleT >= 1
    for (let i = 0; i < pointCount; i++) {
      const ix = i * 3, iy = ix + 1, iz = ix + 2
      const tx = targets[ix], ty = targets[iy]
      const seed = seeds[i]
      const driftX = Math.sin(t * 0.55 + seed * 0.11) * 1.4
      const driftY = Math.cos(t * 0.48 + seed * 0.17) * 1.4
      const driftZ = Math.sin(t * 0.33 + seed * 0.09) * 3.5

      const dispX = tx * disperseEase * 1.8 + Math.sin(seed * 5.2) * disperseEase * 220
      const dispY = ty * disperseEase * 1.8 + Math.cos(seed * 7.1) * disperseEase * 220
      const dispZ = disperse * 180 + Math.sin(seed * 3.7) * disperseEase * 280

      if (assembled) {
        velocities[ix] *= 0.94
        velocities[iy] *= 0.94
        // Idle scatter: random per-frame nudge, amplitude scales with
        // idleDrift. When the pointer moves, idleDrift → 0 and only the
        // homing force remains, pulling every letter back into place.
        if (idleDrift > 0.01) {
          const jitter = idleDrift * 1.15
          velocities[ix] += (Math.random() - 0.5) * jitter
          velocities[iy] += (Math.random() - 0.5) * jitter
        }
        const offMag2 = offsets[ix] * offsets[ix] + offsets[iy] * offsets[iy]
        // Stronger pull the further a point has drifted — snap back from explosions.
        let homeK = 0.02
        if (offMag2 > 4) homeK = 0.006 + Math.min(offMag2 / 90000, 0.018)
        // Homing boosts while the user is actively moving, so the "letters
        // snap back" moment reads as emphatic rather than slow drift-home.
        const homingBoost = 1 + recentActivity * 1.8
        velocities[ix] += -offsets[ix] * homeK * homingBoost
        velocities[iy] += -offsets[iy] * homeK * homingBoost
        offsets[ix] += velocities[ix]
        offsets[iy] += velocities[iy]
      } else {
        offsets[ix] = 0
        offsets[iy] = 0
        velocities[ix] = 0
        velocities[iy] = 0
      }

      const finalX = tx + driftX + dispX + offsets[ix]
      const finalY = ty + driftY + dispY + offsets[iy]
      const finalZ = 0 + driftZ + dispZ

      pa[ix] = scatter[ix] * (1 - ease) + finalX * ease
      pa[iy] = scatter[iy] * (1 - ease) + finalY * ease
      pa[iz] = scatter[iz] * (1 - ease) + finalZ * ease
    }
    posAttr.needsUpdate = true

    group.rotation.y = mouseX * 0.14
    group.rotation.x = -mouseY * 0.09
    group.position.z = disperse * -40
    // Subtle dolly-parallax — the camera slides a little opposite the pointer
    // so the group reads as sitting in 3D space, not just rotating flat.
    camera.position.x = -mouseX * 28
    camera.position.y = mouseY * 18
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(animate)

  return {
    cleanup: () => {
      cancelAnimationFrame(raf)
      container.removeEventListener('mousemove', onMouse)
      container.removeEventListener('mouseleave', onLeave)
      container.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      geometry?.dispose()
      material?.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    },
    resample: (newText: string) => {
      currentText = newText
      sample(newText)
      assembleT = 0
      for (let i = 0; i < pointCount; i++) {
        positions[i * 3] = scatter[i * 3]
        positions[i * 3 + 1] = scatter[i * 3 + 1]
        positions[i * 3 + 2] = scatter[i * 3 + 2]
      }
    },
  }
}

onMounted(async () => {
  loadGithub()
  await nextTick()
  // Sampling text glyphs onto an offscreen canvas falls back to Arial if
  // Onest hasn't downloaded yet — wait for the family before measuring.
  try { await document.fonts.load('700 100px "Onest"') } catch { /* no-op */ }
  if (heroRoot.value) {
    const result = initHero(heroRoot.value, t('name'))
    cleanup = result.cleanup
    resample = result.resample
  }
})

watch(locale, () => {
  if (resample) resample(t('name'))
})

onUnmounted(() => { cleanup?.() })

function scrollNext() {
  const target = document.getElementById('experience')
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section id="hero" class="hero-section" data-snap-segments="1" data-snap-vp="1">
    <div class="hero__content" ref="heroRoot">
      <!-- top corners — mirrored key/value notes framing the name:
           left = what i'm after, right = the basics -->
      <dl class="hero__corner hero__corner--left">
        <div class="hero__corner-head" :style="{ '--i': 0 }">{{ t('lookingFor.title') }}</div>
        <div v-for="(l, i) in looking" :key="i" class="hero__corner-row" :style="{ '--i': i + 1 }">
          <dt class="hero__corner-k">{{ l.k }}</dt>
          <dd class="hero__corner-v">{{ l.v }}</dd>
        </div>
      </dl>

      <dl class="hero__corner hero__corner--right">
        <div class="hero__corner-head" :style="{ '--i': 0 }">{{ t('profileLabel') }}</div>
        <div v-for="(m, i) in meta" :key="i" class="hero__corner-row" :style="{ '--i': i + 1 }">
          <dt class="hero__corner-k">{{ m.k }}</dt>
          <dd class="hero__corner-v">{{ m.v }}</dd>
        </div>
      </dl>

      <div class="hero__bottom">
        <div class="hero__left">
          <span class="hero__label">
            <span class="hero__dot"></span>
            <span
              class="hero__label-txt"
              data-entrance="mask"
              data-split="chars"
              style="--entrance-delay: 0.4s; --entrance-duration: 1.2s;"
            >{{ t('heroLabels.availableForHire') }}</span>
          </span>
          <p
            class="hero__desc"
            data-entrance="mask"
            data-split="words"
            style="--entrance-delay: 0.6s;"
          ><em>{{ t('role') }}</em></p>
          <div class="hero__activity">
            <a class="hero__activity-cap" :href="ghUrl" target="_blank" rel="noopener">
              <span class="hero__activity-dot" :class="{ 'is-live': isLive }" aria-hidden="true" />
              {{ t('activityLabel') }}
              <span class="hero__activity-arrow" aria-hidden="true">↗</span>
            </a>
            <div class="hero__weeks" aria-hidden="true">
              <span
                v-for="(lvl, i) in activity"
                :key="i"
                class="hero__week"
                :data-lvl="lvl"
                :style="{ '--i': i }"
              />
            </div>
          </div>
          <a class="hero__cv" :href="cvHref" download>
            <span class="hero__cv-ic" aria-hidden="true">↓</span>
            {{ t('cvLabel') }}
          </a>
        </div>
        <div class="hero__right">
          <p
            class="hero__bio"
            data-entrance="mask-fade"
            data-split="words"
            style="--entrance-delay: 0.85s; --entrance-duration: 1.6s;"
          >{{ t('heroBio') }}</p>
          <p class="hero__meta hero__meta--look">
            <span class="hero__meta-lead">{{ t('lookingFor.title') }} —</span>
            <template v-for="(l, i) in looking" :key="i"
              >{{ l.v }}<span v-if="i < looking.length - 1" class="hero__meta-sep" aria-hidden="true"> · </span></template>
          </p>
          <p class="hero__meta">
            <template v-for="(m, i) in meta" :key="i"
              >{{ m.v }}<span v-if="i < meta.length - 1" class="hero__meta-sep" aria-hidden="true"> · </span></template>
          </p>
        </div>
      </div>
      <a
        href="#experience"
        class="hero__scroll"
        aria-label="scroll to experience"
        @click.prevent="scrollNext"
      >
        <span class="hero__scroll-inner">
          <span class="hero__scroll-txt">{{ t('heroScroll') }}</span>
          <svg
            class="hero__scroll-svg"
            viewBox="0 0 6 50"
            width="6"
            height="50"
            aria-hidden="true"
          >
            <line x1="3" y1="0" x2="3" y2="50" stroke="currentColor" stroke-width="1" stroke-opacity="0.22" />
            <line class="hero__scroll-svg-dot" x1="3" y1="0" x2="3" y2="12" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round" />
          </svg>
        </span>
      </a>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  height: 100svh;
  display: flex;
  flex-direction: column;
}

.hero__content {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

:deep(.hero__canvas) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 1;
}

.hero__bottom {
  position: absolute;
  bottom: 60px;
  left: 32px;
  right: 32px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  pointer-events: none;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    left: 16px;
    right: 16px;
    bottom: 24px;
  }
}

.hero__left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* Exit on scroll — slides out, fades and slightly blurs as it leaves. */
  --exit: clamp(0, calc(var(--scroll-progress, 0) * 14), 1);
  translate: calc(var(--exit) * -140px) 0;
  opacity: calc(1 - var(--exit) * 1.15);
  filter: blur(calc(var(--exit) * 3px));
  will-change: translate, opacity, filter;
}
.hero__label {
  font-size: 13px;
  letter-spacing: 0;
  color: var(--fg);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.hero__dot {
  width: 9px;
  height: 9px;
  background: var(--accent);
  flex-shrink: 0;
  /* mask-reveal adds bottom padding to the text tokens, nudging the flex
     centre up — push the dot back down onto the text's optical middle */
  transform: translateY(1px);
}
.hero__desc {
  font-family: var(--font-sans);
  font-size: clamp(15px, 1.6vw, 20px);
  font-weight: 500;
  color: var(--fg);
  max-width: 320px;
  line-height: 1.35;
  em { font-style: normal; }
}

/* Weekly activity strip — a compact "shipping rhythm" beneath the role.
   Tiles ripple in left→right after the role has set. */
.hero__activity {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
}
.hero__activity-cap {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.25s ease;

  &:hover { color: var(--accent); }
}
.hero__activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  opacity: 0.6;
  &.is-live {
    background: var(--accent);
    opacity: 1;
    animation: hero-live 1.8s ease-in-out infinite;
  }
}
@keyframes hero-live {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.6); }
}
.hero__activity-arrow {
  font-size: 9px;
  opacity: 0.7;
  transition: transform 0.3s ease;
}
.hero__activity-cap:hover .hero__activity-arrow { transform: translate(2px, -2px); }

.hero__weeks {
  display: flex;
  gap: 4px;

  @media (max-width: 440px) { gap: 3px; }
}
.hero__week {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  /* no border — empty cells are a faint theme-aware fill, like a clean heatmap */
  background: color-mix(in srgb, var(--fg) 9%, transparent);
  opacity: 0;
  transform: scale(0);
  transform-origin: center;

  &[data-lvl='1'] { background: color-mix(in srgb, var(--accent) 32%, transparent); }
  &[data-lvl='2'] { background: color-mix(in srgb, var(--accent) 56%, transparent); }
  &[data-lvl='3'] { background: color-mix(in srgb, var(--accent) 80%, transparent); }
  &[data-lvl='4'] { background: var(--accent); }

  @media (max-width: 768px) { width: 12px; height: 12px; }
  @media (max-width: 440px) { width: 9px; height: 9px; }
}
html.is-ready .hero__week {
  animation: hero-week-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(1s + var(--i) * 0.028s) forwards;
}
@keyframes hero-week-in {
  to { opacity: 1; transform: scale(1); }
}

/* CV download — small outlined link beneath the activity strip. */
.hero__cv {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 7px 14px;
  border: 1px solid var(--border);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--fg);
  text-decoration: none;
  pointer-events: auto;
  transition: border-color 0.25s ease, color 0.25s ease, background-color 0.25s ease;

  &:hover { border-color: var(--accent); color: #fff; background: var(--accent); }
}
.hero__cv-ic { color: var(--accent); transition: transform 0.3s ease; }
.hero__cv:hover .hero__cv-ic { color: #fff; transform: translateY(2px); }

/* Top corners — two mirrored key/value notes that frame the name. Identical
   styling, only the alignment flips. Desktop only; on mobile the compact
   .hero__meta line carries the profile facts instead. */
.hero__corner {
  position: absolute;
  top: 76px;
  z-index: 3;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 36vw;
  pointer-events: none;
}
.hero__corner--left { left: 32px; align-items: flex-start; }
.hero__corner--right { right: 32px; align-items: flex-end; }

.hero__corner-head {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 4px;
}

.hero__corner-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
/* mirror: on the right the key sits on the outer (right) edge */
.hero__corner--right .hero__corner-row { flex-direction: row-reverse; }

.hero__corner-k {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.55;
}

.hero__corner-v {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--fg);
}
.hero__corner--right .hero__corner-v { text-align: right; }

/* entrance — each corner slides in from its own edge */
.hero__corner-head,
.hero__corner-row { opacity: 0; }
.hero__corner--left .hero__corner-head,
.hero__corner--left .hero__corner-row { transform: translateX(-12px); }
.hero__corner--right .hero__corner-head,
.hero__corner--right .hero__corner-row { transform: translateX(12px); }
html.is-ready .hero__corner-head,
html.is-ready .hero__corner-row {
  animation: hero-corner-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) calc(0.6s + var(--i) * 0.07s) forwards;
}
@keyframes hero-corner-in { to { opacity: 1; transform: translateX(0); } }

/* Key facts — single mono line under the bio. Mobile fallback for the corners. */
.hero__meta {
  display: none;
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: var(--muted);
}
.hero__meta-sep { color: var(--accent); opacity: 0.6; }
.hero__meta--look { margin-top: 14px; opacity: 1; }
.hero__meta-lead {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 9px;
  margin-right: 6px;
}

@media (max-width: 900px) {
  .hero__corner { display: none; }
}
@media (max-width: 768px) {
  .hero__meta { display: block; opacity: 0.85; }
  .hero__cv { margin-top: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .hero__corner-head, .hero__corner-row { opacity: 1; transform: none; animation: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__week { opacity: 1; transform: none; animation: none; }
  .hero__meta { opacity: 0.85; animation: none; }
  .hero__activity-dot.is-live { animation: none; }
}
.hero__right {
  max-width: 440px;
  text-align: right;
  /* Mirror of hero__left — slides right, fades, blurs. */
  --exit: clamp(0, calc(var(--scroll-progress, 0) * 14), 1);
  translate: calc(var(--exit) * 140px) 0;
  opacity: calc(1 - var(--exit) * 1.15);
  filter: blur(calc(var(--exit) * 3px));
  will-change: translate, opacity, filter;

  @media (max-width: 768px) {
    text-align: left;
    max-width: 100%;
  }
}
.hero__bio {
  font-size: 15px;
  line-height: 1.65;
  color: var(--fg);
  opacity: 0.85;
}

.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 28px;
  z-index: 2;
  color: var(--muted);
  text-decoration: none;
  pointer-events: auto;
  /* Outer handles entrance — appears after particles + bottom row are settled. */
  opacity: 0;
  transform: translate(-50%, 8px);
  animation: hero-scroll-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.6s forwards;
  transition: color 0.3s ease;

  &:hover { color: var(--accent); }

  @media (max-width: 768px) { display: none; }
}
@keyframes hero-scroll-in {
  to { opacity: 1; transform: translate(-50%, 0); }
}

.hero__scroll-inner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  /* Fade + drift down on scroll — separate from entrance animation on outer.
     `translate` composes with the hover `transform` so they don't clobber. */
  opacity: clamp(0, calc(1 - var(--scroll-progress, 0) * 14), 1);
  translate: 0 calc(clamp(0, calc(var(--scroll-progress, 0) * 14), 1) * 40px);
  transition: transform 0.3s ease;
}
.hero__scroll:hover .hero__scroll-inner { transform: translateY(-2px); }

.hero__scroll-txt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.25em;
  /* Compensate trailing letter-spacing so text optically centres above the line. */
  padding-left: 0.25em;
  text-transform: uppercase;
  line-height: 1;
}

.hero__scroll-svg {
  display: block;
  overflow: visible;
}
.hero__scroll-svg-dot {
  transform-origin: center;
  animation: hero-scroll-dot 1.9s cubic-bezier(0.55, 0, 0.45, 1) infinite;
}
@keyframes hero-scroll-dot {
  0%   { transform: translateY(-14px); opacity: 0; }
  18%, 70% { opacity: 1; }
  100% { transform: translateY(50px); opacity: 0; }
}
</style>
