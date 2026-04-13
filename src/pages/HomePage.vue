<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'

const { t, tm } = useI18n()

const links = [
  { label: 'GITHUB', href: 'https://github.com/denis-sofonov' },
  { label: 'TELEGRAM', href: 'https://t.me/denis_sofonov' },
  { label: 'EMAIL', href: 'mailto:denissofonovv@gmail.com' },
]

interface StackGroup {
  label: string
  items: string[]
}

interface Project {
  name: string
  desc: string
  stack: string
}

interface Service {
  name: string
  desc: string
}

interface Demo {
  name: string
  niche: string
  desc: string
  stack: string
  href: string
}

interface Job {
  period: string
  company: string
  role: string
  desc: string
  metrics: string[]
}

const marqueeText = 'FRONTEND — BACKEND — ARCHITECTURE — SYSTEMS — DESIGN — TYPESCRIPT — VUE — NUXT — NODE — '

// Scroll progress (0..1) — drives top progress bar
const scrollProgress = ref(0)

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

// ============================================
// GITHUB ACTIVITY GRID
// ============================================
interface ActivityDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

const activityWeeks = ref<ActivityDay[][]>([])
const activityTotal = ref(0)

// Compact 12-week view for hero sidebar
const activityRecentWeeks = computed(() => activityWeeks.value.slice(-12))
const activityRecentTotal = computed(() =>
  activityRecentWeeks.value.flat().reduce((s, d) => s + d.count, 0),
)
const activityLoading = ref(true)
const activityError = ref(false)
const hoveredDay = ref<ActivityDay | null>(null)

// Convert raw count to level 0-4 (brutalist scale)
function toLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

// Generate deterministic mock data — for fallback if API fails
function generateMockActivity(): ActivityDay[] {
  const days: ActivityDay[] = []
  const today = new Date()
  // Start 53 weeks ago, snap to Sunday
  const start = new Date(today)
  start.setDate(today.getDate() - 53 * 7)
  start.setDate(start.getDate() - start.getDay())

  for (let i = 0; i < 53 * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    if (d > today) break
    // Deterministic pseudo-random: more activity on weekdays
    const dow = d.getDay()
    const seed = (d.getTime() / 86400000) % 100
    const isWeekend = dow === 0 || dow === 6
    let count = 0
    const r = (Math.sin(seed) + 1) / 2 // 0..1
    if (r < 0.3) count = 0
    else if (r < 0.55) count = isWeekend ? 0 : Math.floor(r * 4) + 1
    else if (r < 0.8) count = Math.floor(r * 8) + 1
    else if (r < 0.95) count = Math.floor(r * 12) + 3
    else count = Math.floor(r * 18) + 8
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
      level: toLevel(count),
    })
  }
  return days
}

function groupIntoWeeks(days: ActivityDay[]): ActivityDay[][] {
  // Pad start so first week starts on Sunday
  const first = new Date(days[0].date)
  const padStart = first.getDay()
  const padded: (ActivityDay | null)[] = [
    ...Array(padStart).fill(null),
    ...days,
  ]
  // Group into weeks of 7
  const weeks: ActivityDay[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7).filter(Boolean) as ActivityDay[])
  }
  return weeks
}

// Try to fetch real GitHub contributions, falling through API providers.
// Each provider returns slightly different shapes — normalize before use.
async function fetchFromProvider(url: string): Promise<ActivityDay[]> {
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()

  // Provider 1 — github-contributions-api.deno.dev
  // Shape: { contributions: [[{date, contributionCount, color}, ...], ...] }
  if (Array.isArray(data.contributions)) {
    return data.contributions
      .flat()
      .filter((d: any) => d && d.date && typeof d.contributionCount === 'number')
      .map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
        level: toLevel(d.contributionCount),
      }))
  }

  // Provider 2 — github-contributions-api.jogruber.de
  // Shape: { total: { lastYear: 123 }, contributions: [{ date, count, level }, ...] }
  if (data.contributions && Array.isArray(data.contributions)) {
    return data.contributions.map((d: any) => ({
      date: d.date,
      count: d.count ?? 0,
      level: toLevel(d.count ?? 0),
    }))
  }

  throw new Error('Unknown shape')
}

async function loadActivity() {
  activityLoading.value = true
  const username = 'denis-sofonov'
  // Try multiple providers in order
  const providers = [
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    `https://github-contributions-api.deno.dev/${username}.json`,
  ]

  for (const url of providers) {
    try {
      const days = await fetchFromProvider(url)
      if (days.length > 0) {
        const last = days.slice(-53 * 7)
        activityWeeks.value = groupIntoWeeks(last)
        activityTotal.value = last.reduce((s, d) => s + d.count, 0)
        activityError.value = false
        activityLoading.value = false
        return
      }
    } catch (e) {
      // Try next provider silently
    }
  }

  // All providers failed — fallback to mock data
  activityError.value = true
  const mock = generateMockActivity()
  activityWeeks.value = groupIntoWeeks(mock)
  activityTotal.value = mock.reduce((s, d) => s + d.count, 0)
  activityLoading.value = false
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ============================================
// GPU ASCII HERO — fullscreen shader post-processing
// ============================================
const heroCanvas = ref<HTMLCanvasElement | null>(null)
let asciiCleanup: (() => void) | null = null


function initAsciiHero(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = 3.2

  // Lights
  const light1 = new THREE.DirectionalLight(0xffffff, 2)
  light1.position.set(3, 4, 5)
  scene.add(light1)
  const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
  light2.position.set(-3, -2, 3)
  scene.add(light2)
  scene.add(new THREE.AmbientLight(0xffffff, 0.2))

  // Morphing sphere — vertex displacement with noise
  const sphereGeo = new THREE.SphereGeometry(2.2, 64, 64)
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.6,
  })
  const sphere = new THREE.Mesh(sphereGeo, sphereMat)
  scene.add(sphere)

  // Store original positions for noise displacement
  const posAttr = sphereGeo.attributes.position
  const origPositions = new Float32Array(posAttr.array.length)
  origPositions.set(posAttr.array as Float32Array)

  function noise3D(x: number, y: number, z: number): number {
    return Math.sin(x * 1.1 + y * 2.3 + z * 0.7) *
           Math.cos(y * 1.7 + z * 3.1 + x * 0.5) *
           Math.sin(z * 2.5 + x * 1.3 + y * 0.9)
  }

  // Get accent color
  const rootStyles = getComputedStyle(document.documentElement)
  const accentHex = rootStyles.getPropertyValue('--accent').trim() || '#FF5C00'

  // Three.js AsciiEffect — DOM-based, pixel-perfect characters
  const effect = new AsciiEffect(renderer, ` .:-=+*#%@`, {
    resolution: 0.3,
    scale: 1,
    color: false,
    invert: true,
  })

  const parent = canvas.parentElement!
  effect.setSize(parent.clientWidth, parent.clientHeight)
  effect.domElement.style.color = accentHex
  effect.domElement.style.backgroundColor = 'transparent'
  effect.domElement.style.position = 'absolute'
  effect.domElement.style.inset = '0'
  effect.domElement.style.width = '100%'
  effect.domElement.style.height = '100%'
  effect.domElement.style.overflow = 'hidden'
  effect.domElement.style.zIndex = '0'
  effect.domElement.style.pointerEvents = 'none'
  effect.domElement.style.fontFamily = '"Space Mono", monospace'

  // Fit ASCII characters to full container width by adjusting letter-spacing
  const asciiTable = effect.domElement.querySelector('table') as HTMLTableElement
  function fitAsciiWidth() {
    const td = asciiTable?.querySelector('td') as HTMLElement | null
    if (!td) return
    // Temporarily reset letter-spacing & td width to measure natural text width
    const origLS = asciiTable.style.letterSpacing
    const origTdW = td.style.width
    asciiTable.style.letterSpacing = '0px'
    td.style.width = 'auto'
    const naturalW = td.scrollWidth
    const targetW = parent.clientWidth
    if (naturalW > 0) {
      // chars per row
      const charsPerRow = Math.floor(targetW * 0.3) // resolution = 0.3
      const extraPerChar = (targetW - naturalW) / charsPerRow
      asciiTable.style.letterSpacing = `${extraPerChar}px`
    } else {
      asciiTable.style.letterSpacing = origLS
    }
    td.style.width = origTdW
  }
  parent.appendChild(effect.domElement)
  // Hide the raw WebGL canvas
  canvas.style.display = 'none'

  // Mouse tracking
  const mouse = { x: 0, y: 0 }
  const smoothMouse = { x: 0, y: 0 }

  function onMouseMove(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  function resize() {
    const w = parent.clientWidth
    const h = parent.clientHeight
    renderer.setSize(w, h)
    effect.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    fitAsciiWidth()
  }

  resize()

  let animId = 0
  function animate() {
    animId = requestAnimationFrame(animate)
    const t = performance.now() * 0.001

    // Smooth mouse
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05

    // Rotate sphere — very slow, ambient
    sphere.rotation.x = t * 0.03 + smoothMouse.y * 0.3
    sphere.rotation.y = t * 0.04 + smoothMouse.x * 0.3

    // Vertex displacement — gentle breathing
    const pos = posAttr.array as Float32Array
    for (let i = 0; i < pos.length; i += 3) {
      const ox = origPositions[i]
      const oy = origPositions[i + 1]
      const oz = origPositions[i + 2]
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
      const nx = ox / len
      const ny = oy / len
      const nz = oz / len
      const displacement = noise3D(
        ox * 1.2 + t * 0.06,
        oy * 1.2 + t * 0.05,
        oz * 1.2 + t * 0.07,
      ) * 0.25
      pos[i] = ox + nx * displacement
      pos[i + 1] = oy + ny * displacement
      pos[i + 2] = oz + nz * displacement
    }
    posAttr.needsUpdate = true
    sphereGeo.computeVertexNormals()

    effect.render(scene, camera)
    fitAsciiWidth()
  }

  animate()
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('resize', resize)

  // Theme change — update accent color
  const observer = new MutationObserver(() => {
    const s = getComputedStyle(document.documentElement)
    const newAccent = s.getPropertyValue('--accent').trim()
    if (newAccent) effect.domElement.style.color = newAccent
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', resize)
    observer.disconnect()
    sphereGeo.dispose()
    sphereMat.dispose()
    renderer.dispose()
    if (effect.domElement.parentNode) effect.domElement.parentNode.removeChild(effect.domElement)
  }
}

onMounted(() => {
  loadActivity()
  updateScrollProgress()
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress)
  if (heroCanvas.value) {
    asciiCleanup = initAsciiHero(heroCanvas.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
  if (asciiCleanup) asciiCleanup()
})
</script>

<template>
  <main class="home">
    <!-- SCROLL PROGRESS — fills as you scroll -->
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }" />

    <!-- HERO -->
    <section id="hero" class="hero">
      <!-- GPU ASCII canvas — fullscreen background -->
      <canvas ref="heroCanvas" class="hero__ascii-bg"></canvas>
      <div class="hero__body">
        <div class="hero__main">
          <div class="hero__prompt">&gt;<span class="hero__cursor">_</span></div>
          <h1 class="hero__name" :data-text="t('name')">{{ t('name') }}</h1>
          <div class="hero__role">{{ t('role') }}</div>
          <div class="hero__tags">
            <span class="hero__tag">{{ t('experience') }}</span>
            <span class="hero__tag">{{ t('location') }}</span>
          </div>

          <!-- Quick pitch — multi-line statement -->
          <p class="hero__pitch">{{ t('heroPitch') }}</p>

          <!-- Stats bar — 4 quick numbers -->
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-num">4<em>+</em></span>
              <span class="hero__stat-lbl">{{ t('heroStats.years') }}</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-num">40<em>+</em></span>
              <span class="hero__stat-lbl">{{ t('heroStats.projects') }}</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-num">5</span>
              <span class="hero__stat-lbl">{{ t('heroStats.teams') }}</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-num">0<em>→</em>1</span>
              <span class="hero__stat-lbl">{{ t('heroStats.shipped') }}</span>
            </div>
          </div>

          <!-- Currently shipping -->
          <div class="hero__current">
            <span class="hero__current-dot"></span>
            <span class="hero__current-label">{{ t('heroLabels.currentlyShipping') }}</span>
            <span class="hero__current-text">{{ t('heroCurrent') }}</span>
          </div>
        </div>

        <aside class="hero__sidebar">
          <div class="hero__meta-row">
            <span class="hero__meta-key">{{ t('heroLabels.status') }}</span>
            <span class="hero__meta-val hero__meta-val--accent">{{ t('heroLabels.availableForHire') }}</span>
          </div>
          <div class="hero__meta-row">
            <span class="hero__meta-key">{{ t('heroLabels.work') }}</span>
            <span class="hero__meta-val">{{ t('heroLabels.workVal') }}</span>
          </div>
          <div class="hero__meta-row">
            <span class="hero__meta-key">CORE</span>
            <span class="hero__meta-val">JS / TS / VUE / NUXT / NODE</span>
          </div>
          <div class="hero__meta-row">
            <span class="hero__meta-key">{{ t('heroLabels.focus') }}</span>
            <span class="hero__meta-val">{{ t('heroLabels.focusVal') }}</span>
          </div>
          <div class="hero__meta-row">
            <span class="hero__meta-key">ARCH</span>
            <span class="hero__meta-val">DDD / MICRO-FRONTENDS / MONOREPO</span>
          </div>
          <div class="hero__meta-row">
            <span class="hero__meta-key">{{ t('heroLabels.lang') }}</span>
            <span class="hero__meta-val">{{ t('heroLabels.langVal') }}</span>
          </div>
          <div class="hero__meta-row">
            <span class="hero__meta-key">{{ t('heroLabels.links') }}</span>
            <span class="hero__meta-val"><a href="https://github.com/denis-sofonov" target="_blank" rel="noopener noreferrer" class="hero__link">GH</a> / <a href="https://t.me/denis_sofonov" target="_blank" rel="noopener noreferrer" class="hero__link">TG</a></span>
          </div>

          <!-- Compact GitHub activity widget — last 12 weeks -->
          <div class="hero__activity">
            <div class="hero__activity-head">
              <span class="hero__activity-label">{{ t('heroLabels.activity') }}</span>
              <span class="hero__activity-total">
                {{ activityLoading ? '...' : `${activityRecentTotal} ${t('heroLabels.commits')}` }}
              </span>
            </div>
            <div class="hero__activity-grid">
              <div
                v-for="(week, wi) in activityRecentWeeks"
                :key="wi"
                class="hero__activity-col"
              >
                <div
                  v-for="(day, di) in week"
                  :key="di"
                  class="hero__activity-cell"
                  :class="`hero__activity-cell--${day.level}`"
                  :title="`${day.count} on ${day.date}`"
                />
              </div>
            </div>
            <div class="hero__activity-foot">
              <span>github.com/denis-sofonov</span>
              <span v-if="activityError">· mock</span>
            </div>
          </div>

        </aside>
      </div>
    </section>

    <!-- META DIVIDER — typographic transition between hero and about -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.about.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('metaBars.about.name') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.about.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.about.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.about.accent') }}</span>
    </div>

    <!-- STATEMENT -->
    <section id="about" class="statement">
      <div class="statement__body">
        <span class="statement__quote-mark" aria-hidden="true">"</span>
        <p class="statement__text">{{ t('statement') }}</p>
      </div>
    </section>

    <!-- HIGHLIGHTS -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.highlights.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('highlights.title') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.highlights.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.highlights.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.highlights.accent') }}</span>
    </div>
    <section id="highlights" class="highlights">
      <div class="highlights__grid">
        <div
          v-for="(item, i) in (tm('highlights.items') as any[])"
          :key="i"
          class="highlights__cell"
        >
          <span class="highlights__index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="highlights__text">{{ item }}</span>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.services.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('services.title') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.services.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.services.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.services.accent') }}</span>
    </div>
    <section id="services" class="services">
      <div class="services__list">
        <div
          v-for="(service, i) in (tm('services.items') as Service[])"
          :key="i"
          class="services__row"
        >
          <span class="services__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="services__body">
            <h3 class="services__name">{{ service.name }}</h3>
            <p class="services__desc">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROJECTS -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.projects.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('projects.title') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.projects.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.projects.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.projects.accent') }}</span>
    </div>
    <section id="projects" class="projects">
      <div class="projects__grid">
        <div
          v-for="(project, i) in (tm('projects.items') as Project[])"
          :key="i"
          class="projects__card"
        >
          <div class="projects__head">
            <span class="projects__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="projects__name">{{ project.name }}</h3>
          </div>
          <p class="projects__desc">{{ project.desc }}</p>
          <div class="projects__stack">{{ project.stack }}</div>
        </div>
      </div>
    </section>

    <!-- DEMO BUILDS -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.demos.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('demos.title') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.demos.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.demos.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.demos.accent') }}</span>
    </div>
    <section id="demos" class="demos">
      <div class="demos__disclaimer">{{ t('demos.disclaimer') }}</div>
      <div class="demos__list">
        <router-link
          v-for="(demo, i) in (tm('demos.items') as Demo[])"
          :key="i"
          :to="demo.href"
          class="demos__card"
        >
          <div class="demos__head">
            <span class="demos__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="demos__action">{{ t('demos.view') }} →</span>
          </div>
          <h3 class="demos__name">{{ demo.name }}</h3>
          <div class="demos__niche">{{ demo.niche }}</div>
          <p class="demos__desc">{{ demo.desc }}</p>
          <div class="demos__stack">{{ demo.stack }}</div>
        </router-link>
      </div>
    </section>

    <!-- MARQUEE 2 -->
    <div class="marquee marquee--accent">
      <div class="marquee__track marquee__track--reverse">
        <span v-for="n in 10" :key="n" class="marquee__text">{{ marqueeText }}</span>
      </div>
    </div>

    <!-- EXPERIENCE -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.experience.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('jobs.title') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.experience.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.experience.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.experience.accent') }}</span>
    </div>
    <section id="experience" class="exp">
      <div class="exp__list">
        <div
          v-for="(job, i) in (tm('jobs.items') as Job[])"
          :key="i"
          class="exp__row"
          :class="{ 'exp__row--current': i === 0 }"
        >
          <div class="exp__left">
            <span class="exp__period">{{ job.period }}</span>
            <span v-if="i === 0" class="exp__now">NOW</span>
          </div>
          <div class="exp__right">
            <div class="exp__header">
              <span class="exp__company">{{ job.company }}</span>
              <span class="exp__role">{{ job.role }}</span>
            </div>
            <p class="exp__desc">{{ job.desc }}</p>
            <div class="exp__metrics">
              <span v-for="m in job.metrics" :key="m" class="exp__metric">{{ m }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STACK -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.stack.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('stack.title') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.stack.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.stack.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.stack.accent') }}</span>
    </div>
    <section id="stack" class="tech">
      <div class="tech__groups">
        <div
          v-for="group in (tm('stack.groups') as StackGroup[])"
          :key="group.label"
          class="tech__group"
        >
          <div class="tech__label">{{ group.label }}</div>
          <div class="tech__items">
            <span v-for="item in group.items" :key="item" class="tech__tag">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <div class="brut-meta-bar">
      <span class="brut-meta-bar__num">{{ t('metaBars.contact.num') }}</span>
      <span class="brut-meta-bar__text">{{ t('links') }}</span>
      <span class="brut-meta-bar__line" />
      <span class="brut-meta-bar__text">{{ t('metaBars.contact.right') }}</span>
      <span class="brut-meta-bar__sep">{{ t('metaBars.contact.sep') }}</span>
      <span class="brut-meta-bar__text brut-meta-bar__text--accent">{{ t('metaBars.contact.accent') }}</span>
    </div>
    <section id="contact" class="contact">
      <div class="contact__cta">
        <span class="contact__cta-title">{{ t('cta.title') }}</span>
        <span class="contact__cta-sub">{{ t('cta.subtitle') }}</span>
      </div>
      <div class="contact__grid">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="contact__link"
        >
          <span>{{ link.label }}</span>
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.home {
  flex: 1;
  width: 100%;
  margin-top: 42px; // header height
}

// ==========================================
// SCROLL PROGRESS — thin bar that fills as you scroll
// ==========================================
.scroll-progress {
  position: fixed;
  top: 42px; // sits right under the header
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  transform-origin: left center;
  transform: scaleX(0);
  z-index: 99;
  // No transition — instant tracking, brutalist
  pointer-events: none;
}

// ==========================================
// HERO
// ==========================================
.hero {
  // Use small viewport height — accounts for browser chrome on Mac/mobile
  min-height: 100svh;
  min-height: 100vh; // fallback
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid var(--border);
  position: relative;
  background: var(--bg);
}

.hero__body {
  display: flex;
  width: 100%;
  flex: 1;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.hero__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 64px 32px 80px;
  background: color-mix(in srgb, var(--bg) 45%, transparent);

  @media (max-width: 768px) {
    padding: 56px 16px 56px;
  }
}

.hero__prompt {
  font-size: clamp(18px, 2.5vw, 32px);
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 16px;
}

.hero__cursor {
  animation: blink 1s step-end infinite;
}

.hero__name {
  font-size: clamp(36px, 7vw, 96px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
  white-space: nowrap;
  @media (max-width: 600px) {
    font-size: clamp(28px, 9vw, 56px);
    white-space: normal;
  }
}

.hero__role {
  font-size: clamp(20px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: 0.05em;
  background: var(--accent);
  color: #fff;
  padding: 12px 24px;
  border: 2px solid var(--accent);
  display: inline-block;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: clamp(16px, 4vw, 24px);
    padding: 10px 16px;
  }
}

.hero__tags {
  display: flex;
  flex-wrap: wrap;
}

.hero__tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 8px 16px;
  border: 2px solid var(--border);
  margin-right: -2px;
  margin-bottom: -2px;

  &:hover {
    background: var(--fg);
    color: var(--bg);
  }
}

// ============================================
// HERO PITCH — multi-line statement
// ============================================
.hero__pitch {
  font-size: clamp(14px, 1.2vw, 17px);
  line-height: 1.55;
  font-weight: 400;
  color: var(--fg);
  max-width: 920px;
  margin: 32px 0 0;
  padding: 24px 0 0;
  border-top: 1px solid var(--border);
  position: relative;

  // Decorative serif italic quote glyph as visual anchor (not first-letter)
  &::before {
    content: '§';
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 2.4em;
    line-height: 0;
    color: var(--accent);
    margin-right: 12px;
    vertical-align: -0.15em;
    display: inline-block;
  }
}

// ============================================
// HERO STATS BAR — 4 quick numbers
// ============================================
.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 2px solid var(--border);
  margin-top: 32px;
  max-width: 920px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.hero__stat {
  padding: 16px 18px;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: none;

  &:last-child { border-right: none; }

  @media (max-width: 768px) {
    &:nth-child(2) { border-right: none; }
    &:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  }

  &:hover {
    background: var(--fg);
    color: var(--bg);

    .hero__stat-num em { color: var(--accent); }
  }
}

.hero__stat-num {
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;

  em {
    font-style: normal;
    color: var(--accent);
  }
}

.hero__stat-lbl {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--muted);
  text-transform: uppercase;
}

// ============================================
// CURRENTLY SHIPPING
// ============================================
.hero__current {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 14px 18px;
  background: var(--fg);
  color: var(--bg);
  max-width: 920px;
  flex-wrap: wrap;
}

.hero__current-dot {
  width: 8px;
  height: 8px;
  border-radius: 0;
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent);
  flex-shrink: 0;
  animation: brutCurrentPulse 1.4s ease-in-out infinite;
}

@keyframes brutCurrentPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--accent); opacity: 1; }
  50% { box-shadow: 0 0 0 4px transparent; opacity: 0.5; }
}

.hero__current-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--accent);
  text-transform: uppercase;
}

.hero__current-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--bg);
  letter-spacing: 0.02em;
}

// Metadata sidebar — dense info panel
.hero__sidebar {
  width: 340px;
  border-left: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 64px;
  background: color-mix(in srgb, var(--bg) 45%, transparent);
  flex-shrink: 0;

  @media (max-width: 1100px) {
    width: 280px;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 2px solid var(--border);
  }
}

.hero__meta-row {
  display: flex;
  border-bottom: 1px solid var(--border);
  transition: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--fg);
    color: var(--bg);

    .hero__meta-key {
      color: var(--bg);
      background: var(--fg);
      border-color: var(--bg);
    }

    .hero__meta-val {
      color: var(--bg);
    }

    .hero__meta-val--accent {
      color: var(--accent);
    }
  }
}

.hero__meta-key {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--muted);
  padding: 12px 14px;
  width: 76px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
}

.hero__meta-val {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 12px 14px;
  display: flex;
  align-items: center;
}

.hero__meta-val--accent {
  color: var(--accent);
  background: var(--fg);
  padding: 4px 8px;
  font-weight: 900;
}

.hero__link {
  color: var(--fg);
  text-decoration: underline;
  font-weight: 700;

  &:hover {
    color: var(--accent);
  }
}

// ============================================
// COMPACT ACTIVITY WIDGET — in hero sidebar
// ============================================
.hero__activity {
  border-top: 2px solid var(--border);
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero__activity-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.hero__activity-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--muted);
  text-transform: uppercase;
}

.hero__activity-total {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--accent);
}

.hero__activity-grid {
  display: flex;
  gap: 3px;
  width: 100%;
  justify-content: space-between;
}

.hero__activity-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.hero__activity-cell {
  width: 100%;
  aspect-ratio: 1;
  max-width: 16px;
  border: 1px solid var(--border);
  background: var(--bg);
  transition: none;

  &:hover {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
  }

  &--0 { background: var(--bg); }
  &--1 { background: var(--border-subtle, #c4beb0); }
  &--2 { background: var(--muted); }
  &--3 { background: var(--fg); opacity: 0.6; }
  &--4 {
    background: var(--accent);
    border-color: var(--accent);
  }
}

:root[data-theme='dark'] .hero__activity-cell {
  &--1 { background: #2a2418; }
  &--2 { background: #5a5448; }
  &--3 { background: #888278; }
}

.hero__activity-foot {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--muted);
  text-transform: lowercase;
}

// ==========================================
// GPU ASCII — fullscreen hero background
// ==========================================
.hero__ascii-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

// ==========================================
// MARQUEE
// ==========================================
.marquee {
  border-bottom: 2px solid var(--border);
  padding: 10px 0;
  overflow: hidden;
  background: var(--fg);
  color: var(--bg);
}

.marquee--accent {
  background: var(--accent);
  color: #fff;
}

.marquee__track {
  display: flex;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
}

.marquee__track--reverse {
  animation-direction: reverse;
  animation-duration: 25s;
}

.marquee__text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

// ==========================================
// STATEMENT
// ==========================================
.statement {
  border-bottom: 2px solid var(--border);
}

.statement__body {
  position: relative;
  padding: 56px 24px 56px 88px;

  @media (max-width: 768px) {
    padding: 40px 16px 40px 60px;
  }
}

.statement__quote-mark {
  position: absolute;
  left: 16px;
  top: 16px;
  font-family: var(--font-serif);
  font-size: clamp(100px, 12vw, 180px);
  line-height: 0.7;
  color: var(--accent);
  user-select: none;
  pointer-events: none;
  font-style: italic;

  @media (max-width: 768px) {
    left: 8px;
    top: 24px;
    font-size: 80px;
  }
}

.statement__text {
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 700;
  line-height: 1.4;
  position: relative;
  z-index: 1;

  // Serif italic accent on first 4 words for typographic mix
  &::first-line {
    font-family: inherit;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
}

// ==========================================
// HIGHLIGHTS
// ==========================================
.highlights {
  border-bottom: 2px solid var(--border);
}

.highlights__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.highlights__cell {
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: -0.5px;
  transition: none;
  position: relative;

  &:hover {
    background: var(--fg);
    color: var(--bg);
    z-index: 1;
    transform: rotate(-1.5deg) scale(1.04);
    box-shadow: 6px 6px 0 0 var(--accent);

    .highlights__index {
      color: var(--accent);
    }
  }

  // Alternating tiny rotation per cell — broken grid feel
  &:nth-child(2n):hover {
    transform: rotate(1.5deg) scale(1.04);
  }
}

.highlights__index {
  font-size: 24px;
  font-weight: 700;
  color: var(--muted);
  line-height: 1;
}

.highlights__text {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

// ==========================================
// SERVICES
// ==========================================
.services {
  border-bottom: 2px solid var(--border);
}

.services__list {
  display: flex;
  flex-direction: column;
}

.services__row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--border);
  transition: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--fg);
    color: var(--bg);

    .services__num {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    .services__desc {
      color: var(--bg);
    }
  }
}

.services__num {
  font-size: clamp(28px, 5vw, 56px);
  font-weight: 700;
  padding: 24px 28px;
  border-right: 2px solid var(--border);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 1;

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 32px;
  }
}

.services__body {
  padding: 24px 28px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
}

.services__name {
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.services__desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 700px;
}

// ==========================================
// PROJECTS
// ==========================================
.projects {
  border-bottom: 2px solid var(--border);
}

.projects__grid {
  display: flex;
  flex-direction: column;
}

.projects__card {
  border-bottom: 2px solid var(--border);
  padding: 24px;
  transition: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--fg);
    color: var(--bg);

    .projects__num {
      color: var(--accent);
    }

    .projects__desc {
      color: var(--bg);
    }

    .projects__stack {
      color: var(--bg);
      border-color: var(--bg);
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
}

.projects__head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}

.projects__num {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  flex-shrink: 0;
}

.projects__name {
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.projects__desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  margin-bottom: 16px;
  max-width: 700px;
}

.projects__stack {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--muted);
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

// ==========================================
// DEMO BUILDS
// ==========================================
.demos {
  border-bottom: 2px solid var(--border);
}

.demos__disclaimer {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--accent);
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 10px;
    letter-spacing: 0.1em;
  }
}

.demos__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.demos__card {
  text-decoration: none;
  color: var(--fg);
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-right: 2px solid var(--border);
  border-bottom: 2px solid var(--border);
  transition: none;
  position: relative;

  &:nth-child(2n),
  &:last-child {
    border-right: none;
  }

  &:last-child,
  &:nth-last-child(2):nth-child(odd) {
    border-bottom: none;
  }

  &:hover {
    background: var(--fg);
    color: var(--bg);

    .demos__num {
      color: var(--accent);
    }

    .demos__niche {
      color: var(--accent);
    }

    .demos__desc {
      color: var(--bg);
    }

    .demos__stack {
      color: var(--bg);
      border-color: var(--bg);
    }

    .demos__action {
      color: var(--accent);
    }
  }

  @media (max-width: 900px) {
    border-right: none;

    &:last-child {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
}

.demos__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
}

.demos__num {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.demos__action {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.demos__name {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 8px;
}

.demos__niche {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 16px;
}

.demos__desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  margin-bottom: 20px;
  flex: 1;
}

.demos__stack {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--muted);
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

// ==========================================
// EXPERIENCE
// ==========================================
.exp {
  border-bottom: 2px solid var(--border);
}

.exp__list {
  display: flex;
  flex-direction: column;
}

.exp__row {
  display: flex;
  border-bottom: 2px solid var(--border);
  transition: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .exp__left {
      background: var(--fg);
      color: var(--bg);
    }

    .exp__right {
      background: var(--fg);
      color: var(--bg);
    }

    .exp__desc {
      color: var(--bg);
    }

    .exp__metric {
      border-color: var(--bg);
      color: var(--bg);
    }

    .exp__role {
      color: var(--accent);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.exp__row--current {
  .exp__left {
    background: var(--accent);
    color: #fff;
  }

  &:hover .exp__left {
    background: var(--accent);
  }
}

.exp__left {
  min-width: 180px;
  padding: 20px 24px;
  border-right: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
    min-width: auto;
    padding: 12px 16px;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
}

.exp__period {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.exp__now {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  background: var(--fg);
  color: var(--bg);
  padding: 2px 8px;
  display: inline-block;
  width: fit-content;

  .exp__row--current & {
    background: #fff;
    color: var(--accent);
  }
}

.exp__right {
  padding: 20px 24px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
}

.exp__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  gap: 16px;
  flex-wrap: wrap;
}

.exp__company {
  font-size: clamp(20px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
}

.exp__role {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.exp__desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  margin-bottom: 16px;
}

.exp__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.exp__metric {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: 2px solid var(--border);
  padding: 4px 10px;
  transition: none;

  &:hover {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
}

// ==========================================
// STACK
// ==========================================
.tech {
  border-bottom: 2px solid var(--border);
}

.tech__groups {
  display: flex;
  flex-direction: column;
}

.tech__group {
  display: flex;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.tech__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  min-width: 120px;
  padding: 16px 24px;
  border-right: 2px solid var(--border);
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    min-width: auto;
  }
}

.tech__items {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 24px;
  gap: 4px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
}

.tech__tag {
  font-size: 13px;
  font-weight: 700;
  border: 2px solid var(--border);
  padding: 6px 12px;
  transition: none;

  &:hover {
    background: var(--fg);
    color: var(--bg);
  }
}

// ==========================================
// ACTIVITY — GitHub contribution grid (brutalist)
// ==========================================
.activity {
  border-bottom: 2px solid var(--border);
}

.activity__meta {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}

.activity__meta-row {
  display: flex;
  border-right: 1px solid var(--border);

  &:last-child { border-right: none; }
}

.activity__meta-key {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--muted);
  padding: 12px 14px;
  border-right: 1px solid var(--border);
  background: var(--bg);
}

.activity__meta-val {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 12px 14px;
}

.activity__meta-val--accent {
  color: var(--accent);
}

.activity__container {
  padding: 32px 24px 28px;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
}

.activity__grid-wrap {
  position: relative;
  overflow-x: auto;
  padding-bottom: 8px;

  // Brutalist scrollbar inherited from global
}

.activity__grid {
  display: flex;
  gap: 3px;
  width: max-content;
}

.activity__col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.activity__cell {
  width: 13px;
  height: 13px;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: pointer;
  transition: none;

  &:hover {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  // Brutalist 5-level scale
  &--0 {
    background: var(--bg);
  }
  &--1 {
    background: var(--border-subtle, #c4bfb6);
  }
  &--2 {
    background: var(--muted);
  }
  &--3 {
    background: var(--fg);
    opacity: 0.6;
  }
  &--4 {
    background: var(--accent);
    border-color: var(--accent);
  }
}

:root[data-theme='dark'] .activity__cell {
  &--1 { background: #2a2a2a; }
  &--2 { background: #555; }
  &--3 { background: #888; }
}

.activity__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 12px;
  background: var(--fg);
  color: var(--bg);
  padding: 8px 14px;
  border: 2px solid var(--fg);
  font-family: var(--font);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.activity__tooltip-count {
  color: var(--accent);
}

.activity__tooltip-date {
  font-size: 10px;
  color: var(--bg);
  opacity: 0.7;
}

.activity__legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--muted);

  .activity__cell {
    cursor: default;
    &:hover { outline: none; }
  }
}

.activity__legend-label {
  margin: 0 4px;
}

// ==========================================
// CONTACT
// ==========================================
.contact {
  border-bottom: 2px solid var(--border);
}

.contact__cta {
  background: var(--accent);
  color: #fff;
  padding: 48px 32px;
  border-bottom: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
}

.contact__cta-title {
  font-size: clamp(32px, 6vw, 72px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-transform: uppercase;
}

.contact__cta-sub {
  font-size: clamp(14px, 1.8vw, 20px);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.contact__grid {
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.contact__link {
  flex: 1;
  text-decoration: none;
  color: var(--fg);
  border-right: 2px solid var(--border);
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.1em;
  transition: none;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: var(--fg);
    color: var(--bg);
  }

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 20px 16px;
    font-size: 14px;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
