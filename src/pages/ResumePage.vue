<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'
import {
  siVuedotjs, siTypescript, siJavascript, siNuxt, siReact, siNextdotjs,
  siSass, siTailwindcss, siPinia, siRedux, siGsap, siVitest, siDocker,
  siGit, siVite, siNodedotjs, siPython, siGo, siPhp, siRuby,
  siReactrouter, siThreedotjs, siStorybook, siEslint, siPrettier,
  siFigma, siSketch, siGithub, siGitlab, siPnpm,
  siHtml5, siCss, siGraphql, siAxios, siZod, siSwagger, siCypress,
  siWebpack, siBabel, siLaravel, siPostgresql, siRedis,
  siRadixui, siJest, siTanstack,
} from 'simple-icons'

const { t, tm } = useI18n()

// Monochrome brand glyphs — rendered in currentColor so they stay on-palette.
// Keyed by the tool's display name (lowercased); anything unmapped shows text only.
const ICON_PATHS: Record<string, string> = {
  'vue 3': siVuedotjs.path,
  typescript: siTypescript.path,
  javascript: siJavascript.path,
  nuxt: siNuxt.path,
  react: siReact.path,
  'next.js': siNextdotjs.path,
  scss: siSass.path,
  tailwind: siTailwindcss.path,
  pinia: siPinia.path,
  redux: siRedux.path,
  gsap: siGsap.path,
  vitest: siVitest.path,
  docker: siDocker.path,
  git: siGit.path,
  vite: siVite.path,
  node: siNodedotjs.path,
  python: siPython.path,
  go: siGo.path,
  php: siPhp.path,
  ruby: siRuby.path,
  'vue router': siVuedotjs.path,
  'react router': siReactrouter.path,
  vuex: siVuedotjs.path,
  'three.js': siThreedotjs.path,
  storybook: siStorybook.path,
  eslint: siEslint.path,
  prettier: siPrettier.path,
  figma: siFigma.path,
  sketch: siSketch.path,
  github: siGithub.path,
  'gitlab ci': siGitlab.path,
  pnpm: siPnpm.path,
  html5: siHtml5.path,
  css: siCss.path,
  graphql: siGraphql.path,
  axios: siAxios.path,
  zod: siZod.path,
  swagger: siSwagger.path,
  cypress: siCypress.path,
  webpack: siWebpack.path,
  babel: siBabel.path,
  laravel: siLaravel.path,
  postgresql: siPostgresql.path,
  redis: siRedis.path,
  radix: siRadixui.path,
  jest: siJest.path,
  'tanstack query': siTanstack.path,
}
const iconFor = (name: string): string | null => ICON_PATHS[name.toLowerCase()] ?? null

// Real company logos where a public domain exists — pulled from Google's
// favicon service. Keyed by org name (covers both locales). Anything not here,
// or whose logo fails to load, falls back to the letter monogram below.
// Local logo files (drop them in public/logos/) take precedence — best quality,
// no external request. If the file is missing it errors out and we fall back to
// the favicon, then to the letter monogram.
const LOGO_FILES: Record<string, string> = {
  GlavNIVC: '/logos/glavnivc.png',
  'ГлавНИВЦ': '/logos/glavnivc.png',
}
// Favicon fallback for orgs with a clean public icon (Google's favicon service).
const DOMAINS: Record<string, string> = {
  'Azbuka Vkusa': 'av.ru',
  'Азбука вкуса': 'av.ru',
}
const logoSrcFor = (org: string): string | null => {
  if (LOGO_FILES[org]) return LOGO_FILES[org]
  if (DOMAINS[org]) return `https://www.google.com/s2/favicons?domain=${DOMAINS[org]}&sz=64`
  return null
}
const logoFailed = ref<Record<number, boolean>>({})

// Generic placeholder glyph for employers with no public logo (e.g. the agency
// "Web Studio") — a neutral code mark rather than a bare initial.
const PLACEHOLDER_ORGS = new Set(['Web Studio', 'Веб-студия'])
const PLACEHOLDER_PATH = 'M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'

const cvHref = '/denis-sofonov-cv.pdf'
const photo = '/denis-sofonov.jpg'

interface Item {
  tag: string
  org: string
  orgNote: string
  role: string
  period: string
  duration: string
  summary: string
  points: string[]
  stack: string[]
}
interface Feature { repo: string; title: string; tagline: string; tags: string[]; url: string; demo: string }

const items = computed(() => tm('experience.items') as Item[])
const looking = computed(() => tm('lookingFor.items') as { k: string; v: string }[])
const projects = computed(() => tm('projects.featured') as Feature[])

// Résumé skills grouped into scannable categories — every listed tool has a
// brand glyph. Curated (drops legacy vuex/sketch); the landing-page cloud still
// shows the full flat set.
const SKILL_GROUPS = [
  { key: 'languages', tools: ['typescript', 'javascript', 'html5', 'css', 'scss'] },
  { key: 'frameworks', tools: ['vue 3', 'nuxt', 'react', 'next.js'] },
  { key: 'state', tools: ['pinia', 'vuex', 'redux', 'zustand'] },
  { key: 'styling', tools: ['tailwind', 'radix', 'gsap', 'three.js', 'figma'] },
  { key: 'apidata', tools: ['graphql', 'tanstack query', 'zod', 'swagger'] },
  { key: 'testing', tools: ['vitest', 'jest', 'cypress', 'storybook', 'eslint'] },
  { key: 'tooling', tools: ['vite', 'webpack', 'git', 'github', 'gitlab ci', 'docker'] },
  { key: 'backend', tools: ['node', 'php', 'laravel', 'postgresql', 'redis'] },
]

const channels = [
  { key: 'telegram', label: 'telegram', value: '@denis_sofonov', href: 'https://t.me/denis_sofonov' },
  { key: 'email', label: 'email', value: 'denissofonovv@gmail.com', href: 'mailto:denissofonovv@gmail.com' },
  { key: 'github', label: 'github', value: '@denis-sofonov', href: 'https://github.com/denis-sofonov' },
]

const root = ref<HTMLElement | null>(null)
const photoEl = ref<HTMLElement | null>(null)

onMounted(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reduce && root.value) {
    const blocks = root.value.querySelectorAll('[data-rev]')
    gsap.fromTo(
      blocks,
      { y: 26, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay: 0.05 },
    )
  }

  // Interactive 3D tilt + glare on the portrait — the card leans toward the
  // cursor in real space with a moving sheen and an accent glow. Pointer
  // devices only; reduced-motion users get a calm static photo.
  const el = photoEl.value
  const inner = el?.querySelector('.sheet__photo-inner') as HTMLElement | null
  const fine = matchMedia('(hover: hover)').matches && !reduce
  if (el && inner && fine) {
    const MAX = 11
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      inner.style.setProperty('--ry', `${(px - 0.5) * MAX * 2}deg`)
      inner.style.setProperty('--rx', `${(0.5 - py) * MAX * 2}deg`)
      inner.style.setProperty('--gx', `${px * 100}%`)
      inner.style.setProperty('--gy', `${py * 100}%`)
    })
    el.addEventListener('pointerenter', () => {
      inner.style.setProperty('--s', '1.06')
      inner.style.setProperty('--glow', '1')
    })
    el.addEventListener('pointerleave', () => {
      inner.style.setProperty('--rx', '0deg')
      inner.style.setProperty('--ry', '0deg')
      inner.style.setProperty('--s', '1')
      inner.style.setProperty('--glow', '0')
    })
  }
})
</script>

<template>
  <main class="resume" ref="root">
    <!-- top actions — leave / download -->
    <nav class="resume__bar" data-rev>
      <RouterLink to="/" class="resume__back">
        <span class="resume__back-ic" aria-hidden="true">←</span>{{ t('resume.back') }}
      </RouterLink>
      <a class="resume__dl" :href="cvHref" download data-cursor="cta" :data-cursor-text="t('resume.download')">
        <span class="resume__dl-ic" aria-hidden="true">↓</span>{{ t('resume.download') }}
      </a>
    </nav>

    <article class="sheet">
      <!-- ── identity header ──────────────────────────────────────── -->
      <header class="sheet__head" data-rev>
        <div class="sheet__id">
          <h1 class="sheet__name">{{ t('fullName') }}</h1>
          <p class="sheet__role">{{ t('role') }}</p>
          <p class="sheet__loc">{{ t('resume.locationValue') }}</p>
        </div>
        <div class="sheet__photo" ref="photoEl">
          <div class="sheet__photo-inner">
            <img :src="photo" :alt="t('fullName')" loading="eager" />
            <span class="sheet__photo-glare" aria-hidden="true" />
          </div>
        </div>
      </header>

      <div class="sheet__rule" data-rev />

      <div class="sheet__grid">
        <!-- ── sidebar ────────────────────────────────────────────── -->
        <aside class="sheet__aside">
          <section class="block" data-rev>
            <h2 class="block__h">{{ t('resume.contactLabel') }}</h2>
            <ul class="contact">
              <li v-for="c in channels" :key="c.key" class="contact__row">
                <span class="contact__k">{{ c.label }}</span>
                <a class="contact__v" :href="c.href" :target="c.key === 'email' ? undefined : '_blank'" rel="noopener">{{ c.value }}</a>
              </li>
            </ul>
          </section>

          <section class="block" data-rev>
            <h2 class="block__h">{{ t('lookingFor.title') }}</h2>
            <dl class="kv">
              <div v-for="(l, i) in looking" :key="i" class="kv__row">
                <dt class="kv__k">{{ l.k }}</dt>
                <dd class="kv__v">{{ l.v }}</dd>
              </div>
            </dl>
          </section>

          <section class="block" data-rev>
            <h2 class="block__h">{{ t('resume.skillsLabel') }}</h2>
            <template v-for="(g, gi) in SKILL_GROUPS" :key="g.key">
              <p class="block__sub" :class="{ 'block__sub--gap': gi > 0 }">{{ t('resume.skillGroups.' + g.key) }}</p>
              <ul class="chips">
                <li v-for="tool in g.tools" :key="tool" class="chip">
                  <svg v-if="iconFor(tool)" class="chip__ic" viewBox="0 0 24 24" aria-hidden="true"><path :d="iconFor(tool)!" /></svg>{{ tool }}
                </li>
              </ul>
            </template>
          </section>

          <section class="block" data-rev>
            <h2 class="block__h">{{ t('resume.detailsLabel') }}</h2>
            <dl class="kv">
              <div class="kv__row">
                <dt class="kv__k">{{ t('resume.languagesLabel') }}</dt>
                <dd class="kv__v">{{ t('resume.languagesValue') }}</dd>
              </div>
              <div class="kv__row">
                <dt class="kv__k">{{ t('resume.educationLabel') }}</dt>
                <dd class="kv__v">{{ t('resume.educationValue') }}</dd>
              </div>
            </dl>
          </section>
        </aside>

        <!-- ── main column ────────────────────────────────────────── -->
        <div class="sheet__main">
          <section class="block" data-rev>
            <h2 class="block__h">{{ t('resume.summaryLabel') }}</h2>
            <p class="summary">{{ t('heroBio') }}</p>
          </section>

          <section class="block" data-rev>
            <h2 class="block__h">{{ t('resume.experienceLabel') }}</h2>
            <ol class="xp">
              <li v-for="(item, i) in items" :key="i" class="xp__item">
                <div class="xp__head">
                  <span class="xp__head-l">
                    <span
                      class="xp__logo"
                      :class="{ 'xp__logo--img': logoSrcFor(item.org) && !logoFailed[i] }"
                      aria-hidden="true"
                    >
                      <img
                        v-if="logoSrcFor(item.org) && !logoFailed[i]"
                        :src="logoSrcFor(item.org)!"
                        alt=""
                        loading="lazy"
                        @error="logoFailed[i] = true"
                      />
                      <svg
                        v-else-if="PLACEHOLDER_ORGS.has(item.org)"
                        class="xp__logo-svg"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      ><path :d="PLACEHOLDER_PATH" /></svg>
                      <template v-else>{{ item.org.charAt(0) }}</template>
                    </span>
                    <h3 class="xp__org">{{ item.org }}</h3>
                  </span>
                  <span class="xp__period">{{ item.period }}</span>
                </div>
                <p class="xp__role">
                  {{ item.role }}
                  <span class="xp__sep" aria-hidden="true">·</span>
                  <span class="xp__note">{{ item.orgNote }}</span>
                  <span class="xp__sep" aria-hidden="true">·</span>
                  <span class="xp__dur">{{ item.duration }}</span>
                </p>
                <p class="xp__summary">{{ item.summary }}</p>
                <ul class="xp__points">
                  <li v-for="(p, pi) in item.points" :key="pi" class="xp__point">
                    <span class="xp__mark" aria-hidden="true">▸</span>{{ p }}
                  </li>
                </ul>
                <p class="xp__stack">
                  <span class="xp__stack-k">{{ t('experience.stackLabel') }}</span>
                  <span class="xp__stack-v">{{ item.stack.join(' · ') }}</span>
                </p>
              </li>
            </ol>
          </section>

          <section class="block" data-rev>
            <h2 class="block__h">{{ t('resume.projectsLabel') }}</h2>
            <ul class="proj">
              <li v-for="p in projects" :key="p.repo" class="proj__item">
                <div class="proj__top">
                  <h3 class="proj__title">{{ p.title }}</h3>
                  <span class="proj__tagline">{{ p.tagline }}</span>
                </div>
                <p class="proj__tags">{{ p.tags.slice(0, 4).join(' · ') }}</p>
                <p class="proj__links">
                  <a :href="p.url" target="_blank" rel="noopener">code <span aria-hidden="true">↗</span></a>
                  <a :href="p.demo" target="_blank" rel="noopener">demo <span aria-hidden="true">↗</span></a>
                </p>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <footer class="sheet__foot" data-rev>
        <a class="resume__dl resume__dl--foot" :href="cvHref" download>
          <span class="resume__dl-ic" aria-hidden="true">↓</span>{{ t('resume.download') }}
        </a>
      </footer>
    </article>
  </main>
</template>

<style lang="scss" scoped>
.resume {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  padding: 96px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (max-width: 640px) { padding: 84px 14px 56px; }
}

/* ── top action bar ─────────────────────────────────────────────── */
.resume__bar {
  width: min(1000px, 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.resume__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.25s ease;
  &:hover { color: var(--accent); }
}
.resume__back-ic { transition: transform 0.3s ease; display: inline-block; }
.resume__back:hover .resume__back-ic { transform: translateX(-3px); }

.resume__dl {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: var(--accent);
  color: #fff;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
  &:hover { background: #0a0a0a; transform: translateY(-1px); }
}
:root[data-theme='dark'] .resume__dl:hover { background: #fff; color: var(--accent); }
.resume__dl-ic { color: currentColor; }

/* ── the sheet ──────────────────────────────────────────────────── */
.sheet {
  width: min(1000px, 100%);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: clamp(28px, 4vw, 56px);
  box-shadow: 0 40px 90px -50px rgba(0, 0, 0, 0.55);
}

/* identity */
.sheet__head {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 28px;
  align-items: start;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
.sheet__kicker {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--accent);
}
.sheet__name {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: clamp(34px, 6vw, 64px);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 0.95;
  color: var(--fg);
}
.sheet__role {
  margin: 12px 0 0;
  font-size: clamp(15px, 2vw, 19px);
  color: var(--fg);
  opacity: 0.85;
}
.sheet__loc {
  margin: 6px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  color: var(--muted);
}

.sheet__photo {
  position: relative;
  width: clamp(132px, 15vw, 168px);
  aspect-ratio: 1;
  flex-shrink: 0;
  perspective: 760px;

  @media (max-width: 560px) { width: 138px; }
}
.sheet__photo-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--s, 1));
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
  box-shadow:
    0 0 0 1px var(--border),
    0 calc(var(--glow, 0) * 24px) calc(var(--glow, 0) * 48px) calc(var(--glow, 0) * -18px)
      color-mix(in srgb, var(--accent) 60%, transparent);
  will-change: transform;
}
.sheet__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 13%;
}
/* cursor-tracked sheen — only visible while hovering (--glow) */
.sheet__photo-glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: var(--glow, 0);
  transition: opacity 0.45s ease;
  background: radial-gradient(
    circle at var(--gx, 50%) var(--gy, 50%),
    rgba(255, 255, 255, 0.42),
    rgba(255, 255, 255, 0) 55%
  );
  mix-blend-mode: soft-light;
}

.sheet__rule {
  height: 1px;
  background: var(--border);
  margin: clamp(24px, 3vw, 36px) 0;
}

/* layout */
.sheet__grid {
  display: grid;
  grid-template-columns: 0.82fr 1.5fr;
  gap: clamp(28px, 4vw, 56px);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
.sheet__aside {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}
.sheet__main {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
}

/* generic block */
.block__h {
  margin: 0 0 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.block__sub {
  margin: 0 0 8px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.7;
}
.block__sub--gap { margin-top: 16px; }

/* contact */
.contact { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.contact__row { display: flex; flex-direction: column; gap: 2px; }
.contact__k {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.6;
}
.contact__v {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--fg);
  text-decoration: none;
  transition: color 0.2s ease;
  word-break: break-all;
  &:hover { color: var(--accent); }
}

/* key/value list */
.kv { margin: 0; display: flex; flex-direction: column; gap: 10px; }
.kv__row { display: flex; flex-direction: column; gap: 2px; }
.kv__k {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.6;
}
.kv__v { margin: 0; font-size: 13.5px; line-height: 1.4; color: var(--fg); }

/* skill chips */
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--fg);
  padding: 4px 9px;
  border: 1px solid var(--border);
  border-radius: 3px;
}
.chip__ic {
  width: 12px;
  height: 12px;
  fill: currentColor;
  flex-shrink: 0;
  opacity: 0.85;
}
.chip--soft { color: var(--muted); opacity: 0.6; }
.chip--more {
  cursor: pointer;
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  transition: background-color 0.2s ease, color 0.2s ease;
  &:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
}

/* projects / open source */
.proj { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.proj__item {
  padding-left: 18px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: -3px;
    top: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
  }
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 2px;
    width: 1px;
    background: var(--border);
  }
}
.proj__top { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.proj__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(17px, 2vw, 21px);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--fg);
}
.proj__tagline {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--accent);
}
.proj__tags {
  margin: 6px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  opacity: 0.75;
}
.proj__links {
  margin: 8px 0 0;
  display: flex;
  gap: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  a {
    color: var(--fg);
    text-decoration: none;
    opacity: 0.8;
    transition: color 0.2s ease, opacity 0.2s ease;
    span { display: inline-block; transition: transform 0.3s ease; }
    &:hover { color: var(--accent); opacity: 1; }
    &:hover span { transform: translate(2px, -2px); }
  }
}

/* profile */
.summary {
  margin: 0;
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.6;
  color: var(--fg);
  opacity: 0.88;
  max-width: 62ch;
}

/* experience */
.xp { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 26px; }
.xp__item {
  position: relative;
  padding-left: 18px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 2px;
    width: 1px;
    background: var(--border);
  }
  &::after {
    content: '';
    position: absolute;
    left: -3px;
    top: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
  }
}
.xp__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.xp__head-l {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}
.xp__logo {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
  border-radius: 7px;
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  overflow: hidden;
}
.xp__logo--img {
  background: #fff;
  border-color: var(--border);
}
.xp__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}
.xp__logo-svg {
  width: 15px;
  height: 15px;
  fill: currentColor;
  display: block;
}
.xp__org {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(19px, 2.4vw, 26px);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--fg);
}
.xp__period {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.xp__role {
  margin: 4px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.03em;
  text-transform: lowercase;
  color: var(--muted);
}
.xp__sep { opacity: 0.4; margin: 0 5px; }
.xp__summary {
  margin: 10px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--fg);
  opacity: 0.82;
  max-width: 70ch;
}
.xp__points {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.xp__point {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--fg);
  opacity: 0.72;
  max-width: 80ch;
}
.xp__mark { color: var(--accent); flex-shrink: 0; font-size: 8px; line-height: 1.9; opacity: 0.8; }
.xp__stack {
  margin: 12px 0 0;
  display: flex;
  gap: 10px;
  align-items: baseline;
  flex-wrap: wrap;
}
.xp__stack-k {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.5;
}
.xp__stack-v {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  color: var(--fg);
  opacity: 0.7;
}

/* footer download */
.sheet__foot {
  margin-top: clamp(28px, 4vw, 40px);
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
}
.resume__dl--foot { background: transparent; color: var(--fg); border: 1px solid var(--border); }
.resume__dl--foot:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

/* ── print: a clean one-document résumé ─────────────────────────── */
@media print {
  .resume { padding: 0; }
  .resume__bar, .sheet__foot, .sheet__photo-glare { display: none; }
  .sheet__photo-inner { transform: none !important; box-shadow: none !important; }
  .sheet {
    width: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    background: #fff;
    color: #000;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheet__photo-inner { transform: none; transition: none; }
}
</style>
