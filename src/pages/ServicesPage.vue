<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import PageFrame from '../components/PageFrame.vue'

const { t, tm } = useI18n()
interface Item { name: string; desc: string }

const items = computed(() => tm('whatIBuild.items') as Item[])
const activeIndex = ref(0)

const artEl = ref<HTMLPreElement | null>(null)

// Hand-crafted ASCII art for each service (~78w × 28h — big enough to play with)
const arts = [
  // 0 WEB APPS — landing page mock: nav, hero, cards, testimonials, footer
  `┌─────────────────────────────────────────────────────────────────────────────┐
│  ●  sofonov.dev                      home  work  stack  about  contact      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│      ┌───────────────────────────┐                                          │
│      │   ░░░░░░░░░░░░░░░░░░░░░░   │   We build web apps that work.          │
│      │   ░░░░░░░░░░░░░░░░░░░░░░   │   From idea to launch — one engineer,   │
│      │   ░░░░░░░░░░░░░░░░░░░░░░   │   full ownership, zero meetings.        │
│      │   ░░░░░░░░░░░░░░░░░░░░░░   │                                         │
│      └───────────────────────────┘                                          │
│                                         [ start a project → ]   [ email ]   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐            │
│   │ ░░░░░░ │   │ ▒▒▒▒▒▒ │   │ ▓▓▓▓▓▓ │   │ ██████ │   │ ██████ │            │
│   │ ░░░░░░ │   │ ▒▒▒▒▒▒ │   │ ▓▓▓▓▓▓ │   │ ██████ │   │ ██████ │            │
│   │ client │   │ saas   │   │ admin  │   │ store  │   │ tool   │            │
│   └────────┘   └────────┘   └────────┘   └────────┘   └────────┘            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│   ★★★★★  "shipped fast and the code is clean"      — cto · fintech          │
│   ★★★★★  "only engineer we trust with the stack"   — founder · saas         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  © 2026                                                       sofonov.dev   │
└─────────────────────────────────────────────────────────────────────────────┘`,

  // 1 FRONTEND — compact Vue SFC
  [
    '// src/pages/HomePage.vue ──────────────────────────────────────────────',
    '',
    '<script setup lang="ts">',
    "  import { ref, computed } from 'vue'",
    "  import { useI18n } from 'vue-i18n'",
    "  import { useRouter } from 'vue-router'",
    '',
    "  import Hero from '@/components/Hero.vue'",
    "  import Sections from '@/components/Sections.vue'",
    "  import { useReveal } from '@/composables/useReveal'",
    '',
    '  const { t } = useI18n()',
    "  const state = ref({ active: 0, theme: 'light' as const })",
    '',
    '  const sections = computed(() => [',
    "    { id: 'web',     label: t('nav.web')     },",
    "    { id: 'backend', label: t('nav.backend') },",
    '  ])',
    '',
    "  useReveal('.reveal', { y: 24, stagger: 0.04 })",
    '<\/script>',
    '',
    '// 68 components  ·  3.1kb gzipped  ·  100% typed  ·  0 lint errors',
  ].join('\n'),

  // 2 BACKEND & API — compact endpoints + SQL + stats
  `┌─ api.sofonov.dev ───────────────────────────────────────────────────────────┐
│  GET    /api/v1/users                                             200  14ms │
│  POST   /api/v1/auth/login                                        201  22ms │
│  POST   /api/v1/auth/refresh                                      200   8ms │
│  PUT    /api/v1/profile/:id                                       200  11ms │
│  PATCH  /api/v1/settings                                          200   6ms │
│  DEL    /api/v1/session                                           204   2ms │
│  GET    /api/v1/projects/:id/stats                                200  47ms │
└─────────────────────────────────────────────────────────────────────────────┘

  > SELECT u.id, u.name, u.email, p.avatar, r.role
      FROM users u
      LEFT JOIN profiles  p ON p.user_id = u.id
      LEFT JOIN user_role r ON r.user_id = u.id
     WHERE u.active = true AND u.created_at > NOW() - INTERVAL '7 days'
     ORDER BY u.created_at DESC LIMIT 50;

  > rows: 1428   time: 12ms    cache: HIT        pool: 8 / 20
  > req/s: 342   p99: 140ms    uptime: 34d       redis: ok   pg: ok`,

  // 3 ARCHITECTURE — compact tree with inline branches
  `sofonov.dev/
├── src/
│   ├── api/
│   │   ├── routes/         →  users.ts  auth.ts  projects.ts  webhooks.ts
│   │   ├── middleware/     →  auth.ts  rate-limit.ts  error.ts
│   │   └── db/             →  schema.prisma  migrations/
│   ├── ui/
│   │   ├── components/     →  Button.vue  Modal.vue  Input.vue  Card.vue
│   │   ├── pages/          →  HomePage.vue  AboutPage.vue  ServicesPage.vue
│   │   └── composables/    →  useReveal.ts  useTheme.ts  useI18n.ts
│   ├── core/               →  store.ts  router.ts  config.ts
│   └── utils/              →  format.ts  guards.ts  types.ts
├── tests/
│   ├── unit/               →  142 tests   ·   1.8s
│   ├── integration/        →   48 tests   ·  11.4s
│   └── e2e/                →   18 tests   ·  42.1s
├── docs/                   →  guide.md  api.md  architecture.md
├── scripts/                →  deploy.sh  migrate.sh  seed.ts
└── package.json            →  68 deps  ·  12 devDeps  ·  pnpm@9`,

  // 4 SUPPORT & REVIEW — commits + tests + perf deltas
  `commit  4a7f3e1  ·  refactor/auth-middleware  ·  denis sofonov
──────────────────────────────────────────────────────────────────────────────
+  fixed memory leak in worker thread pool (32 → 4 mb / req)
+  cached db queries via dataloader (2.4s → 180ms, -92%)
+  added retry logic with exponential backoff + jitter
+  improved error boundaries across component tree
+  new: /api/v2/projects with cursor-based pagination
-  removed legacy polyfill for IE11 (bundle -3.2kb gzipped)
-  deprecated v1 endpoints, returning 410 Gone after 30d window
~  refactored auth middleware to JWT + refresh rotation
~  migrated redis 5 → redis 7 cluster (3 nodes, HA)
~  upgraded node 18 → 20, pnpm 8 → 9, vite 5 → 6

tests/
  >  238 / 238   unit            passing   ·  1.8s
  >   64 /  64   integration     passing   ·  11.4s
  >   18 /  18   e2e  (playwright)         passing   ·  42.1s
  >  coverage                  98.6%  statements  · 95.1% branches
  >  lighthouse                  98 perf  ·  100 a11y  ·  100 seo
  >  bundle                     142 kb gzipped (main) · +2.1% vs main

  $ deploy staging → production   [█████████████████████████]   100%`,

  // 5 UI/UX & DESIGN — geometric composition, grids, tokens
  `      ● ─── ○ ─── ○ ─── ○ ─── ○ ─── ○ ─── ○ ─── ○ ─── ○ ─── ○

   ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇

       ╱╲        ╱╲        ╱╲        ╱╲        ╱╲        ╱╲
      ╱  ╲      ╱  ╲      ╱  ╲      ╱  ╲      ╱  ╲      ╱  ╲
     ╱    ╲    ╱    ╲    ╱    ╲    ╱    ╲    ╱    ╲    ╱    ╲
    ╱      ╲  ╱      ╲  ╱      ╲  ╱      ╲  ╱      ╲  ╱      ╲
   ╱        ╲╱        ╲╱        ╲╱        ╲╱        ╲╱        ╲

        ■    ▪    ·    ▫    □    ▣    ◆    ◇    ◈    ◉    ○

   ┌──┐   ┌──┐   ┌──┐   ┌──┐   ┌──┐   ┌──┐   ┌──┐   ┌──┐   ┌──┐
   │░░│   │▒▒│   │▓▓│   │██│   │▓▓│   │▒▒│   │░░│   │  │   │  │
   └──┘   └──┘   └──┘   └──┘   └──┘   └──┘   └──┘   └──┘   └──┘

   ░ ░ ░ ░ ░ ░ ░   ▒ ▒ ▒ ▒ ▒ ▒ ▒   ▓ ▓ ▓ ▓ ▓ ▓ ▓   █ █ █ █ █ █ █

   tokens:  --bg #f5f5f0  ·  --fg #0a0a0a  ·  --accent #d9211f
   grid:    12 cols · 32 gap · 1280 max · 8px base · 1.5x ratio
   font:    onest · space mono  ·  16→170px  ·  letter-spacing -0.02em
   motion:  cubic-bezier(0.22, 1, 0.36, 1)  ·  180–420ms`,
]

const currentName = computed(() => items.value[activeIndex.value]?.name ?? '')
const currentDesc = computed(() => items.value[activeIndex.value]?.desc ?? '')
const currentArt = computed(() => arts[activeIndex.value] ?? '')

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#$%&@01░▒▓█'

// Cache of span DOM refs + targets + geometric centers (for cursor hit-testing)
interface SpanInfo { el: HTMLElement; target: string; cx: number; cy: number }
let spanCache: SpanInfo[] = []
let currentSpot: HTMLElement | null = null

function cacheSpanRects() {
  if (!artEl.value) return
  const wrapRect = artEl.value.getBoundingClientRect()
  const cells = artEl.value.querySelectorAll<HTMLElement>('.ascii-char')
  spanCache = Array.from(cells).map(el => {
    const r = el.getBoundingClientRect()
    return {
      el,
      target: el.textContent ?? '',
      cx: r.left - wrapRect.left + r.width / 2,
      cy: r.top - wrapRect.top + r.height / 2,
    }
  })
}

function scrambleArt() {
  if (!artEl.value) return
  // Drop any active spotlight from prior art
  currentSpot?.classList.remove('ascii-char--spot')
  currentSpot = null

  const targetText = currentArt.value
  const lines = targetText.split('\n')

  artEl.value.innerHTML = ''
  const spans: { el: HTMLElement; target: string }[] = []
  for (const line of lines) {
    for (const ch of line) {
      const span = document.createElement('span')
      span.className = 'ascii-char'
      span.textContent = ch
      artEl.value.appendChild(span)
      spans.push({ el: span, target: ch })
    }
    artEl.value.appendChild(document.createTextNode('\n'))
  }

  const duration = 22
  const revealStart = 8
  const totalFrames = 42

  spans.forEach((s, i) => {
    const order = Math.random() * 0.4 + (i / spans.length) * 0.6
    const startFrame = Math.floor(order * revealStart)
    const endFrame = startFrame + duration
    const isSpace = s.target === ' ' || s.target === '\n'

    const obj = { f: 0 }
    gsap.to(obj, {
      f: totalFrames,
      duration: totalFrames / 60,
      ease: 'none',
      onUpdate: () => {
        if (obj.f < startFrame) {
          s.el.textContent = isSpace ? s.target : ''
          s.el.style.opacity = '0'
          s.el.classList.remove('ascii-char--scrambling')
        } else if (obj.f < endFrame && !isSpace) {
          s.el.style.opacity = '1'
          s.el.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          s.el.classList.add('ascii-char--scrambling')
        } else {
          s.el.style.opacity = '1'
          s.el.textContent = s.target
          s.el.classList.remove('ascii-char--scrambling')
        }
      },
    })
  })

  // After scramble settles — cache rects for cursor interaction
  setTimeout(() => {
    cacheSpanRects()
  }, (totalFrames / 60) * 1000 + 50)
}

// 2. Wandering spotlight — one red char jumps neighbor-to-neighbor
let spotTimer: ReturnType<typeof setInterval> | null = null
function startSpotlight() {
  spotTimer = setInterval(() => {
    if (!artEl.value) return
    const cells = artEl.value.querySelectorAll<HTMLElement>('.ascii-char')
    if (!cells.length) return
    currentSpot?.classList.remove('ascii-char--spot')
    // Prefer neighbors of current spot for continuity; fallback to random
    let next: HTMLElement | null = null
    if (currentSpot) {
      const idx = Array.from(cells).indexOf(currentSpot)
      if (idx >= 0) {
        for (let tries = 0; tries < 6; tries++) {
          const offset = [-1, 1, -60, 60, -61, -59, 59, 61][Math.floor(Math.random() * 8)]
          const candidate = cells[idx + offset]
          if (candidate && (candidate.textContent ?? '').trim() !== '') {
            next = candidate
            break
          }
        }
      }
    }
    if (!next) {
      for (let tries = 0; tries < 20; tries++) {
        const candidate = cells[Math.floor(Math.random() * cells.length)]
        if ((candidate.textContent ?? '').trim() !== '') { next = candidate; break }
      }
    }
    if (next) {
      next.classList.add('ascii-char--spot')
      currentSpot = next
    }
  }, 280)
}

// 1. Cursor interaction — chars near mouse briefly scramble + red
let mouseX = -9999
let mouseY = -9999
let cursorRaf = 0
const activeGlitchSpans = new Set<HTMLElement>()

function onAsciiMouseMove(e: MouseEvent) {
  if (!artEl.value) return
  const rect = artEl.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
}
function onAsciiMouseLeave() { mouseX = -9999; mouseY = -9999 }

function cursorLoop() {
  cursorRaf = requestAnimationFrame(cursorLoop)
  if (mouseX < -999 || !spanCache.length) return
  const RADIUS = 42
  for (const span of spanCache) {
    if (span.target.trim() === '' || activeGlitchSpans.has(span.el)) continue
    const dx = span.cx - mouseX
    const dy = span.cy - mouseY
    if (dx * dx + dy * dy < RADIUS * RADIUS) {
      activeGlitchSpans.add(span.el)
      span.el.classList.add('ascii-char--cursor-glitch')
      span.el.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      const revertIn = 140 + Math.random() * 180
      setTimeout(() => {
        span.el.textContent = span.target
        span.el.classList.remove('ascii-char--cursor-glitch')
        activeGlitchSpans.delete(span.el)
      }, revertIn)
    }
  }
}


function setActive(i: number) {
  if (i === activeIndex.value) return
  activeIndex.value = i
}

watch(activeIndex, async () => {
  await nextTick()
  scrambleArt()
})

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  const len = items.value.length
  if (!len) return
  e.preventDefault()
  const step = e.key === 'ArrowDown' ? 1 : -1
  setActive((activeIndex.value + step + len) % len)
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
  const len = items.value.length
  if (len) setActive((activeIndex.value + step + len) % len)
  e.preventDefault()
}

onMounted(() => {
  nextTick(() => {
    scrambleArt()
    startSpotlight()
    // Soft opacity stagger for text & list items
    gsap.from('.services__item', { opacity: 0, stagger: 0.04, duration: 0.4, ease: 'power2.out', delay: 0.1 })
    gsap.from('.stage__name', { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 })
    gsap.from('.stage__desc', { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.35 })
  })
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', cacheSpanRects)
  window.addEventListener('wheel', onWheelNav, { passive: false })
  if (artEl.value) {
    artEl.value.addEventListener('mousemove', onAsciiMouseMove, { passive: true })
    artEl.value.addEventListener('mouseleave', onAsciiMouseLeave)
  }
  cursorRaf = requestAnimationFrame(cursorLoop)
})

onUnmounted(() => {
  if (spotTimer) clearInterval(spotTimer)
  if (cursorRaf) cancelAnimationFrame(cursorRaf)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', cacheSpanRects)
  window.removeEventListener('wheel', onWheelNav)
})
</script>

<template>
  <PageFrame num="04" :section="t('nav.services')">
  <div class="services-page">
    <div class="services__grid">
      <!-- Left: list -->
      <div class="services__left">
        <ul class="services__list">
          <li
            v-for="(item, i) in items"
            :key="i"
            class="services__item"
            :class="{ 'services__item--active': activeIndex === i }"
            @mouseenter="setActive(i)"
            @focus="setActive(i)"
            tabindex="0"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <!-- Right: ASCII stage -->
      <div class="services__stage">
        <div class="stage__top">
          <div class="stage__name-wrap">
            <h2 class="stage__name">{{ currentName }}</h2>
          </div>
          <p class="stage__desc">{{ currentDesc }}</p>
        </div>

        <div class="stage__ascii-wrap">
          <pre ref="artEl" class="stage__ascii"></pre>
        </div>
      </div>
    </div>
  </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.services-page {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;

  @media (max-width: 768px) { padding: 20px 8px; }
}

.services__grid {
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

.services__left {
  position: absolute;
  top: 0;
  left: -280px;
  width: 240px;

  @media (max-width: 1400px) {
    left: max(20px, calc((100vw - 820px) / 2 - 260px));
  }

  @media (max-width: 960px) {
    position: static;
    left: auto;
    width: 100%;
  }
}

.services__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.services__item {
  font-family: var(--font-sans);
  font-size: clamp(16px, 1.4vw, 20px);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--muted);
  cursor: pointer;
  outline: none;
  padding: 6px 0;
  transition: color 0.25s ease;

  &:hover {
    color: var(--fg);
  }

  &--active,
  &--active:hover {
    color: var(--accent);
  }

  &:focus-visible {
    color: var(--fg);
  }
}

// Stage
.services__stage {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stage__top {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  text-align: center;
}

.stage__name-wrap {
  overflow: hidden;
  padding: 0.05em 0;
}

.stage__name {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--fg);
  margin: 0;
  font-weight: 600;
}

.stage__desc {
  font-family: var(--font-sans);
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.55;
  color: var(--muted);
  max-width: 56ch;
  min-height: calc(1.55em * 4);
  margin: 0;
}

// ASCII — no frame, no scan-line, block centered, text inside stays left-aligned (pre)
.stage__ascii-wrap {
  position: relative;
  padding: 0;
  min-height: 420px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
}

.stage__ascii {
  font-family: var(--font-mono);
  font-size: clamp(9px, 0.82vw, 12px);
  line-height: 1.35;
  color: var(--fg);
  margin: 0;
  white-space: pre;
  min-height: calc(1.35em * 28);

  :deep(.ascii-char) {
    display: inline-block;
    width: 1ch;
    text-align: center;
    letter-spacing: 0;
    transition: color 0.15s ease;
    will-change: contents, opacity;
  }

  :deep(.ascii-char--scrambling),
  :deep(.ascii-char--cursor-glitch) {
    color: var(--accent);
  }

  :deep(.ascii-char--spot) {
    color: var(--accent);
    text-shadow: 0 0 6px color-mix(in srgb, var(--accent) 50%, transparent);
  }

}
</style>
