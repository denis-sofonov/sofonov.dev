<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StickyCta from './components/StickyCta.vue'
import LogoMark from './components/LogoMark.vue'
import CustomCursor from './components/CustomCursor.vue'
import { splitText } from './composables/useMaskReveal'
import { activeSection } from './composables/useActiveSection'

gsap.registerPlugin(ScrollTrigger)

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

  // Drive ScrollTrigger off Lenis's smoothed scroll position so the scrub
  // timelines stay perfectly in lockstep with the inertial scroll (rather than
  // ScrollTrigger reading the raw native scroll and drifting out of sync).
  lenis.on('scroll', ScrollTrigger.update)

  let smoothedVelocity = 0
  let smoothedDrift = 0
  // Single shared marquee offset (percentage, wrapped into [0,50)). Every
  // marquee reads it off :root as --marq-x, so they all share one continuous,
  // jump-free flow that smoothly reverses with scroll — no animation-direction
  // flip (which is what made the old marquees jump on scroll-up).
  let marqOffset = 0
  let lastFrameT = performance.now()
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const root = document.documentElement
  let parallaxEls: HTMLElement[] = []
  let revealEls: HTMLElement[] = []

  refreshReactiveEls = () => {
    parallaxEls = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
    revealEls = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
  }

  function updateScrollEffects() {
    if (!lenis) return
    const now = performance.now()
    const dt = Math.min((now - lastFrameT) / 1000, 0.05)
    lastFrameT = now
    const progress = lenis.progress || 0
    root.style.setProperty('--scroll-progress', progress.toFixed(4))

    // Normalise lenis.velocity into 0..1. Asymmetric smoothing: fast attack
    // (blur kicks in the moment scroll starts), slow decay (lingers briefly
    // as it eases out).
    const absTarget = Math.min(Math.abs(lenis.velocity) / 18, 1)
    const kVel = absTarget > smoothedVelocity ? 0.5 : 0.08
    smoothedVelocity += (absTarget - smoothedVelocity) * kVel
    root.style.setProperty('--scroll-velocity', smoothedVelocity.toFixed(3))

    // Marquee flow — base autonomous drift plus a scroll-velocity term. Scroll
    // down speeds the drift up; scroll up subtracts and the net flow eases into
    // reverse, then back, with zero discontinuity. Frozen for reduced-motion.
    if (!prefersReduced) {
      const flowPerSec = 1.4 + lenis.velocity * 0.16
      marqOffset = (((marqOffset + flowPerSec * dt) % 50) + 50) % 50
      root.style.setProperty('--marq-x', marqOffset.toFixed(3))
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

  // Build the ScrollTrigger scrub timelines once the sections (and webfonts)
  // have settled, so each trigger measures the right start/end positions.
  setTimeout(() => setupSectionMotion(), 420)
  setTimeout(() => ScrollTrigger.refresh(), 1400)
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
  // Translations rebuild the split-text tokens and change content heights, so
  // rebuild the timelines against the fresh nodes (and re-capture title text
  // for the scramble) rather than just refreshing positions.
  await new Promise<void>(r => requestAnimationFrame(() => r()))
  setupSectionMotion()
})

// Route change repopulates scroll-reactive + split-text elements for the new
// view. Without this, mask/fade reveals on sub-pages stay at --reveal: 0.
watch(() => route.path, async () => {
  await nextTick()
  applyGlobalSplits()
  await new Promise<void>(r => requestAnimationFrame(() => r()))
  setupSectionMotion()
})

// ============================================================================
// SECTION MOTION — every section (except the hero) is glued to scroll with one
// ScrollTrigger scrub timeline, anchored to the SECTION itself (not its inner
// blocks, which is what made content peel away mid-screen). Each section's pass
// through the viewport maps to timeline 0→1:
//   • ~0.00–0.25  arrival   (content scrubs in from below / the sides)
//   • ~0.25–0.75  in focus  (fully settled while the section owns the screen)
//   • ~0.75–1.00  departure (content scrubs up and out as the section leaves)
// On top of that base reveal each section gets ONE signature gesture, also
// scrubbed, so you literally draw it by scrolling: Experience threads its
// timeline spine top→bottom, Projects slides cases in from alternating sides,
// Stack zoom-assembles its constellation, Now fills its focus meters, Contacts
// lands the channel rail. Driven by Lenis's smoothed scroll position
// (lenis.on('scroll', ScrollTrigger.update)), so it tracks the inertial scroll.
// ============================================================================
let stageTriggers: ScrollTrigger[] = []

// Terminal "decode" scramble for the mono §NN section titles: characters flip
// through random glyphs and resolve left→right, like a console booting. Fires
// on enter (and re-enter) — re-running on arrival is the point, so it isn't
// scrub-bound; it's time-based so it always finishes even if you scroll on.
const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*#%01'
const scrambleCancels = new WeakMap<HTMLElement, () => void>()
function runScramble(el: HTMLElement, finalText: string, dur = 0.6) {
  scrambleCancels.get(el)?.()
  const len = finalText.length
  let raf = 0
  let startedAt = 0
  const step = (now: number) => {
    if (!startedAt) startedAt = now
    const p = Math.min(1, (now - startedAt) / (dur * 1000))
    let out = ''
    for (let i = 0; i < len; i++) {
      const ch = finalText[i]
      // Each character locks in after its own staggered threshold.
      const reveal = (i / Math.max(len, 1)) * 0.55
      if (ch === ' ' || p >= reveal + 0.4 || p >= 1) out += ch
      else out += SCRAMBLE_GLYPHS[(Math.floor(now / 36) + i * 3) % SCRAMBLE_GLYPHS.length]
    }
    el.textContent = out
    if (p < 1) raf = requestAnimationFrame(step)
    else el.textContent = finalText
  }
  raf = requestAnimationFrame(step)
  scrambleCancels.set(el, () => { cancelAnimationFrame(raf); el.textContent = finalText })
}

function sectionTimeline(section: HTMLElement) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  })
}

function setupSectionMotion() {
  // Reduced-motion users keep static, fully-legible sections — no scrubbing.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  stageTriggers.forEach(t => t.kill())
  stageTriggers = []

  const sel = (root: ParentNode, q: string) => root.querySelector<HTMLElement>(q)
  const all = (root: ParentNode, q: string) => [...root.querySelectorAll<HTMLElement>(q)]

  // Shared header in/out — the §NN chip lifts in early and leaves first.
  const header = (tl: gsap.core.Timeline, section: HTMLElement) => {
    const h = sel(section, '.sec-head')
    if (!h) return
    tl.fromTo(h, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.04)
    tl.to(h, { autoAlpha: 0, y: -26, duration: 0.18, ease: 'power2.in' }, 0.82)
  }

  // Masked word reveal for big display headings: the words slide up from behind
  // their clip (data-gsap-mask in the SCSS), staggered, scrubbed with the
  // section — so scrolling back tucks them away again.
  const maskIn = (tl: gsap.core.Timeline, scope: HTMLElement, q: string, at: number) => {
    const inners: HTMLElement[] = []
    all(scope, q).forEach(h => inners.push(...all(h, '.mask-tok__inner')))
    if (!inners.length) return
    tl.fromTo(inners, { yPercent: 120 }, { yPercent: 0, duration: 0.22, ease: 'power3.out', stagger: 0.014 }, at)
  }

  const build: Record<string, (tl: gsap.core.Timeline, s: HTMLElement) => void> = {
    // §02 — the career spine threads top→bottom as you scroll, nodes popping
    // on as the line reaches them; the ledger fades as a backdrop.
    experience(tl, s) {
      const ledger = sel(s, '.exp__ledger')
      if (ledger) {
        tl.fromTo(ledger, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.06)
        tl.to(ledger, { autoAlpha: 0, y: -44, duration: 0.2, ease: 'power2.in' }, 0.8)
      }
      all(s, '.exp__row').forEach((row, i) => {
        const spine = sel(row, '.exp__spine')
        const node = sel(row, '.exp__node')
        const t = 0.2 + i * 0.06
        if (spine) tl.fromTo(spine, { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 0.2, ease: 'power2.out' }, t)
        if (node) tl.fromTo(node, { scale: 0 }, { scale: 1, duration: 0.12, ease: 'back.out(2)' }, t + 0.08)
      })
      maskIn(tl, s, '.exp__org', 0.14)
    },

    // §03 — the toolbar slides in, then the whole constellation zoom-assembles
    // into place (a different gesture from the vertical reveals around it).
    stack(tl, s) {
      const toolbar = sel(s, '.stk__toolbar')
      const cloud = sel(s, '.stk__cloud')
      if (toolbar) {
        tl.fromTo(toolbar, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.06)
        tl.to(toolbar, { autoAlpha: 0, y: -22, duration: 0.18, ease: 'power2.in' }, 0.82)
      }
      if (cloud) {
        tl.fromTo(cloud, { autoAlpha: 0, scale: 0.92, transformOrigin: 'center center' }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'power2.out' }, 0.1)
        tl.to(cloud, { autoAlpha: 0, scale: 1.04, duration: 0.2, ease: 'power2.in' }, 0.8)
      }
    },

    // §04 — featured cases converge from the side their layout favours (even
    // from the left, odd from the right), then lift away on exit. Each card's
    // visual then *builds itself* as you keep scrolling — and because the whole
    // timeline is scrubbed, scrolling back up unbuilds it in reverse.
    projects(tl, s) {
      all(s, '.prj-feat').forEach((feat, i) => {
        const fromX = i % 2 === 0 ? -90 : 90
        const t = 0.08 + i * 0.08
        tl.fromTo(feat, { autoAlpha: 0, x: fromX }, { autoAlpha: 1, x: 0, duration: 0.24, ease: 'power3.out' }, t)
        tl.to(feat, { autoAlpha: 0, y: -40, duration: 0.18, ease: 'power2.in' }, 0.8)

        // Onion / clean-architecture: nest in shell→core, one ring at a time.
        // querySelectorAll returns DOM order (UI → infra → app → domain core),
        // so the stagger reads as peeling inward toward the domain.
        const rings = all(feat, '.prj-onion__layer--4, .prj-onion__layer--3, .prj-onion__layer--2, .prj-onion__core')
        rings.forEach((ring, ri) => {
          tl.fromTo(ring,
            { autoAlpha: 0, scale: 0.5, transformOrigin: 'center center' },
            { autoAlpha: 1, scale: 1, duration: 0.1, ease: 'back.out(1.7)' },
            t + 0.16 + ri * 0.055)
        })

        // Scaffolding terminal: type the session out line by line.
        const lines = all(feat, '.prj-term__line')
        lines.forEach((line, li) => {
          tl.fromTo(line,
            { autoAlpha: 0, x: -12 },
            { autoAlpha: 1, x: 0, duration: 0.09, ease: 'power2.out' },
            t + 0.16 + li * 0.05)
        })
      })
      maskIn(tl, s, '.prj-feat__title', 0.16)
      const more = sel(s, '.prj__more')
      if (more) {
        tl.fromTo(more, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.5)
        tl.to(more, { autoAlpha: 0, y: -18, duration: 0.16, ease: 'power2.in' }, 0.84)
      }
    },

    // §05 — the focus meters fill left→right as you scroll, like charging bars;
    // the lead line and board fade as the frame.
    now(tl, s) {
      const board = sel(s, '.now__board')
      if (board) {
        tl.fromTo(board, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.08)
        tl.to(board, { autoAlpha: 0, y: -40, duration: 0.2, ease: 'power2.in' }, 0.8)
      }
      all(s, '.now__row').forEach((row, i) => {
        const fill = sel(row, '.now__meter-fill')
        if (fill) tl.fromTo(fill, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.22, ease: 'power2.out' }, 0.22 + i * 0.07)
      })
      maskIn(tl, s, '.now__v', 0.1)
    },

    // §06 — the coda. Final section, so it only arrives (you can't scroll past
    // it): status strip, then the channel rail staggers in, footer fades last.
    contacts(tl, s) {
      const avail = sel(s, '.cnt__avail')
      const stage = sel(s, '.cnt__stage')
      const foot = sel(s, '.cnt__foot')
      if (avail) tl.fromTo(avail, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.04)
      if (stage) tl.fromTo(stage, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }, 0.1)
      all(s, '.cnt-row').forEach((row, i) =>
        tl.fromTo(row, { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.16, ease: 'power2.out' }, 0.24 + i * 0.05))
      if (foot) tl.fromTo(foot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'power2.out' }, 0.42)
      maskIn(tl, s, '.cnt__headline', 0.16)
    },
  }

  Object.entries(build).forEach(([id, fn]) => {
    const section = document.getElementById(id)
    if (!section) return
    const tl = sectionTimeline(section)
    header(tl, section)
    fn(tl, section)
    if (tl.scrollTrigger) stageTriggers.push(tl.scrollTrigger as ScrollTrigger)

    // §NN title decodes on arrival (and re-arrival) — not scrub-bound.
    const title = sel(section, '.sec-head__title')
    if (title) {
      const finalText = title.textContent || ''
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => runScramble(title, finalText),
        onEnterBack: () => runScramble(title, finalText),
      })
      stageTriggers.push(st)
    }
  })

  ScrollTrigger.refresh()
}

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
  stageTriggers.forEach(t => t.kill())
  stageTriggers = []
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
    <div class="grain" aria-hidden="true" />
  </div>
</template>

<style lang="scss">
@use 'assets/global';
</style>
