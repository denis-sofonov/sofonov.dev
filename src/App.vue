<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router'
import Lenis from 'lenis'
import StickyCta from './components/StickyCta.vue'
import LogoMark from './components/LogoMark.vue'
import CustomCursor from './components/CustomCursor.vue'
import { splitText } from './composables/useMaskReveal'
import { activeSection } from './composables/useActiveSection'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

function syncPageMeta() {
  document.title = t('pageTitle')
  document.documentElement.setAttribute('lang', locale.value)
}
syncPageMeta()
watch(locale, syncPageMeta)

function getSystemTheme(): string {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return 'light'
}

const currentTheme = getSystemTheme()
const isDark = ref(currentTheme === 'dark')
document.documentElement.setAttribute('data-theme', currentTheme)

const savedLocale = localStorage.getItem('locale')
if (savedLocale) {
  locale.value = savedLocale
}

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'ru' : 'en'
  localStorage.setItem('locale', locale.value)
}

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const navLinks = computed(() => [
  { href: '/#experience', hash: '#experience', label: t('nav.experience') },
  { href: '/#stack', hash: '#stack', label: t('nav.stack') },
  { href: '/#projects', hash: '#projects', label: t('nav.projects') },
  { href: '/#now', hash: '#now', label: t('nav.now') },
  { href: '/#contacts', hash: '#contacts', label: t('nav.contacts') },
])

let lenis: Lenis | null = null
let rafId = 0
// Teardown bag — every setup that adds a listener or RAF pushes its undo
// function here so onUnmounted has a single path back out.
const cleanups: Array<() => void> = []

// Interaction guard for effects that don't belong on touch devices or for
// users who asked for less motion.
function canInteract(): boolean {
  return !matchMedia('(hover: none)').matches
    && !matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scrollToAnchor(e: Event, link: { href: string; hash: string }) {
  e.preventDefault()
  const el = document.querySelector(link.hash) as HTMLElement | null
  if (el) {
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.3 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    return
  }
  // Section lives on landing — navigate home with hash instead of breaking.
  router.push({ path: '/', hash: link.hash })
}

let sectionObserver: IntersectionObserver | null = null

let refreshReactiveEls: (() => void) | null = null

function applySplitsNow() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach(el => {
    const mode = (el.getAttribute('data-split') as 'words' | 'chars') || 'words'
    splitText(el, mode)
  })
  refreshMagnetic?.()
  refreshReactiveEls?.()
}

async function applyGlobalSplits() {
  // Wait through Vue update + a frame so RouterView's matched component is in DOM.
  await nextTick()
  await new Promise<void>(r => requestAnimationFrame(() => r()))
  applySplitsNow()
}

onMounted(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  document.documentElement.style.setProperty('--scroll-progress', '0')
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.documentElement.classList.add('is-ready'))
  })

  // Standard lenis smooth scroll — free natural scrolling for the user. The
  // soft snap (below) only nudges to the nearest dock once they've stopped.
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  })

  let smoothedVelocity = 0
  let smoothedDrift = 0
  const root = document.documentElement
  let parallaxEls: HTMLElement[] = []
  let revealEls: HTMLElement[] = []

  refreshReactiveEls = () => {
    parallaxEls = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
    revealEls = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
  }

  function updateScrollEffects() {
    if (!lenis) return
    const progress = lenis.progress || 0
    root.style.setProperty('--scroll-progress', progress.toFixed(4))

    // Normalise lenis.velocity into 0..1. Asymmetric smoothing: fast attack
    // (blur kicks in the moment scroll starts), slow decay (lingers briefly
    // as it eases out).
    const absTarget = Math.min(Math.abs(lenis.velocity) / 18, 1)
    const kVel = absTarget > smoothedVelocity ? 0.5 : 0.08
    smoothedVelocity += (absTarget - smoothedVelocity) * kVel
    root.style.setProperty('--scroll-velocity', smoothedVelocity.toFixed(3))

    // Marquee follows scroll direction — only flip past a velocity dead zone
    // so micro-jitter (snap settle, pointer wobble) doesn't toggle direction.
    if (Math.abs(lenis.velocity) > 1.2) {
      const dir = lenis.velocity > 0 ? 'down' : 'up'
      if (root.getAttribute('data-scroll-dir') !== dir) {
        root.setAttribute('data-scroll-dir', dir)
      }
    }

    const signedTarget = Math.max(-1, Math.min(1, lenis.velocity / 45))
    smoothedDrift += (signedTarget - smoothedDrift) * 0.15
    root.style.setProperty('--scroll-drift', smoothedDrift.toFixed(3))

    const vh = window.innerHeight

    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const p = (center - vh / 2) / vh
      const factor = parseFloat(el.dataset.parallax || '30')
      el.style.setProperty('--parallax-y', `${(-p * factor).toFixed(1)}px`)
    }

    const revealStart = vh
    const revealEnd = vh * 0.3
    for (const el of revealEls) {
      const rect = el.getBoundingClientRect()
      const raw = (revealStart - rect.top) / (revealStart - revealEnd)
      const p = Math.max(0, Math.min(1, raw))
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2
      el.style.setProperty('--reveal', eased.toFixed(3))
    }
  }

  const onResize = () => updateScrollEffects()
  window.addEventListener('resize', onResize)
  cleanups.push(() => window.removeEventListener('resize', onResize))

  // Run updateScrollEffects every frame — the asymmetric velocity smoothing
  // needs to keep decaying after the user stops scrolling (no more 'scroll'
  // events would fire otherwise and the blur would stay stuck at residual).
  function raf(time: number) {
    lenis?.raf(time)
    updateScrollEffects()
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  // Detection band is the line at viewport center. A section is a candidate
  // while its box crosses that line. Sections overlap (sticky pin sections use
  // margin-top: -100svh to cover the previous section's exit lane), so when
  // two boxes both cross the centre we pick the one whose top is highest in
  // the document — that's the one currently pinned and visible to the user.
  const intersecting = new Set<Element>()
  function pickActive() {
    let best: Element | null = null
    let bestTop = -Infinity
    for (const el of intersecting) {
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY
      if (top > bestTop) { bestTop = top; best = el }
    }
    if (best) activeSection.value = '#' + best.id
  }
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target)
        else intersecting.delete(entry.target)
      }
      pickActive()
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
  )

  async function wireSections() {
    // wait for RouterView's child to mount
    await nextTick()
    await new Promise<void>(r => requestAnimationFrame(() => r()))
    const ids = ['hero', 'experience', 'stack', 'projects', 'now', 'contacts']
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) sectionObserver!.observe(el)
    })
  }
  wireSections()

  applyGlobalSplits()
  setupMagnetic()
  setupScrollSnap()

  // Sections (and their [data-parallax]/[data-reveal] nodes) finish mounting a
  // few frames after the first split pass — re-collect so scroll-linked
  // parallax actually has elements to drive.
  setTimeout(() => refreshReactiveEls?.(), 400)
  setTimeout(() => refreshReactiveEls?.(), 1400)
})

// ----- scroll snap: one wheel/key gesture = one dock advance ----------------

function collectSnapPoints(): number[] {
  // Dock points are declared on sections themselves (via useSectionPin or
  // hand-placed data-attrs). Collect them + the final scroll position so we
  // can dock at the very end.
  const vh = window.innerHeight
  const points = new Set<number>()
  document.querySelectorAll<HTMLElement>('[data-snap-segments]').forEach(el => {
    const segs = Math.max(1, parseInt(el.dataset.snapSegments || '1', 10))
    const vp = parseFloat(el.dataset.snapVp || '1') || 1
    const top = el.getBoundingClientRect().top + window.scrollY
    for (let i = 0; i < segs; i++) {
      points.add(Math.round(top + i * vh * vp))
    }
  })
  points.add(Math.max(0, document.documentElement.scrollHeight - vh))
  return [...points].sort((a, b) => a - b)
}

// Soft snap: lenis handles all input naturally; once scroll has settled we
// nudge to the nearest dock if the user came to rest near one. Mid-page rests
// (more than ~30% of a viewport from any dock) are respected — no yanking.
function setupScrollSnap() {
  if (!lenis || !canInteract()) return

  const SETTLE_MS = 280       // ms of no-scroll before snap fires
  const MAX_SNAP_DIST = 0.4   // fraction of vh — beyond this, don't snap
  const MIN_SNAP_DIST = 4     // already-on-dock dead zone
  const SNAP_DURATION = 0.55

  let endTimer: number | null = null
  let snapping = false
  let cachedDocks: number[] = []
  let dockCacheAt = 0

  function docks(): number[] {
    const now = performance.now()
    if (now - dockCacheAt > 500) {
      cachedDocks = collectSnapPoints()
      dockCacheAt = now
    }
    return cachedDocks
  }

  function trySnap() {
    if (snapping || !lenis) return
    const vh = window.innerHeight
    const y = window.scrollY
    const list = docks()
    let nearest = list[0]
    let minD = Infinity
    for (const p of list) {
      const d = Math.abs(p - y)
      if (d < minD) { minD = d; nearest = p }
    }
    if (minD < MIN_SNAP_DIST) return
    if (minD > vh * MAX_SNAP_DIST) return
    snapping = true
    // lock: scroll is locked to the target until the animation completes —
    // user input can't drag lenis off course mid-snap. force: the animation
    // runs even if lenis was just stopped or interrupted by inertia.
    lenis.scrollTo(nearest, {
      duration: SNAP_DURATION,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      lock: true,
      force: true,
      onComplete: () => { snapping = false },
    })
  }

  function onScroll() {
    if (snapping) return
    if (endTimer != null) clearTimeout(endTimer)
    endTimer = window.setTimeout(trySnap, SETTLE_MS)
  }

  function onResize() { dockCacheAt = 0 }

  lenis.on('scroll', onScroll)
  window.addEventListener('resize', onResize)
  cleanups.push(() => {
    lenis?.off('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    if (endTimer != null) clearTimeout(endTimer)
  })
}

watch(locale, async () => {
  await nextTick()
  applyGlobalSplits()
})

// Route change repopulates scroll-reactive + split-text elements for the new
// view. Without this, mask/fade reveals on sub-pages stay at --reveal: 0.
watch(() => route.path, async () => {
  await nextTick()
  applyGlobalSplits()
})

// ----- magnetic hover -----
let refreshMagnetic: (() => void) | null = null

function setupMagnetic() {
  if (!canInteract()) return

  interface Target {
    el: HTMLElement
    inner: HTMLElement | null
    radius: number
    strength: number
    mx: number
    my: number
    tx: number
    ty: number
  }
  const targets: Target[] = []

  function refresh() {
    targets.length = 0
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
      const r = parseFloat(el.getAttribute('data-magnetic') || '') || 90
      const s = parseFloat(el.getAttribute('data-magnetic-strength') || '') || 0.35
      const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]')
      targets.push({ el, inner, radius: r, strength: s, mx: 0, my: 0, tx: 0, ty: 0 })
    })
  }
  refreshMagnetic = refresh

  let lastPX = -9999
  let lastPY = -9999
  const onMove = (e: PointerEvent) => {
    lastPX = e.clientX
    lastPY = e.clientY
  }

  function tick() {
    for (const t of targets) {
      const rect = t.el.getBoundingClientRect()
      let targetX = 0
      let targetY = 0

      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = lastPX - cx
        const dy = lastPY - cy
        const dist = Math.hypot(dx, dy)
        if (dist < t.radius) {
          const falloff = 1 - dist / t.radius
          const pull = t.strength * (0.4 + 0.6 * falloff)
          targetX = dx * pull
          targetY = dy * pull
        }
      }

      t.tx += (targetX - t.tx) * 0.18
      t.ty += (targetY - t.ty) * 0.18

      if (Math.abs(t.tx - t.mx) > 0.05 || Math.abs(t.ty - t.my) > 0.05) {
        t.mx = t.tx
        t.my = t.ty
        const target = t.inner || t.el
        target.style.setProperty('--mx', `${t.mx.toFixed(2)}px`)
        target.style.setProperty('--my', `${t.my.toFixed(2)}px`)
      }
    }
    rafHandle = requestAnimationFrame(tick)
  }

  let rafHandle = 0
  window.addEventListener('pointermove', onMove, { passive: true })
  refresh()
  rafHandle = requestAnimationFrame(tick)

  cleanups.push(() => {
    window.removeEventListener('pointermove', onMove)
    cancelAnimationFrame(rafHandle)
  })
}

onUnmounted(() => {
  for (const fn of cleanups) fn()
  cleanups.length = 0
  sectionObserver?.disconnect()
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
})
</script>

<template>
  <div class="page">
    <header class="header">
      <RouterLink to="/" class="header__logo" aria-label="to top">
        <LogoMark :size="28" color="#d9211f" class="header__logo-mark" />
      </RouterLink>
      <nav class="header__nav">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="header__nav-link"
          :class="{ 'header__nav-link--active': activeSection === link.hash }"
          data-magnetic="55"
          data-magnetic-strength="0.4"
          @click="scrollToAnchor($event, link)"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="header__controls">
        <button
          class="header__btn"
          data-magnetic="55"
          data-magnetic-strength="0.4"
          @click="toggleTheme"
        >
          {{ isDark ? t('theme.light') : t('theme.dark') }}
        </button>
        <button
          class="header__btn"
          data-magnetic="55"
          data-magnetic-strength="0.4"
          @click="toggleLocale"
        >
          {{ t('switchLang') }}
        </button>
      </div>
    </header>

    <div class="progress-bar" aria-hidden="true" />

    <RouterView />
    <StickyCta />
    <CustomCursor />
  </div>
</template>

<style lang="scss">
@use 'assets/global';
</style>
