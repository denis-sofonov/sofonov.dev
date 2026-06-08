<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm } = useI18n()

const GITHUB_USER = 'denis-sofonov'
const ghUrl = `https://github.com/${GITHUB_USER}`

interface Feature {
  repo: string
  title: string
  tagline: string
  tags: string[]
  visual: 'onion' | 'transform' | 'request'
  url: string
  demo?: string
  pipeline?: { auth: string; validate: string; db: string }
  pair?: { label: string; url: string }
}
const featured = computed(() => tm('projects.featured') as Feature[])

// Spotlight — one project is centre-stage at a time and the reel auto-advances,
// so the section feels alive rather than a static list. Hovering it holds the
// current frame (pauses the progress animation that drives the advance).
const active = ref(0)
const paused = ref(false)
const activeFeature = computed(() => featured.value[active.value])
function pick(i: number) { active.value = i }
function onProgEnd() {
  const n = featured.value.length || 1
  active.value = (active.value + 1) % n
}

// Live star counts, merged in by repo name (curated fallback if rate-limited).
const FALLBACK_STARS: Record<string, number> = { 'DDD-with-Nuxt': 3 }
const stars = ref<Record<string, number>>({ ...FALLBACK_STARS })
function starsFor(repo: string) { return stars.value[repo] ?? 0 }

const marqueeItems = computed(() => [
  t('projects.label'),
  t('projects.hint'),
  t('mq.projTags'),
])

async function loadStars() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`)
    if (!res.ok) return
    const data = await res.json() as Array<{ name: string; stargazers_count: number }>
    const next = { ...stars.value }
    for (const r of data) next[r.name] = r.stargazers_count
    stars.value = next
  } catch { /* keep fallback */ }
}

onMounted(() => {
  loadStars()
})
</script>

<template>
  <section
    id="projects"
    class="prj"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" />

    <SectionHeader :title="t('projects.title')" data-stage>
      <template #meta>
        <span class="sec-meta-k">{{ t('projects.label') }}</span>
        <span class="sec-meta-v">{{ String(featured.length).padStart(2, '0') }}</span>
      </template>
    </SectionHeader>

    <div
      class="prj__spotlight"
      :class="{ 'is-paused': paused }"
      data-stage
      @pointerenter="paused = true"
      @pointerleave="paused = false"
    >
      <!-- selector reel — the active tab carries a progress bar that drives the
           auto-advance via its animationend -->
      <nav class="prj__reel" aria-label="projects">
        <button
          v-for="(f, i) in featured"
          :key="f.repo"
          type="button"
          class="prj__tab"
          :class="{ 'is-active': i === active }"
          @pointerenter="pick(i)"
          @focus="pick(i)"
          @click="pick(i)"
        >
          <span class="prj__tab-n">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="prj__tab-name">{{ f.title }}</span>
          <span class="prj__tab-prog" aria-hidden="true" @animationend="onProgEnd" />
        </button>
      </nav>

      <!-- centre stage — the big crossfading schematic -->
      <div class="prj__screen">
        <span class="prj__glow" aria-hidden="true" />
        <div
          v-for="(f, i) in featured"
          :key="f.repo"
          class="prj__viz"
          :class="{ 'is-active': i === active }"
          aria-hidden="true"
        >
          <!-- onion / clean-architecture layers -->
          <div v-if="f.visual === 'onion'" class="prj-onion">
            <div class="prj-onion__layer prj-onion__layer--4"><span class="prj-onion__lbl">{{ t('projects.onion.ui') }}</span></div>
            <div class="prj-onion__layer prj-onion__layer--3"><span class="prj-onion__lbl">{{ t('projects.onion.infra') }}</span></div>
            <div class="prj-onion__layer prj-onion__layer--2"><span class="prj-onion__lbl">{{ t('projects.onion.app') }}</span></div>
            <div class="prj-onion__core"><span class="prj-onion__lbl">{{ t('projects.onion.domain') }}</span></div>
          </div>

          <!-- request lifecycle — a POST travelling down the backend pipeline -->
          <div v-else-if="f.visual === 'request' && f.pipeline" class="prj-req">
            <div class="prj-req__head">
              <span class="prj-req__verb">POST</span>
              <span class="prj-req__path">/projects/:id/tasks</span>
            </div>
            <div class="prj-req__pipe">
              <i class="prj-req__flow" />
              <ul class="prj-req__steps">
                <li class="prj-req__step"><span class="prj-req__k">auth</span><span class="prj-req__v">{{ f.pipeline.auth }}</span></li>
                <li class="prj-req__step"><span class="prj-req__k">policy</span><span class="prj-req__v">owner-only · 403</span></li>
                <li class="prj-req__step"><span class="prj-req__k">validate</span><span class="prj-req__v">{{ f.pipeline.validate }}</span></li>
                <li class="prj-req__step"><span class="prj-req__k">service</span><span class="prj-req__v">domain rules</span></li>
                <li class="prj-req__step"><span class="prj-req__k">store</span><span class="prj-req__v">{{ f.pipeline.db }}</span></li>
              </ul>
            </div>
            <div class="prj-req__resp"><span class="prj-req__code">201</span> created · resource envelope</div>
          </div>

          <!-- t12n: a TypeScript type compiles down into a runtime guard -->
          <div v-else class="prj-t12n">
            <div class="prj-t12n__panel">
              <span class="prj-t12n__tag">type</span>
              <p class="prj-t12n__ln"><b>type</b> User = {</p>
              <p class="prj-t12n__ln prj-t12n__ln--in">id: <b>number</b></p>
              <p class="prj-t12n__ln prj-t12n__ln--in">email: <b>string</b></p>
              <p class="prj-t12n__ln">}</p>
            </div>
            <div class="prj-t12n__seam">
              <i class="prj-t12n__pulse" />
              <span class="prj-t12n__badge">t12n · build</span>
              <span class="prj-t12n__caret">↓</span>
            </div>
            <div class="prj-t12n__panel">
              <span class="prj-t12n__tag prj-t12n__tag--rt">runtime guard</span>
              <ul class="prj-t12n__checks">
                <li class="prj-t12n__check is-ok"><span class="prj-t12n__mark">✓</span> id <em>number</em></li>
                <li class="prj-t12n__check is-bad"><span class="prj-t12n__mark">✗</span> email <em>null</em></li>
              </ul>
              <p class="prj-t12n__throw">→ throws at the boundary</p>
            </div>
          </div>
        </div>
      </div>

      <!-- active project caption -->
      <Transition name="prj-cap" mode="out-in">
        <div :key="activeFeature.repo" class="prj__cap">
          <p class="prj__cap-tagline">{{ activeFeature.tagline }}</p>
          <ul class="prj__cap-tags" aria-hidden="true">
            <li v-for="tag in activeFeature.tags.slice(0, 5)" :key="tag" class="prj__cap-tag">{{ tag }}</li>
          </ul>
          <div class="prj__cap-foot">
            <span v-if="starsFor(activeFeature.repo) > 0" class="prj__cap-stars">★ {{ starsFor(activeFeature.repo) }}</span>
            <a :href="activeFeature.url" target="_blank" rel="noopener" class="prj__cap-link">{{ t('projects.code') }} <span aria-hidden="true">↗</span></a>
            <a v-if="activeFeature.demo" :href="activeFeature.demo" target="_blank" rel="noopener" class="prj__cap-link prj__cap-link--demo">{{ t('projects.demo') }} <span aria-hidden="true">↗</span></a>
            <a v-if="activeFeature.pair" :href="activeFeature.pair.url" target="_blank" rel="noopener" class="prj__cap-link"><span aria-hidden="true">↔</span> {{ activeFeature.pair.label }}</a>
          </div>
        </div>
      </Transition>
    </div>

    <a :href="ghUrl" target="_blank" rel="noopener" class="prj__more" data-stage>
      {{ t('projects.more') }} <span aria-hidden="true">↗</span>
    </a>
  </section>
</template>

<style lang="scss" scoped>
.prj {
  position: relative;
  height: 100svh;
  padding: 92px 64px 56px;
  background: var(--bg);
  overflow: hidden;
  z-index: 4;
  display: flex;
  flex-direction: column;

  @media (max-width: 1279px) { padding: 92px 48px 48px; }
  @media (max-width: 768px) {
    height: auto;
    min-height: 100svh;
    padding: 76px 20px 64px;
  }
}

/* ── spotlight stage ──────────────────────────────────────────────── */
.prj__spotlight {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(18px, 3vh, 34px);
  margin-top: 10px;
  width: 100%;
  min-height: 0;
}

/* ── selector reel ────────────────────────────────────────────────── */
.prj__reel {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(6px, 1.4vw, 18px);
}
.prj__tab {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  padding: 7px 4px 11px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: var(--muted);
  opacity: 0.5;
  transition: opacity 0.3s ease, color 0.3s ease;

  &:hover { opacity: 0.85; }
  &.is-active { opacity: 1; }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
}
.prj__tab-n {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.prj__tab-name {
  font-family: var(--font-display);
  font-size: clamp(14px, 1.5vw, 19px);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--fg);
}
.prj__tab.is-active .prj__tab-name { color: var(--accent); }
/* progress rail under the active tab — its end advances the reel */
.prj__tab-prog {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1.5px;
  width: 0;
  background: var(--accent);
}
.prj__tab.is-active .prj__tab-prog {
  animation: prj-prog 5s linear forwards;
}
.prj__spotlight.is-paused .prj__tab.is-active .prj__tab-prog {
  animation-play-state: paused;
}
@keyframes prj-prog {
  from { width: 0; }
  to   { width: 100%; }
}
/* resting underline on the active tab so it reads as selected even at width 0 */
.prj__tab.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background: var(--border);
}

/* ── centre screen ────────────────────────────────────────────────── */
.prj__screen {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: clamp(260px, 38vh, 380px);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* atmospheric glow behind the schematic */
.prj__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(360px, 44vw, 620px);
  height: clamp(360px, 44vw, 620px);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 62%);
  filter: blur(20px);
  opacity: 0.6;
  pointer-events: none;
}
.prj__viz {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(14px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.prj__viz.is-active {
  opacity: 1;
  transform: none;
}

/* ── active caption ───────────────────────────────────────────────── */
.prj__cap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  max-width: 640px;
}
.prj__cap-tagline {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(17px, 2vw, 26px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--fg);
}
.prj__cap-tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7px;
}
.prj__cap-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--muted);
  padding: 3px 9px;
  border: 1px solid var(--border);
  border-radius: 2px;
}
.prj__cap-foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin-top: 2px;
}
.prj__cap-stars {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.prj__cap-link {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: lowercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.25s ease;
  span { color: var(--accent); display: inline-block; transition: transform 0.3s ease; }
  &:hover { color: var(--fg); }
  &:hover span { transform: translate(2px, -2px); }
  &--demo { color: var(--accent); }
}

.prj-cap-enter-active,
.prj-cap-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.prj-cap-enter-from { opacity: 0; transform: translateY(8px); }
.prj-cap-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── visual: onion / clean architecture ───────────────────────────── */
.prj-onion {
  position: relative;
  width: clamp(250px, 26vw, 340px);
  aspect-ratio: 1;
}
.prj-onion__layer,
.prj-onion__core {
  position: absolute;
  border-radius: 20px;
  display: flex;
  justify-content: center;
}
.prj-onion__layer { border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent); }
.prj-onion__layer--4 { inset: 0; }
.prj-onion__layer--3 { inset: 13%; border-color: color-mix(in srgb, var(--accent) 58%, transparent); }
.prj-onion__layer--2 { inset: 26%; border-color: color-mix(in srgb, var(--accent) 72%, transparent); }
.prj-onion__core {
  inset: 39%;
  background: var(--accent);
  align-items: center;
}
.prj-onion__lbl {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  padding-top: 7px;
}
.prj-onion__core .prj-onion__lbl { color: #fff; padding-top: 0; }

/* ── visual: t12n — a type compiles down into a runtime guard ──────── */
.prj-t12n {
  --t12n-bad: #e0584e;
  width: 100%;
  max-width: clamp(320px, 34vw, 460px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.prj-t12n__panel {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-elevated);
  padding: 15px 18px 17px;
  box-shadow: 0 24px 60px -34px rgba(0, 0, 0, 0.4);
}
.prj-t12n__tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}
.prj-t12n__tag--rt { color: var(--accent); }
.prj-t12n__ln {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.72;
  color: var(--fg);
  white-space: nowrap;
  b { color: var(--accent); font-weight: 500; }
}
.prj-t12n__ln--in { padding-left: 16px; }
.prj-t12n__seam {
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prj-t12n__seam::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background-image: linear-gradient(var(--border) 58%, transparent 0);
  background-size: 1px 7px;
}
.prj-t12n__pulse {
  position: absolute;
  left: 50%;
  top: 2px;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: t12n-flow 2.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.prj-t12n__badge {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: lowercase;
  color: var(--accent);
  padding: 3px 9px;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  border-radius: 999px;
  background: var(--bg-elevated);
}
.prj-t12n__caret {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--accent);
}
@keyframes t12n-flow {
  0% { top: 2px; opacity: 0; }
  18% { opacity: 1; }
  82% { opacity: 1; }
  100% { top: 46px; opacity: 0; }
}
.prj-t12n__checks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.prj-t12n__check {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--fg);
  em { margin-left: auto; font-style: normal; color: var(--muted); }
}
.prj-t12n__mark { width: 1ch; }
.prj-t12n__check.is-ok .prj-t12n__mark { color: var(--accent); }
.prj-t12n__check.is-bad {
  .prj-t12n__mark { color: var(--t12n-bad); }
  em { color: var(--t12n-bad); text-decoration: line-through; opacity: 0.85; }
}
.prj-t12n__throw {
  margin: 12px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--t12n-bad);
}

/* ── visual: request lifecycle ────────────────────────────────────── */
.prj-req {
  width: 100%;
  max-width: clamp(320px, 34vw, 460px);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-elevated);
  box-shadow: 0 24px 60px -34px rgba(0, 0, 0, 0.4);
}
.prj-req__head {
  display: flex;
  align-items: baseline;
  gap: 9px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-alt);
  font-family: var(--font-mono);
  font-size: 13px;
}
.prj-req__verb { color: var(--accent); font-weight: 600; letter-spacing: 0.06em; }
.prj-req__path { color: var(--fg); opacity: 0.78; }
.prj-req__pipe {
  position: relative;
  padding: 13px 0;
}
.prj-req__pipe::before {
  content: '';
  position: absolute;
  left: 40px;
  top: 19px;
  bottom: 19px;
  width: 1px;
  background-image: linear-gradient(var(--border) 58%, transparent 0);
  background-size: 1px 6px;
}
.prj-req__flow {
  position: absolute;
  left: 40px;
  margin-left: -2.5px;
  top: 19px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: prj-req-flow 2.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
@keyframes prj-req-flow {
  0%   { top: 19px; opacity: 0; }
  12%  { opacity: 1; }
  88%  { opacity: 1; }
  100% { top: calc(100% - 19px); opacity: 0; }
}
.prj-req__steps {
  list-style: none;
  margin: 0;
  padding: 0;
}
.prj-req__step {
  position: relative;
  margin-left: 58px;
  padding: 8px 18px 8px 0;
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
}
.prj-req__step::before {
  content: '';
  position: absolute;
  left: -20.5px;
  top: 0.75em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--bg-elevated);
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
}
.prj-req__k {
  flex: 0 0 auto;
  min-width: 60px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 9px;
}
.prj-req__v { color: var(--fg); }
.prj-req__resp {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 13px 18px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}
.prj-req__code { color: var(--accent); font-weight: 600; }

.prj__more {
  align-self: center;
  margin-top: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.25s ease;
  &:hover { color: var(--accent); }
}

@media (prefers-reduced-motion: reduce) {
  .prj__tab.is-active .prj__tab-prog { animation: none; }
  .prj-t12n__pulse { animation: none; opacity: 0; }
  .prj-req__flow { animation: none; opacity: 0; }
  .prj__viz { transition: opacity 0.2s ease; transform: none; }
}
</style>
