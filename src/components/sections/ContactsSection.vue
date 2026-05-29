<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'
import LogoMark from '../LogoMark.vue'

const { t, locale } = useI18n()

const cvHref = '/denis-sofonov-cv.pdf'

const sectionRef = ref<HTMLElement | null>(null)
const headlineEl = ref<HTMLElement | null>(null)
const rowEls = ref<HTMLElement[]>([])
const copiedIdx = ref<number>(-1)
const hoveredIdx = ref<number>(-1)
const now = ref<string>('')
const today = ref<string>('')
const year = new Date().getFullYear()
let entered = false
let clockTimer: number | null = null

const channels = [
  { key: 'telegram', value: '@denis_sofonov',   href: 'https://t.me/denis_sofonov',   copy: '@denis_sofonov',   verb: { en: 'write',    ru: 'написать' } },
  { key: 'email',    value: 'denissofonovv@gmail.com', href: 'mailto:denissofonovv@gmail.com', copy: 'denissofonovv@gmail.com', verb: { en: 'email',    ru: 'почта'    } },
  { key: 'github',   value: '@denis-sofonov',   href: 'https://github.com/denis-sofonov', copy: '@denis-sofonov',  verb: { en: 'see code', ru: 'код'      } },
]

// Logo spin speed reacts to channel hover — idle slow, hovering = faster.
// LogoMark reads spinDuration each frame so changes apply live.
const logoSpin = computed(() => hoveredIdx.value === -1 ? 22 : 6)

// Logo shrinks on shorter viewports so the whole section still fits 100svh.
const logoSize = ref(140)
function updateLogoSize() {
  const h = window.innerHeight
  logoSize.value = h < 720 ? 84 : h < 820 ? 104 : h < 920 ? 120 : 140
}

function tickClock() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  // Moscow time (UTC+3), derived from UTC so it's locale-independent.
  const utc = d.getTime() + d.getTimezoneOffset() * 60_000
  const msk = new Date(utc + 3 * 60 * 60_000)
  now.value = `${pad(msk.getHours())}:${pad(msk.getMinutes())}:${pad(msk.getSeconds())}`
  today.value = msk.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function verb(c: typeof channels[number]): string {
  return locale.value === 'ru' ? c.verb.ru : c.verb.en
}

async function copy(i: number) {
  const c = channels[i]
  try {
    await navigator.clipboard.writeText(c.copy)
    copiedIdx.value = i
    setTimeout(() => { if (copiedIdx.value === i) copiedIdx.value = -1 }, 1500)
  } catch { /* no-op */ }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const marqueeItems = computed(() => [
  t('contacts.title'),
  '@denis_sofonov',
  t('mq.openToWork'),
  `msk · ${year}`,
])

onMounted(() => {
  tickClock()
  clockTimer = window.setInterval(tickClock, 1000)
  updateLogoSize()
  window.addEventListener('resize', updateLogoSize)

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !entered) {
        entered = true
        runEntrance()
        io.disconnect()
      }
    }
  }, { threshold: 0.2 })
  if (sectionRef.value) io.observe(sectionRef.value)
})

onUnmounted(() => {
  if (clockTimer != null) clearInterval(clockTimer)
  window.removeEventListener('resize', updateLogoSize)
})

function runEntrance() {
  const tl = gsap.timeline()
  const logo = sectionRef.value?.querySelector('.cnt__logo')
  const avail = sectionRef.value?.querySelector('.cnt__avail')
  const headline = sectionRef.value?.querySelector('.cnt__headline')
  const lead = sectionRef.value?.querySelector('.cnt__lead')
  const rows = rowEls.value.filter(Boolean)
  const foot = sectionRef.value?.querySelector('.cnt__foot')

  // Varied easings per element — logo snaps with back.out (declarative mark
  // arrival), headline lifts with expo.out (editorial gravitas), rows stagger
  // with power2 (functional list), avail/foot just fade (metadata).
  if (avail)    tl.fromTo(avail,    { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'sine.out' }, 0)
  if (logo)     tl.fromTo(logo,     { scale: 0.4, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.1, ease: 'back.out(1.8)' }, 0.05)
  if (headline) tl.fromTo(headline, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95, ease: 'expo.out' }, 0.3)
  if (lead)     tl.fromTo(lead,     { y: 12, opacity: 0 }, { y: 0, opacity: 0.78, duration: 0.7, ease: 'power2.out' }, 0.55)
  if (rows.length) tl.fromTo(rows,  { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out' }, 0.75)
  if (foot)     tl.fromTo(foot,     { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'sine.out' }, 1.1)
}
</script>

<template>
  <section
    id="contacts"
    ref="sectionRef"
    class="cnt"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" />

    <SectionHeader sigil="§ 06" :title="t('contacts.title')">
      <template #meta>
        <span class="sec-meta-k">{{ t('contacts.metaK') }}</span>
        <span class="sec-meta-v">{{ t('contacts.metaV') }}</span>
      </template>
    </SectionHeader>

    <!-- Top status strip — pulsing dot + availability + live MSK clock -->
    <div class="cnt__avail">
      <span class="cnt__avail-dot" aria-hidden="true" />
      <span>{{ t('contacts.availability') }}</span>
      <span class="cnt__avail-sep" aria-hidden="true">·</span>
      <span class="cnt__clock">
        <span class="cnt__clock-msk">msk</span>
        <span class="cnt__clock-time">{{ now }}</span>
      </span>
    </div>

    <!-- The coda — animated logo as the visual arrival point. -->
    <div class="cnt__stage">
      <div class="cnt__logo">
        <LogoMark :size="logoSize" :spin-duration="logoSpin" :spike-count="12" />
      </div>

      <h3 ref="headlineEl" class="cnt__headline">{{ t('contacts.headline') }}</h3>

      <p class="cnt__lead">{{ t('contacts.lead') }}</p>

      <ul class="cnt__rows">
        <li
          v-for="(c, i) in channels"
          :key="c.key"
          :ref="(el) => { if (el) rowEls[i] = el as HTMLElement }"
          class="cnt-row"
          :class="{ 'is-hot': hoveredIdx === i, 'is-dim': hoveredIdx !== -1 && hoveredIdx !== i }"
          @pointerenter="hoveredIdx = i"
          @pointerleave="hoveredIdx = hoveredIdx === i ? -1 : hoveredIdx"
        >
          <span class="cnt-row__n">0{{ i + 1 }}</span>
          <span class="cnt-row__verb">{{ verb(c) }}</span>
          <a
            class="cnt-row__v"
            :href="c.href"
            :target="c.key === 'email' ? undefined : '_blank'"
            rel="noopener"
          >
            {{ c.value }}
            <span class="cnt-row__arrow" aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            class="cnt-row__copy"
            :aria-label="`copy ${c.value}`"
            @click="copy(i)"
          >
            <span v-if="copiedIdx === i" class="cnt-row__copy-done">{{ t('contacts.copiedLabel') }}</span>
            <span v-else class="cnt-row__copy-ic" aria-hidden="true">
              <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3">
                <rect x="3.5" y="3.5" width="7" height="7" rx="0.5" />
                <path d="M6.5 1.5H1.5v5" />
              </svg>
            </span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Bottom strip — colophon + back-to-top -->
    <footer class="cnt__foot">
      <div class="cnt__foot-l">
        <a class="cnt__cv" :href="cvHref" download>
          <span class="cnt__cv-ic" aria-hidden="true">↓</span>{{ t('cvLabel') }}
        </a>
        <span class="cnt__foot-sep">·</span>
        <span class="cnt__foot-mark">©</span>
        <span class="cnt__foot-year">{{ year }}</span>
        <span class="cnt__foot-sep">·</span>
        <span class="cnt__foot-colophon">{{ t('contacts.colophon') }}</span>
      </div>
      <button type="button" class="cnt__top" @click="scrollToTop">
        <span>{{ t('contacts.backToTop') }}</span>
        <span class="cnt__top-arrow" aria-hidden="true">↑</span>
      </button>
    </footer>
  </section>
</template>

<style lang="scss" scoped>
.cnt {
  position: relative;
  height: 100svh;
  padding: 92px 64px 48px;
  background: var(--bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 6;

  @media (max-width: 1279px) { padding: 92px 48px 40px; }
  @media (max-width: 768px) {
    height: auto;
    min-height: 100svh;
    padding: 76px 20px 36px;
  }
}

/* ── Top status strip ───────────────────────────────────────────── */
.cnt__avail {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: clamp(6px, 1.2vh, 14px);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: lowercase;
  color: var(--accent);
  align-self: flex-start;
}
.cnt__avail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: cnt-pulse 1.6s ease-in-out infinite;
}
@keyframes cnt-pulse {
  0%, 100% { opacity: 1;   transform: scale(1);    }
  50%      { opacity: 0.4; transform: scale(0.7);  }
}
.cnt__avail-sep { color: var(--muted); opacity: 0.45; }
.cnt__clock {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  color: var(--muted);
}
.cnt__clock-msk { opacity: 0.55; }
.cnt__clock-time {
  color: var(--fg);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
}

.cnt__cv {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.25s ease;

  &:hover { color: var(--accent); }
}
.cnt__cv-ic { color: var(--accent); }

/* ── Stage — logo + headline + channels, centred column ─────────── */
.cnt__stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 1.6vh, 18px);
  padding: clamp(6px, 2vh, 18px) 0;
  min-height: 0;

  @media (max-width: 768px) { gap: 12px; padding: 10px 0; }
}

.cnt__logo {
  /* breathing wobble around the auto-spin so the mark feels alive */
  display: inline-block;
  will-change: transform;
  transform-origin: center;
  animation: cnt-logo-bob 6s ease-in-out infinite;
}
@keyframes cnt-logo-bob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

.cnt__headline {
  margin: clamp(4px, 1.2vh, 12px) 0 0;
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(30px, 3.6vw, 56px);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1;
  color: var(--fg);
  text-transform: lowercase;
  max-width: 18ch;
}

.cnt__lead {
  margin: 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.55;
  color: var(--fg);
  opacity: 0.78;
  max-width: 50ch;
}

/* ── Channel rows — magnetic action-rail ─────────────────────────── */
.cnt__rows {
  list-style: none;
  margin: clamp(8px, 1.6vh, 16px) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: min(680px, 100%);

  @media (max-width: 768px) { margin-top: 10px; }
}

.cnt-row {
  display: grid;
  grid-template-columns: 32px 84px minmax(0, 1fr) 32px;
  gap: 18px;
  align-items: baseline;
  padding: clamp(9px, 1.5vh, 14px) 4px;
  border-bottom: 1px solid var(--border);
  transition: opacity 0.35s ease, padding 0.45s cubic-bezier(0.22, 1, 0.36, 1);

  &:first-child { border-top: 1px solid var(--border); }
  &.is-hot { padding-left: 12px; }
  .cnt__rows:has(.is-hot) &.is-dim { opacity: 0.35; }

  @media (max-width: 640px) {
    grid-template-columns: 28px 64px minmax(0, 1fr) 28px;
    gap: 12px;
    padding: 12px 4px;
  }
}

.cnt-row__n {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}
.cnt-row__verb {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}
.cnt-row.is-hot .cnt-row__verb { color: var(--accent); }

.cnt-row__v {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  font-family: var(--font-display);
  font-size: clamp(18px, 1.8vw, 24px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--fg);
  text-decoration: none;
  text-transform: lowercase;
  transition: color 0.3s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover { color: var(--accent); }
}
.cnt-row.is-hot .cnt-row__v {
  color: var(--accent);
  transform: translateX(4px);
}

.cnt-row__arrow {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 14px;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.cnt-row.is-hot .cnt-row__arrow {
  opacity: 1;
  transform: translateX(0);
}

.cnt-row__copy {
  background: transparent;
  border: 0;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  transition: color 0.25s ease;

  &:hover { color: var(--accent); }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
}
.cnt-row__copy-done {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: lowercase;
  white-space: nowrap;
}

/* ── Footer strip — colophon + back-to-top ───────────────────────── */
.cnt__foot {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--muted);

  @media (max-width: 640px) { flex-wrap: wrap; gap: 10px; padding-top: 12px; }
}
.cnt__foot-l {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.cnt__foot-mark { color: var(--accent); }
.cnt__foot-year { color: var(--fg); font-variant-numeric: tabular-nums; }
.cnt__foot-sep { opacity: 0.4; }
.cnt__foot-colophon { opacity: 0.65; }

.cnt__top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 0;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  color: var(--muted);
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.25s ease;

  &:hover { color: var(--accent); }
  &:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
}
.cnt__top-arrow {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.cnt__top:hover .cnt__top-arrow { transform: translateY(-3px); }

@media (prefers-reduced-motion: reduce) {
  .cnt__avail-dot,
  .cnt__logo { animation: none; }
}
</style>
