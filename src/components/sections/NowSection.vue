<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm, locale } = useI18n()

interface Item { k: string; v: string; tag: string; level: number }
const items = computed(() => tm('now.items') as Item[])

const sectionRef = ref<HTMLElement | null>(null)
const clock = ref('')
let entered = false
let clockTimer: number | null = null

function tickClock() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const utc = d.getTime() + d.getTimezoneOffset() * 60_000
  const msk = new Date(utc + 3 * 60 * 60_000)
  clock.value = `${pad(msk.getHours())}:${pad(msk.getMinutes())}:${pad(msk.getSeconds())}`
}

const marqueeItems = computed(() => [
  t('now.title'),
  t('now.label'),
  t('now.updated'),
  t('mq.goingFullstack'),
])

onMounted(() => {
  tickClock()
  clockTimer = window.setInterval(tickClock, 1000)

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !entered) {
        entered = true
        runEntrance()
        io.disconnect()
      }
    }
  }, { threshold: 0.16 })
  if (sectionRef.value) io.observe(sectionRef.value)
})

onUnmounted(() => {
  if (clockTimer != null) clearInterval(clockTimer)
})

function runEntrance() {
  const root = sectionRef.value
  if (!root) return
  const lead = root.querySelector('.now__lead')
  if (lead) gsap.fromTo(lead, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' })
  root.querySelectorAll('.now__row').forEach((row, i) => {
    const base = 0.15 + i * 0.12
    const top = row.querySelector('.now__row-top')
    const v = row.querySelector('.now__v')
    const fill = row.querySelector('.now__meter-fill') as HTMLElement | null
    const rule = row.querySelector('.now__rule')
    if (top) gsap.fromTo(top, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, delay: base, ease: 'power3.out' })
    if (v) gsap.fromTo(v, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, delay: base + 0.06, ease: 'expo.out' })
    if (fill) gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1, delay: base + 0.18, ease: 'power3.out' })
    if (rule) gsap.fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.8, delay: base + 0.1, ease: 'power4.out' })
  })
}
</script>

<template>
  <section
    id="now"
    ref="sectionRef"
    class="now"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" reverse />

    <SectionHeader sigil="§ 05" :title="t('now.title')">
      <template #meta>
        <span class="now__dot" aria-hidden="true" />
        <span class="now__clock">msk {{ clock }}</span>
        <span class="now__sep" aria-hidden="true">·</span>
        <span class="sec-meta-v">{{ t('now.updated') }}</span>
      </template>
    </SectionHeader>

    <p class="now__lead">{{ t('now.lead') }}</p>

    <div class="now__board">
      <article
        v-for="(item, i) in items"
        :key="i"
        class="now__row"
      >
        <div class="now__row-top">
          <span class="now__k">{{ item.k }}</span>
          <span class="now__tag">{{ item.tag }}</span>
        </div>
        <p class="now__v">{{ item.v }}</p>
        <div class="now__meter" :aria-hidden="true">
          <span class="now__meter-fill" :style="{ '--lvl': item.level }" />
        </div>
        <span v-if="i < items.length - 1" class="now__rule" aria-hidden="true" />
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.now {
  position: relative;
  height: 100svh;
  padding: 92px 64px 110px;
  background: var(--bg);
  overflow: hidden;
  z-index: 4;
  display: flex;
  flex-direction: column;

  @media (max-width: 1279px) { padding: 92px 48px 100px; }
  @media (max-width: 768px) {
    height: auto;
    min-height: 100svh;
    padding: 76px 20px 96px;
  }
}

.now__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: now-pulse 1.8s ease-in-out infinite;
}
@keyframes now-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.6); }
}
.now__clock {
  color: var(--fg);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}
.now__sep { color: var(--muted); opacity: 0.4; }

.now__lead {
  margin: 22px 0 0;
  max-width: 30ch;
  font-family: var(--font-display);
  font-size: clamp(20px, 2.6vw, 34px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--fg);
  will-change: transform, opacity;

  @media (max-width: 768px) { margin-top: 16px; }
}

.now__board {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 18px;
  max-width: 1180px;
  width: 100%;
  align-self: center;
  min-height: 0;

  @media (max-width: 1279px) { max-width: 100%; }
}

/* ── one focus row ────────────────────────────────────────────────── */
.now__row {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
  gap: 8px;
  padding: 16px 0;

  @media (max-width: 768px) { padding: 18px 0; }
}

.now__row-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  will-change: transform, opacity;
}
.now__k {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}
.now__tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--muted);
  opacity: 0.6;
}

.now__v {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(18px, 2.4vw, 32px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--fg);
  max-width: 40ch;
  will-change: transform, opacity;

  @media (max-width: 1279px) { font-size: clamp(17px, 2.2vw, 26px); }
}

/* focus meter — fills to --lvl on entrance */
.now__meter {
  position: relative;
  height: 3px;
  margin-top: 6px;
  background: var(--border);
  overflow: hidden;
}
.now__meter-fill {
  position: absolute;
  inset: 0;
  width: calc(var(--lvl, 0.5) * 100%);
  background: var(--accent);
  transform-origin: left center;
  will-change: transform;
}

.now__rule {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--border);
  transform-origin: left center;
}

@media (prefers-reduced-motion: reduce) {
  .now__dot { animation: none; }
}
</style>
