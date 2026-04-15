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

// Hand-crafted ASCII art for each service (60w × ~18h)
const arts = [
  // 0 WEB APPS — landing page layout
  `┌──────────────────────────────────────────────────────────┐
│  o  sofonov.dev             HOME  WORK  STACK  CONTACT   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                                          │
│    >  Lorem ipsum dolor sit amet consectetur             │
│    >  Adipiscing elit sed do eiusmod tempor incididunt   │
│    >  Ut labore et dolore magna aliqua enim ad minim     │
│                                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │ ░░░░░░ │  │ ▒▒▒▒▒▒ │  │ ▓▓▓▓▓▓ │  │ ██████ │          │
│  │ ░░░░░░ │  │ ▒▒▒▒▒▒ │  │ ▓▓▓▓▓▓ │  │ ██████ │          │
│  └────────┘  └────────┘  └────────┘  └────────┘          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  (c) 2026                                    sofonov.dev │
└──────────────────────────────────────────────────────────┘`,

  // 1 FRONTEND — Vue SFC structure
  [
    '// src/App.vue',
    '',
    '<script setup lang="ts">',
    "  import { ref, computed, onMounted } from 'vue'",
    "  import { useRouter } from 'vue-router'",
    "  import Hero from './components/Hero.vue'",
    "  import Sections from './components/Sections.vue'",
    '',
    '  const router = useRouter()',
    "  const state = ref({ active: 0, theme: 'dark' })",
    '  const route = computed(() => router.currentRoute.value)',
    '<\/script>',
    '',
    '<template>',
    '  <Hero :data="state" @select="onSelect" />',
    '  <Sections v-for="s in services" :key="s.id" />',
    '  <Footer :year="2026" author="sofonov.dev" />',
    '<\/template>',
    '',
    '// 42 components  ·  2.1kb gzipped  ·  0 lint errors',
  ].join('\n'),

  // 2 BACKEND & API — requests + queries
  `┌─ API ────────────────────────────────────────────────────┐
│  GET    /api/v1/users                              200   │
│  POST   /api/v1/auth/login                         201   │
│  PUT    /api/v1/profile/:id                        200   │
│  PATCH  /api/v1/settings                           200   │
│  DEL    /api/v1/session                            204   │
└──────────────────────────────────────────────────────────┘

  > SELECT u.id, u.name, u.email, p.avatar
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.active = true
        AND u.created_at > NOW() - INTERVAL '7 days'
      ORDER BY u.created_at DESC
      LIMIT 50;

  > rows: 1428    time: 12ms    cache: HIT
  > pool: 8 / 20  uptime: 34d  load: 0.34`,

  // 3 ARCHITECTURE — project tree
  `sofonov.dev/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   ├── auth.ts
│   │   │   └── webhooks.ts
│   │   └── middleware/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── Button.vue
│   │   │   └── Modal.vue
│   │   └── pages/
│   ├── core/
│   │   ├── store.ts
│   │   └── router.ts
│   └── utils/
├── tests/
└── docs/`,

  // 4 SUPPORT & REVIEW — commit log + tests
  `commit 4a7f3e1  ·  refactor/auth
──────────────────────────────────────────────────────────
+  fixed memory leak in worker thread pool
+  cached db queries (2.4s → 180ms, -92%)
+  added retry logic with exponential backoff
+  improved error boundaries across component tree
-  removed legacy polyfill (bundle -3.2kb)
-  deprecated v1 endpoints, returning 410 Gone
~  refactored auth middleware to JWT + refresh
~  migrated Redis 5 → Redis 7 cluster

tests/
  >  142 / 142   unit          passing
  >  48  /  48   integration   passing
  >  12  /  12   e2e           passing
  >  coverage               98.4%  statements
  >  coverage               94.2%  branches`,

  // 5 UI/UX & DESIGN — geometric composition
  `     ◯────◉────◯────◯────◯────◯────◯────◯

   ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁

       ╱╲        ╱╲        ╱╲        ╱╲
      ╱  ╲      ╱  ╲      ╱  ╲      ╱  ╲
     ╱    ╲    ╱    ╲    ╱    ╲    ╱    ╲
    ╱      ╲  ╱      ╲  ╱      ╲  ╱      ╲
   ╱        ╲╱        ╲╱        ╲╱        ╲

       ■    ▪    ·    ▫    □    ▣    ◆    ◇

   ┌──┐    ┌──┐    ┌──┐    ┌──┐    ┌──┐    ┌──┐
   │░░│    │▒▒│    │▓▓│    │██│    │▓▓│    │▒▒│
   └──┘    └──┘    └──┘    └──┘    └──┘    └──┘

   type: grid · gap: 24  · cols: 6 · span: auto`,
]

const currentName = computed(() => items.value[activeIndex.value]?.name ?? '')
const currentDesc = computed(() => items.value[activeIndex.value]?.desc ?? '')
const currentArt = computed(() => arts[activeIndex.value] ?? '')
const currentNum = computed(() => String(activeIndex.value + 1).padStart(2, '0'))
const totalNum = computed(() => String(items.value.length).padStart(2, '0'))

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#$%&@01░▒▓█'

function scrambleArt() {
  if (!artEl.value) return
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
        } else if (obj.f < endFrame && !isSpace) {
          s.el.style.opacity = '1'
          s.el.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        } else {
          s.el.style.opacity = '1'
          s.el.textContent = s.target
        }
      },
    })
  })
}

// Continuous glitch: flicker random cells
let glitchTimer: ReturnType<typeof setInterval> | null = null
function startGlitch() {
  glitchTimer = setInterval(() => {
    if (!artEl.value) return
    const cells = artEl.value.querySelectorAll<HTMLElement>('.ascii-char')
    if (!cells.length) return
    const count = 1 + Math.floor(Math.random() * 2)
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * cells.length)
      const cell = cells[idx]
      const original = cell.textContent ?? ''
      if (original.trim() === '') continue
      cell.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      cell.classList.add('ascii-char--flicker')
      setTimeout(() => {
        cell.textContent = original
        cell.classList.remove('ascii-char--flicker')
      }, 90 + Math.random() * 120)
    }
  }, 700)
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

onMounted(() => {
  nextTick(() => {
    scrambleArt()
    startGlitch()
  })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (glitchTimer) clearInterval(glitchTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <PageFrame num="03" :section="t('nav.services')" :subtitle="t('sections.services')" sheet="SHEET 03/08">
  <div class="services-page">
    <div class="services__grid">
      <!-- Left: list -->
      <div class="services__left">
        <div class="services__list">
          <button
            v-for="(item, i) in items"
            :key="i"
            class="services__item"
            :class="{ 'services__item--active': activeIndex === i }"
            @mouseenter="setActive(i)"
            @focus="setActive(i)"
          >
            <span class="services__marker"></span>
            <span class="services__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="services__name">{{ item.name }}</span>
          </button>
        </div>
      </div>

      <!-- Right: ASCII stage -->
      <div class="services__stage">
        <div class="stage__top">
          <div class="stage__meta">
            <span class="stage__dot"></span>
            <span>SVC.{{ currentNum }} / {{ totalNum }}</span>
            <span class="stage__sep">·</span>
            <span class="stage__blink">RENDER</span>
          </div>
          <div class="stage__name-wrap">
            <h2 class="stage__name">{{ currentName }}</h2>
          </div>
          <p class="stage__desc">{{ currentDesc }}</p>
        </div>

        <div class="stage__ascii-wrap">
          <pre ref="artEl" class="stage__ascii"></pre>
          <div class="stage__scan"></div>
        </div>
      </div>
    </div>
  </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.services-page {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 24px 20px;

  @media (max-width: 768px) { padding: 20px 8px; }
}

.services__grid {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 2fr;
  gap: 64px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.services__left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.services__label {
  font-size: 11px;
  letter-spacing: var(--ls-meta);
  text-transform: uppercase;
  color: var(--muted);
}

.services__list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
}

.services__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0 16px 16px;
  border: none;
  background: none;
  color: var(--fg);
  font-family: inherit;
  text-align: left;
  border-bottom: 1px solid var(--border);
  opacity: 0.55;
  transition: opacity 0.4s ease, padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover, &--active {
    opacity: 1;
    padding-left: 26px;
  }
}

.services__marker {
  position: absolute;
  left: 0;
  top: 50%;
  width: 8px;
  height: 1px;
  background: var(--fg);
  transform: translateY(-50%) scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  .services__item--active & { transform: translateY(-50%) scaleX(1); }
}

.services__num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.08em;
  width: 28px;
  flex-shrink: 0;
}

.services__name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--fs-h4);
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  line-height: 1.1;
}

// Stage
.services__stage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stage__top {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stage__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--ls-chrome);
  text-transform: uppercase;
  color: var(--muted);
}

.stage__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--fg);
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.25; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.1); }
}

.stage__sep { opacity: 0.4; }
.stage__blink {
  animation: blink 1.2s steps(2) infinite;
}
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.35; }
}

.stage__name-wrap {
  overflow: hidden;
  padding: 0.05em 0;
}

.stage__name {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  line-height: 1;
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  color: var(--fg);
  margin: 0;
  font-weight: 500;
}

.stage__desc {
  font-family: var(--font-serif);
  font-size: clamp(15px, 1.15vw, 17px);
  font-style: italic;
  line-height: 1.55;
  color: var(--muted);
  max-width: 560px;
  min-height: calc(1.55em * 3);
}

// ASCII
.stage__ascii-wrap {
  position: relative;
  border: 1px solid var(--border);
  padding: 24px 28px;
  background:
    linear-gradient(var(--border), var(--border)) top left / 14px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) top left / 1px 14px no-repeat,
    linear-gradient(var(--border), var(--border)) top right / 14px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) top right / 1px 14px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom left / 14px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom left / 1px 14px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom right / 14px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom right / 1px 14px no-repeat;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    padding: 18px 14px;
    overflow-x: auto;
  }
}

.stage__ascii {
  font-family: 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: clamp(10px, 0.9vw, 13px);
  line-height: 1.35;
  color: var(--fg);
  margin: 0;
  white-space: pre;
  min-height: calc(1.35em * 18);

  :deep(.ascii-char) {
    display: inline;
    transition: color 0.15s ease;
    will-change: contents, opacity;
  }

  :deep(.ascii-char--flicker) {
    color: var(--muted);
  }
}

.stage__scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--fg), transparent);
  opacity: 0.06;
  animation: scan 4.2s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { top: -2%; }
  100% { top: 102%; }
}
</style>
