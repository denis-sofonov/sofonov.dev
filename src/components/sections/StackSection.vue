<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm, locale } = useI18n()

// ── data ───────────────────────────────────────────────────────────
const frontTools = computed(() => tm('stack.frontTools') as string[])
interface BackTool { n: string; learning?: boolean }
interface BackLang { lang: string; status: string; learning: boolean; tools: BackTool[] }
const backLangs = computed(() => tm('stack.backLangs') as BackLang[])

// ── view state ─────────────────────────────────────────────────────
const mode = ref<'front' | 'back'>('front')
const activeLang = ref(0)

function setMode(m: 'front' | 'back') {
  if (mode.value === m) return
  mode.value = m
  activeLang.value = 0
  hoveredTool.value = null
}
function setLang(i: number) {
  if (activeLang.value === i) return
  activeLang.value = i
  hoveredTool.value = null
}

// ── tool metadata (frontend only — hand-tuned) ─────────────────────
interface Meta { w: number; since: number; role: { en: string; ru: string } }
const TOOL_META: Record<string, Meta> = {
  'vue 3':         { w: 5, since: 2021, role: { en: 'primary frontend framework', ru: 'основной фронтенд-фреймворк' } },
  'typescript':    { w: 5, since: 2021, role: { en: 'every project, every line',  ru: 'в каждом проекте, в каждой строке' } },
  'javascript':    { w: 4, since: 2019, role: { en: 'the language under it all',  ru: 'язык в основе всего' } },
  'nuxt':          { w: 4, since: 2022, role: { en: 'ssr, routing, the whole app', ru: 'ssr, роутинг, всё приложение' } },
  'next.js':       { w: 3, since: 2021, role: { en: 'react ssr & routing',        ru: 'ssr и роутинг на react' } },
  'scss':          { w: 4, since: 2019, role: { en: 'styling backbone',           ru: 'основа стилей' } },
  'tailwind':      { w: 3, since: 2022, role: { en: 'rapid prototyping',          ru: 'быстрое прототипирование' } },
  'pinia':         { w: 4, since: 2022, role: { en: 'state for vue projects',     ru: 'состояние во vue-проектах' } },
  'vuex':          { w: 2, since: 2020, role: { en: 'legacy vue state',           ru: 'состояние на легаси vue' } },
  'vue router':    { w: 3, since: 2021, role: { en: 'routing for vue apps',       ru: 'роутинг во vue' } },
  'react':         { w: 4, since: 2020, role: { en: 'spa & ssr on the react side', ru: 'spa и ssr на стороне react' } },
  'react router':  { w: 3, since: 2020, role: { en: 'routing for react apps',     ru: 'роутинг в react' } },
  'redux':         { w: 3, since: 2020, role: { en: 'state on react projects',    ru: 'состояние в react-проектах' } },
  'zustand':       { w: 2, since: 2022, role: { en: 'lean react state',           ru: 'лёгкий стейт в react' } },
  'tanstack query':{ w: 3, since: 2022, role: { en: 'server state & caching',     ru: 'серверный стейт и кеш' } },
  'radix':         { w: 3, since: 2023, role: { en: 'headless ui primitives',     ru: 'headless ui-примитивы' } },
  'gsap':          { w: 3, since: 2021, role: { en: 'complex motion timelines',   ru: 'сложные таймлайны анимаций' } },
  'three.js':      { w: 2, since: 2023, role: { en: 'webgl scenes & particles',   ru: 'webgl-сцены и частицы' } },
  'vitest':        { w: 4, since: 2022, role: { en: 'unit tests for business logic', ru: 'юнит-тесты бизнес-логики' } },
  'jest':          { w: 3, since: 2020, role: { en: 'component & legacy tests',    ru: 'тесты компонентов и легаси' } },
  'storybook':     { w: 3, since: 2022, role: { en: 'ui-library workbench & docs', ru: 'стенд и доки ui-библиотеки' } },
  'eslint':        { w: 4, since: 2020, role: { en: 'lint rules, consistent code', ru: 'линт, единый стиль кода' } },
  'prettier':      { w: 3, since: 2020, role: { en: 'formatting on save',         ru: 'форматирование' } },
  'figma':       { w: 4, since: 2020, role: { en: 'design + handoff',           ru: 'дизайн и хэндофф' } },
  'sketch':      { w: 2, since: 2023, role: { en: 'handed-off legacy mockups',  ru: 'макеты на легаси-проектах' } },
  'git':         { w: 5, since: 2019, role: { en: 'every project, every day',   ru: 'каждый проект, каждый день' } },
  'github':      { w: 4, since: 2019, role: { en: 'host + code review',         ru: 'хост и ревью' } },
  'gitlab ci':   { w: 4, since: 2021, role: { en: 'pipelines, lint, hooks',     ru: 'пайплайны, линт, хуки' } },
  'docker':      { w: 3, since: 2022, role: { en: 'reproducible environments',  ru: 'воспроизводимое окружение' } },
  'vite':        { w: 3, since: 2022, role: { en: 'every fresh project',        ru: 'в каждом новом проекте' } },
  'pnpm':        { w: 3, since: 2023, role: { en: 'package manager of choice',  ru: 'мой пакетный менеджер' } },
}

// Hand-placed constellation for the FRONTEND view. Coordinates are 0..1 of the
// cloud area; each tool is anchored at its CENTER.
const POS: Record<string, { x: number; y: number }> = {
  // top band
  'tailwind':       { x: 0.30, y: 0.07 },
  'three.js':       { x: 0.50, y: 0.06 },
  'storybook':      { x: 0.67, y: 0.07 },
  'redux':          { x: 0.85, y: 0.10 },
  // ~0.18
  'vue 3':          { x: 0.14, y: 0.20 },
  'react':          { x: 0.59, y: 0.19 },
  'zustand':        { x: 0.92, y: 0.20 },
  // ~0.30
  'typescript':     { x: 0.35, y: 0.31 },
  'next.js':        { x: 0.74, y: 0.29 },
  'jest':           { x: 0.92, y: 0.34 },
  // ~0.42
  'nuxt':           { x: 0.05, y: 0.40 },
  'javascript':     { x: 0.25, y: 0.45 },
  'gsap':           { x: 0.49, y: 0.42 },
  'vitest':         { x: 0.67, y: 0.44 },
  'github':         { x: 0.95, y: 0.47 },
  // ~0.55
  'scss':           { x: 0.13, y: 0.56 },
  'radix':          { x: 0.39, y: 0.55 },
  'tanstack query': { x: 0.64, y: 0.56 },
  'react router':   { x: 0.86, y: 0.58 },
  // ~0.68
  'vue router':     { x: 0.06, y: 0.68 },
  'pinia':          { x: 0.30, y: 0.67 },
  'git':            { x: 0.78, y: 0.68 },
  'gitlab ci':      { x: 0.96, y: 0.72 },
  // ~0.80
  'vuex':           { x: 0.45, y: 0.78 },
  'figma':          { x: 0.61, y: 0.80 },
  'docker':         { x: 0.82, y: 0.82 },
  // bottom band
  'vite':           { x: 0.05, y: 0.84 },
  'sketch':         { x: 0.27, y: 0.89 },
  'eslint':         { x: 0.49, y: 0.91 },
  'prettier':       { x: 0.70, y: 0.92 },
  'pnpm':           { x: 0.92, y: 0.91 },
}

const RELATIONS: Record<string, string[]> = {
  'vue 3':         ['nuxt', 'typescript', 'pinia', 'vue router'],
  'typescript':    ['javascript', 'vue 3', 'react', 'zod'],
  'javascript':    ['typescript'],
  'scss':          ['vue 3', 'nuxt'],
  'nuxt':          ['vue 3', 'vue router', 'pinia'],
  'next.js':       ['react', 'react router'],
  'tailwind':      ['react', 'radix'],
  'pinia':         ['vue 3', 'nuxt'],
  'vuex':          ['vue 3', 'pinia'],
  'vue router':    ['vue 3', 'nuxt'],
  'react':         ['typescript', 'next.js', 'redux', 'react router'],
  'react router':  ['react', 'next.js'],
  'redux':         ['react', 'zustand'],
  'zustand':       ['react'],
  'tanstack query':['react', 'typescript'],
  'radix':         ['tailwind', 'vue 3'],
  'gsap':          ['vue 3', 'three.js'],
  'three.js':      ['vue 3', 'gsap'],
  'vitest':        ['typescript', 'jest', 'vite'],
  'jest':          ['vitest', 'storybook'],
  'storybook':     ['vue 3', 'radix', 'jest'],
  'eslint':        ['prettier', 'typescript'],
  'prettier':      ['eslint'],
  'figma':       ['sketch'],
  'sketch':      ['figma'],
  'git':         ['github', 'gitlab ci'],
  'github':      ['git'],
  'gitlab ci':   ['git', 'docker', 'vitest'],
  'docker':      ['gitlab ci'],
  'vite':        ['vitest', 'pnpm'],
  'pnpm':        ['vite'],
}

const SIZE_CLAMP: Record<number, string> = {
  5: 'clamp(40px, 5.4vw, 92px)',
  4: 'clamp(28px, 3.6vw, 58px)',
  3: 'clamp(20px, 2.4vw, 38px)',
  2: 'clamp(16px, 1.8vw, 26px)',
  1: 'clamp(13px, 1.3vw, 18px)',
}

// ── the visible node set, derived from mode ────────────────────────
interface Node { name: string; w: number; learning: boolean; center?: boolean; status?: string }

const nodes = computed<Node[]>(() => {
  if (mode.value === 'front') {
    return frontTools.value.map(n => ({ name: n, w: TOOL_META[n]?.w ?? 3, learning: false }))
  }
  const lang = backLangs.value[activeLang.value]
  if (!lang) return []
  const center: Node = { name: lang.lang, w: 5, learning: lang.learning, center: true, status: lang.status }
  const sats = lang.tools.map(tl => ({ name: tl.n, w: tl.learning ? 2 : 3, learning: !!tl.learning }))
  return [center, ...sats]
})

const nodeByName = computed<Record<string, Node>>(() => {
  const out: Record<string, Node> = {}
  for (const n of nodes.value) out[n.name] = n
  return out
})

const count = computed(() =>
  mode.value === 'front'
    ? frontTools.value.length
    : (backLangs.value[activeLang.value]?.tools.length ?? 0),
)

// Deterministic 0..1 hash so procedural placement is stable per name.
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return (h % 1000) / 1000
}

// Layout — frontend uses the hand-placed map; backend arranges the active
// language's tools on a ring around the language node at the centre, so any
// future addition needs zero manual coordinates.
const layout = computed<Record<string, { x: number; y: number }>>(() => {
  const out: Record<string, { x: number; y: number }> = {}
  if (mode.value === 'front') {
    for (const n of nodes.value) out[n.name] = POS[n.name] ?? { x: 0.5, y: 0.5 }
    return out
  }
  const sats = nodes.value.filter(n => !n.center)
  const center = nodes.value.find(n => n.center)
  if (center) out[center.name] = { x: 0.5, y: 0.44 }
  const n = sats.length || 1
  sats.forEach((nd, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (hash(nd.name) - 0.5) * 0.5
    const r = 0.31 + (hash(nd.name) - 0.5) * 0.07
    let x = 0.5 + Math.cos(a) * r * 1.4
    let y = 0.44 + Math.sin(a) * r
    x = Math.max(0.08, Math.min(0.92, x))
    y = Math.max(0.08, Math.min(0.84, y))
    out[nd.name] = { x, y }
  })
  return out
})

function pos(name: string): { x: number; y: number } {
  return layout.value[name] ?? { x: 0.5, y: 0.5 }
}
function size(name: string): string {
  return SIZE_CLAMP[nodeByName.value[name]?.w ?? 3]
}
function role(m: Meta): string {
  return locale.value === 'ru' ? m.role.ru : m.role.en
}

const sinceLabel = computed(() => locale.value === 'ru' ? 'с' : 'since')

// ── interaction refs ───────────────────────────────────────────────
const sectionRef = ref<HTMLElement | null>(null)
const cloudRef = ref<HTMLElement | null>(null)
const lineRef = ref<SVGLineElement | null>(null)
const toolEls = ref<Record<string, HTMLElement>>({})

const hoveredTool = ref<string | null>(null)
const hoveredNode = computed(() => hoveredTool.value ? nodeByName.value[hoveredTool.value] : null)
const hoveredMeta = computed(() => hoveredTool.value ? TOOL_META[hoveredTool.value] : null)

// Readout meta line — frontend tools carry since + role; backend nodes report
// their stage (in production / learning) instead.
const readoutText = computed(() => {
  const node = hoveredNode.value
  if (!node) return ''
  if (mode.value === 'front' && hoveredMeta.value) {
    return `${sinceLabel.value} ${hoveredMeta.value.since} · ${role(hoveredMeta.value)}`
  }
  if (node.center) return node.status ?? ''
  return node.learning ? t('stack.learning') : t('stack.inProd')
})

const proximityTool = ref<string | null>(null)
const PROXIMITY_PX = 140

// Affinity edges only make sense for the hand-authored frontend graph.
const relatedActive = computed<string[]>(() =>
  mode.value === 'front' && hoveredTool.value ? (RELATIONS[hoveredTool.value] ?? []) : [],
)
const relatedSet = computed<Set<string>>(() => new Set(relatedActive.value))
const relatedLines = ref<Record<string, SVGLineElement>>({})

function setRelatedRef(name: string, el: unknown) {
  if (el) relatedLines.value[name] = el as SVGLineElement
  else delete relatedLines.value[name]
}

const toolCentres = new Map<string, { cx: number; cy: number }>()
const cursorPos = { x: 0, y: 0 }
let cloudRect: DOMRect | null = null
let raf = 0
let cleanupFns: Array<() => void> = []

interface Drift { ampX: number; ampY: number; spX: number; spY: number; phX: number; phY: number }
const drift = new Map<string, Drift>()
function getDrift(name: string, w: number): Drift {
  let d = drift.get(name)
  if (!d) {
    const amp = 8 - w * 1.0
    d = {
      ampX: amp * (0.6 + hash(name + 'x') * 0.6),
      ampY: amp * (0.8 + hash(name + 'y') * 0.6),
      spX: 0.0003 + hash(name + 'a') * 0.0004,
      spY: 0.00025 + hash(name + 'b') * 0.00045,
      phX: hash(name + 'c') * Math.PI * 2,
      phY: hash(name + 'd') * Math.PI * 2,
    }
    drift.set(name, d)
  }
  return d
}

function recalcCloudRect() {
  if (cloudRef.value) cloudRect = cloudRef.value.getBoundingClientRect()
}

function rectEdge(dx: number, dy: number, hw: number, hh: number, gap: number) {
  const adx = Math.abs(dx)
  const ady = Math.abs(dy)
  const tx = adx > 0.001 ? hw / adx : Infinity
  const ty = ady > 0.001 ? hh / ady : Infinity
  const t = Math.min(tx, ty)
  const ex = dx * t
  const ey = dy * t
  const len = Math.hypot(dx, dy) || 1
  return { x: ex + (dx / len) * gap, y: ey + (dy / len) * gap }
}

function tick(time: number) {
  recalcCloudRect()
  if (cloudRect) {
    const W = cloudRect.width
    const H = cloudRect.height
    toolCentres.clear()
    for (const node of nodes.value) {
      const el = toolEls.value[node.name]
      if (!el) continue
      const d = getDrift(node.name, node.w)
      const p = pos(node.name)
      const dx = Math.sin(time * d.spX + d.phX) * d.ampX
      const dy = Math.cos(time * d.spY + d.phY) * d.ampY
      const px = p.x * W + dx
      const py = p.y * H + dy
      el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%)`
      toolCentres.set(node.name, { cx: px, cy: py })
    }

    if (!hoveredTool.value) {
      let nearest: string | null = null
      let minD = Infinity
      for (const [tool, c] of toolCentres) {
        const d = Math.hypot(cursorPos.x - c.cx, cursorPos.y - c.cy)
        if (d < minD) { minD = d; nearest = tool }
      }
      const next = (nearest && minD < PROXIMITY_PX) ? nearest : null
      if (proximityTool.value !== next) proximityTool.value = next
    } else if (proximityTool.value !== null) {
      proximityTool.value = null
    }

    if (proximityTool.value && lineRef.value) {
      const c = toolCentres.get(proximityTool.value)
      if (c) {
        lineRef.value.setAttribute('x1', c.cx.toFixed(1))
        lineRef.value.setAttribute('y1', c.cy.toFixed(1))
        lineRef.value.setAttribute('x2', cursorPos.x.toFixed(1))
        lineRef.value.setAttribute('y2', cursorPos.y.toFixed(1))
      }
    }

    if (relatedActive.value.length && hoveredTool.value) {
      const a = toolCentres.get(hoveredTool.value)
      const fromEl = toolEls.value[hoveredTool.value]
      if (a && fromEl) {
        const fr = fromEl.getBoundingClientRect()
        const hwA = fr.width / 2
        const hhA = fr.height / 2
        const GAP = 5
        for (const r2 of relatedActive.value) {
          const lineEl = relatedLines.value[r2]
          const toEl = toolEls.value[r2]
          const b = toolCentres.get(r2)
          if (!lineEl || !toEl || !b) continue
          const tr = toEl.getBoundingClientRect()
          const hwB = tr.width / 2
          const hhB = tr.height / 2
          const dx = b.cx - a.cx
          const dy = b.cy - a.cy
          const eA = rectEdge(dx, dy, hwA, hhA, GAP)
          const eB = rectEdge(-dx, -dy, hwB, hhB, GAP)
          lineEl.setAttribute('x1', (a.cx + eA.x).toFixed(1))
          lineEl.setAttribute('y1', (a.cy + eA.y).toFixed(1))
          lineEl.setAttribute('x2', (b.cx + eB.x).toFixed(1))
          lineEl.setAttribute('y2', (b.cy + eB.y).toFixed(1))
        }
      }
    }
  }
  raf = requestAnimationFrame(tick)
}

function onPointerMove(e: PointerEvent) {
  if (cloudRef.value) {
    const r = cloudRef.value.getBoundingClientRect()
    cursorPos.x = e.clientX - r.left
    cursorPos.y = e.clientY - r.top
  }
}

function onToolLeave(tool: string) {
  if (hoveredTool.value === tool) hoveredTool.value = null
}

const marqueeItems = computed(() => [
  t('stack.title'),
  `${t('stack.toggleFront')} · ${t('stack.toggleBack')}`,
  t('mq.goingFullstack'),
  'msk · 2026',
])

// Recompute the cloud rect after a mode/lang swap repaints the node set.
watch([mode, activeLang], () => requestAnimationFrame(recalcCloudRect))

onMounted(() => {
  recalcCloudRect()
  const onResize = () => recalcCloudRect()
  window.addEventListener('resize', onResize)
  cloudRef.value?.addEventListener('pointermove', onPointerMove, { passive: true })
  cleanupFns.push(() => {
    window.removeEventListener('resize', onResize)
    cloudRef.value?.removeEventListener('pointermove', onPointerMove)
  })
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  for (const fn of cleanupFns) fn()
  cleanupFns = []
})
</script>

<template>
  <section
    id="stack"
    ref="sectionRef"
    class="stk"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" />

    <SectionHeader sigil="§ 03" :title="t('stack.title')">
      <template #meta>
        <span class="sec-meta-k">{{ mode === 'front' ? t('stack.toggleFront') : t('stack.toggleBack') }}</span>
        <span class="sec-meta-v">{{ String(count).padStart(2, '0') }}</span>
      </template>
    </SectionHeader>

    <!-- Toolbar — front/back toggle, plus a language sub-rail in backend mode.
         Backend languages still being learned are rendered muted. -->
    <div class="stk__toolbar">
      <div class="stk__toggle" role="tablist">
        <button
          type="button"
          class="stk__toggle-btn"
          :class="{ 'is-active': mode === 'front' }"
          @click="setMode('front')"
        >{{ t('stack.toggleFront') }}</button>
        <button
          type="button"
          class="stk__toggle-btn"
          :class="{ 'is-active': mode === 'back' }"
          @click="setMode('back')"
        >{{ t('stack.toggleBack') }}</button>
      </div>

      <Transition name="stk-langs">
        <div v-if="mode === 'back'" class="stk__langs">
          <button
            v-for="(l, i) in backLangs"
            :key="l.lang"
            type="button"
            class="stk__lang"
            :class="{ 'is-active': activeLang === i, 'is-learning': l.learning }"
            @click="setLang(i)"
          >
            {{ l.lang }}
            <span v-if="l.learning" class="stk__lang-mark" aria-hidden="true">°</span>
          </button>
        </div>
      </Transition>
    </div>

    <div
      ref="cloudRef"
      class="stk__cloud"
      :class="{ 'has-hot': hoveredTool !== null }"
    >
      <div class="stk__tools" :key="`${mode}-${activeLang}`">
        <span
          v-for="node in nodes"
          :key="node.name"
          :ref="(el) => { if (el) toolEls[node.name] = el as HTMLElement }"
          class="stk-tool"
          :class="{
            'is-hot': hoveredTool === node.name,
            'is-related': hoveredTool !== null && relatedSet.has(node.name),
            'is-center': node.center,
            'is-learning': node.learning,
          }"
          :style="`--fs: ${size(node.name)}; --w: ${node.w};`"
          @pointerenter="hoveredTool = node.name"
          @pointerleave="onToolLeave(node.name)"
        >{{ node.name }}</span>
      </div>

      <svg class="stk__lines" aria-hidden="true">
        <line
          v-for="r in relatedActive"
          :key="r"
          :ref="(el) => setRelatedRef(r, el)"
          class="stk__edge"
          x1="0" y1="0" x2="0" y2="0"
          pathLength="1"
        />
        <line
          ref="lineRef"
          class="stk__thread"
          :class="{ 'is-on': proximityTool !== null }"
          x1="0" y1="0" x2="0" y2="0"
        />
      </svg>

      <div class="stk__readout" aria-live="polite">
        <Transition name="stk-meta" mode="out-in">
          <div v-if="hoveredTool" :key="hoveredTool" class="stk__readout-on">
            <span class="stk__readout-name">{{ hoveredTool }}</span>
            <span class="stk__readout-meta">{{ readoutText }}</span>
          </div>
          <div v-else key="idle" class="stk__readout-off">
            <span class="stk__readout-dot" />
            <span>{{ t('stack.hint') }}</span>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.stk {
  position: relative;
  height: 100svh;
  padding: 92px 64px 110px;
  background: var(--bg);
  overflow: hidden;
  z-index: 2;
  display: flex;
  flex-direction: column;

  @media (max-width: 1279px) { padding: 92px 48px 100px; }
  @media (max-width: 768px) {
    height: auto;
    min-height: 100svh;
    padding: 76px 20px 96px;
  }
}

/* ── Toolbar ──────────────────────────────────────────────────────── */
.stk__toolbar {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 18px;
  flex-wrap: wrap;
  min-height: 30px;
}

.stk__toggle {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 3px;
  flex: 0 0 auto;
}
.stk__toggle-btn {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--muted);
  background: transparent;
  border: 0;
  padding: 5px 14px;
  cursor: pointer;
  border-radius: 2px;
  transition: color 0.25s ease, background-color 0.3s ease;

  &:hover { color: var(--fg); }
  &.is-active {
    color: #fff;
    background: var(--accent);
  }
}

.stk__langs {
  display: inline-flex;
  gap: 4px;
  flex-wrap: wrap;
}
.stk__lang {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  color: var(--fg);
  background: transparent;
  border: 1px solid var(--border);
  padding: 5px 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;

  &:hover { border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
  &.is-learning { opacity: 0.5; }
  &.is-active {
    color: var(--accent);
    border-color: var(--accent);
    opacity: 1;
  }
}
.stk__lang-mark { color: var(--accent); margin-left: 1px; }

.stk-langs-enter-active,
.stk-langs-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.stk-langs-enter-from,
.stk-langs-leave-to { opacity: 0; transform: translateX(-8px); }

/* ── Cloud ────────────────────────────────────────────────────────── */
.stk__cloud {
  position: relative;
  flex: 1;
  min-height: 0;
  margin-top: 18px;
}

/* Tool layer — re-keyed on every mode/lang switch so the set crossfades in. */
.stk__tools {
  position: absolute;
  inset: 0;
  animation: stk-set-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes stk-set-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.stk-tool {
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--font-display);
  font-size: var(--fs);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.95;
  color: var(--fg);
  text-transform: lowercase;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: color 0.3s ease, opacity 0.45s ease;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    inset: -10px -14px;
  }

  &.is-center { color: var(--accent); }
  /* Learning tools sit back — greyed, quieter, clearly "in progress". */
  &.is-learning {
    color: var(--muted);
    opacity: 0.5;
    font-style: italic;
  }
  &.is-hot { color: var(--accent); }
  &.is-related { color: var(--accent); opacity: 0.85; }
  .stk__cloud.has-hot &:not(.is-hot):not(.is-related) { opacity: 0.18; }
  .stk__cloud.has-hot &.is-learning:not(.is-hot) { opacity: 0.12; }
}

.stk__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}
.stk__thread {
  stroke: var(--accent);
  stroke-width: 1;
  stroke-dasharray: 4 5;
  opacity: 0;
  transition: opacity 0.25s ease;
  &.is-on { opacity: 0.55; }
}
.stk__edge {
  stroke: var(--accent);
  stroke-width: 1;
  stroke-linecap: round;
  opacity: 0.65;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: stk-edge-draw 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes stk-edge-draw {
  to { stroke-dashoffset: 0; }
}

.stk__readout {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 13px;
  text-transform: lowercase;
  letter-spacing: 0.04em;
  pointer-events: none;
  max-width: min(560px, 70%);
  z-index: 4;

  @media (max-width: 768px) { font-size: 12px; max-width: 100%; }
}
.stk__readout-off {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  opacity: 0.7;
}
.stk__readout-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.55;
}
.stk__readout-on {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 12px;
}
.stk__readout-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--accent);
  text-transform: lowercase;
}
.stk__readout-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  color: var(--fg);
  opacity: 0.85;
}

.stk-meta-enter-active,
.stk-meta-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.stk-meta-enter-from { opacity: 0; transform: translateY(4px); }
.stk-meta-leave-to { opacity: 0; transform: translateY(-4px); }

@media (hover: none), (prefers-reduced-motion: reduce) {
  .stk__thread { display: none; }
  .stk-tool::before { inset: -6px; }
}

/* Mobile — the positioned cloud collapses to a wrapping baseline list. */
@media (max-width: 900px) {
  .stk__tools {
    position: static;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    align-content: flex-start;
    gap: 4px 18px;
  }
  .stk-tool {
    position: static !important;
    transform: none !important;
    &::before { inset: -4px -6px; }
  }
  .stk__lines { display: none; }
  .stk__readout { position: static; margin-top: 24px; }
  .stk-tool.is-related { color: var(--fg); opacity: 1; }
  .stk__cloud.has-hot .stk-tool:not(.is-hot):not(.is-related) { opacity: 1; }
  .stk__cloud { flex: none; }
}
</style>
