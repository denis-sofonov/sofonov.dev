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
  desc: string
  tags: string[]
  visual: 'onion' | 'terminal' | 'transform'
  url: string
  demo: string
}
const featured = computed(() => tm('projects.featured') as Feature[])

// Live star counts, merged in by repo name (curated fallback if rate-limited).
const FALLBACK_STARS: Record<string, number> = { 'DDD-with-Nuxt': 3, 'sosna': 0 }
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

    <div class="prj__feed" data-stage>
      <article
        v-for="(f, i) in featured"
        :key="f.repo"
        class="prj-feat"
        :class="{ 'prj-feat--rev': i % 2 === 1 }"
      >
        <div class="prj-feat__content">
          <span class="prj-feat__n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="prj-feat__title" data-gsap-mask data-split="words">{{ f.title }}</h3>
          <p class="prj-feat__tagline">{{ f.tagline }}</p>
          <p class="prj-feat__desc">{{ f.desc }}</p>
          <ul class="prj-feat__tags">
            <li v-for="tag in f.tags" :key="tag" class="prj-feat__tag">{{ tag }}</li>
          </ul>
          <div class="prj-feat__foot">
            <span v-if="starsFor(f.repo) > 0" class="prj-feat__stars">★ {{ starsFor(f.repo) }}</span>
            <a :href="f.url" target="_blank" rel="noopener" class="prj-feat__link">{{ t('projects.code') }} <span aria-hidden="true">↗</span></a>
            <a :href="f.demo" target="_blank" rel="noopener" class="prj-feat__link prj-feat__link--demo">{{ t('projects.demo') }} <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div class="prj-feat__visual">
          <!-- onion / clean-architecture layers -->
          <div v-if="f.visual === 'onion'" class="prj-onion" aria-hidden="true">
            <div class="prj-onion__layer prj-onion__layer--4"><span class="prj-onion__lbl">{{ t('projects.onion.ui') }}</span></div>
            <div class="prj-onion__layer prj-onion__layer--3"><span class="prj-onion__lbl">{{ t('projects.onion.infra') }}</span></div>
            <div class="prj-onion__layer prj-onion__layer--2"><span class="prj-onion__lbl">{{ t('projects.onion.app') }}</span></div>
            <div class="prj-onion__core"><span class="prj-onion__lbl">{{ t('projects.onion.domain') }}</span></div>
          </div>

          <!-- scaffolding terminal -->
          <div v-else-if="f.visual === 'terminal'" class="prj-term" aria-hidden="true">
            <div class="prj-term__bar">
              <span class="prj-term__dot" /><span class="prj-term__dot" /><span class="prj-term__dot" />
              <span class="prj-term__name">sosna — zsh</span>
            </div>
            <div class="prj-term__body">
              <p class="prj-term__line"><span class="prj-term__prompt">$</span> npx sosna create app</p>
              <p class="prj-term__line prj-term__q">◇ framework › <b>vue 3</b></p>
              <p class="prj-term__line prj-term__q">◇ state · router › <b>pinia · yes</b></p>
              <p class="prj-term__line prj-term__ok">✓ scaffolded 14 files</p>
              <p class="prj-term__line"><span class="prj-term__prompt">→</span> cd app &amp;&amp; pnpm dev<span class="prj-term__cursor" /></p>
            </div>
          </div>

          <!-- t12n: a TypeScript type compiles down into a runtime guard -->
          <div v-else class="prj-t12n" aria-hidden="true">
            <!-- source: the type you annotate -->
            <div class="prj-t12n__panel">
              <span class="prj-t12n__tag">type</span>
              <p class="prj-t12n__ln"><b>type</b> User = {</p>
              <p class="prj-t12n__ln prj-t12n__ln--in">id: <b>number</b></p>
              <p class="prj-t12n__ln prj-t12n__ln--in">email: <b>string</b></p>
              <p class="prj-t12n__ln">}</p>
            </div>

            <!-- build seam: where t12n injects the check -->
            <div class="prj-t12n__seam">
              <i class="prj-t12n__pulse" />
              <span class="prj-t12n__badge">t12n · build</span>
              <span class="prj-t12n__caret">↓</span>
            </div>

            <!-- runtime: the generated guard validating an incoming payload -->
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
      </article>
    </div>

    <a :href="ghUrl" target="_blank" rel="noopener" class="prj__more" data-stage>
      {{ t('projects.more') }} <span aria-hidden="true">↗</span>
    </a>
  </section>
</template>

<style lang="scss" scoped>
.prj {
  position: relative;
  min-height: 100svh;
  padding: 92px 64px 96px;
  background: var(--bg);
  overflow: hidden;
  z-index: 4;
  display: flex;
  flex-direction: column;

  @media (max-width: 1279px) { padding: 92px 48px 88px; }
  @media (max-width: 768px) { min-height: auto; padding: 76px 20px 88px; }
}

.prj__feed {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(36px, 5vh, 72px);
  margin-top: 24px;
  max-width: 1240px;
  width: 100%;
  align-self: center;
  min-height: 0;

  @media (max-width: 1279px) { max-width: 100%; }
}

/* ── one featured case ────────────────────────────────────────────── */
.prj-feat {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(28px, 5vw, 76px);
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
.prj-feat--rev {
  grid-template-columns: 0.85fr 1.15fr;
  .prj-feat__content { order: 2; }
  .prj-feat__visual { order: 1; }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    .prj-feat__content { order: 1; }
    .prj-feat__visual { order: 2; }
  }
}

.prj-feat__content { min-width: 0; }

.prj-feat__n {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  margin-bottom: 10px;
}
.prj-feat__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 56px);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 0.98;
  color: var(--fg);
}
.prj-feat__tagline {
  margin: 8px 0 0;
  font-family: var(--font-mono);
  font-size: clamp(12px, 1.3vw, 14px);
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: var(--accent);
}
.prj-feat__desc {
  margin: 16px 0 0;
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.5;
  color: var(--fg);
  opacity: 0.78;
  max-width: 52ch;
}
.prj-feat__tags {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.prj-feat__tag {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--muted);
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 2px;
}
.prj-feat__foot {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 22px;
}
.prj-feat__stars {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.prj-feat__link {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  color: var(--fg);
  text-decoration: none;
  opacity: 0.75;
  transition: color 0.25s ease, opacity 0.25s ease;
  span { transition: transform 0.3s ease; display: inline-block; }
  &:hover { color: var(--accent); opacity: 1; }
  &:hover span { transform: translate(2px, -2px); }
  &--demo { color: var(--accent); opacity: 0.9; }
}

/* ── visual: onion / clean architecture ───────────────────────────── */
.prj-feat__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}
.prj-onion {
  position: relative;
  width: clamp(220px, 24vw, 300px);
  aspect-ratio: 1;
}
.prj-onion__layer,
.prj-onion__core {
  position: absolute;
  border-radius: 18px;
  display: flex;
  justify-content: center;
}
.prj-onion__layer {
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
}
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
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  padding-top: 6px;
}
.prj-onion__core .prj-onion__lbl { color: #fff; padding-top: 0; }

/* ── visual: terminal ─────────────────────────────────────────────── */
.prj-term {
  width: 100%;
  max-width: clamp(300px, 32vw, 440px);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-elevated);
  box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.4);
}
.prj-term__bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-alt);
}
.prj-term__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--border);
  &:nth-child(1) { background: color-mix(in srgb, var(--accent) 70%, transparent); }
}
.prj-term__name {
  margin-left: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--muted);
}
.prj-term__body {
  padding: 16px 16px 18px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.85;
}
.prj-term__line { margin: 0; color: var(--fg); white-space: nowrap; b { color: var(--fg); font-weight: 500; } }
.prj-term__prompt { color: var(--accent); }
.prj-term__q { color: var(--muted); }
.prj-term__ok { color: var(--accent); }
.prj-term__cursor {
  display: inline-block;
  width: 8px;
  height: 1.05em;
  margin-left: 4px;
  background: var(--accent);
  vertical-align: text-bottom;
  animation: prj-blink 1.1s steps(1) infinite;
}
@keyframes prj-blink { 50% { opacity: 0; } }

/* ── visual: t12n — a type compiles down into a runtime guard ──────── */
.prj-t12n {
  --t12n-bad: #e0584e;
  width: 100%;
  max-width: clamp(300px, 32vw, 440px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.prj-t12n__panel {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-elevated);
  padding: 14px 16px 16px;
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
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--fg);
  white-space: nowrap;
  b { color: var(--accent); font-weight: 500; }
}
.prj-t12n__ln--in { padding-left: 16px; }

/* build seam — the boundary where the plugin injects the check */
.prj-t12n__seam {
  position: relative;
  height: 46px;
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
  100% { top: 44px; opacity: 0; }
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
  font-size: 12.5px;
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

.prj__more {
  align-self: center;
  margin-top: 28px;
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
  .prj-term__cursor { animation: none; }
  .prj-t12n__pulse { animation: none; opacity: 0; }
}
</style>
