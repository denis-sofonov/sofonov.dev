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
  visual: 'onion' | 'terminal'
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
          <div v-else class="prj-term" aria-hidden="true">
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
}
</style>
