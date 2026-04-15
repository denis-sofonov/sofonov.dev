<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const { t, tm } = useI18n()
interface Item { num: string; name: string; desc: string; note: string; price: string; suffix: string }
const items = computed(() => tm('rates.items') as Item[])

const time = ref('')
let timeTimer: ReturnType<typeof setInterval> | null = null
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
})
function updateTime() {
  time.value = timeFormatter.format(new Date())
}

onMounted(() => {
  updateTime()
  const msToNextMinute = 60000 - (Date.now() % 60000)
  setTimeout(() => {
    updateTime()
    timeTimer = setInterval(updateTime, 60000)
  }, msToNextMinute)

  nextTick(() => {
    gsap.from('.rp-row__leader', {
      scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power3.inOut',
      stagger: 0.08, delay: 0.2, clearProps: 'all',
    })
  })
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
})
</script>

<template>
  <div class="rp-page">
    <div class="rp-sheet">
      <span class="rp-mark rp-mark--tl"></span>
      <span class="rp-mark rp-mark--tr"></span>
      <span class="rp-mark rp-mark--bl"></span>
      <span class="rp-mark rp-mark--br"></span>

      <!-- Top strip: label left, meta right -->
      <header class="rp-top">
        <span class="rp-corner">[ 05 · {{ t('nav.rates') }} — {{ t('rates.tag') }} ]</span>
        <div class="rp-meta">
          <span>SHEET 05/08</span>
          <span class="rp-meta__sep">·</span>
          <span>REV A · {{ t('rates.year') }}</span>
          <span class="rp-meta__sep">·</span>
          <span class="rp-meta__time">{{ time }}</span>
        </div>
      </header>

      <!-- Title block, editorial left-aligned -->
      <div class="rp-head">
        <h1 class="rp-title">{{ t('rates.title') }}</h1>
        <p class="rp-subtitle">{{ t('rates.subtitle') }}</p>
      </div>

      <!-- Rate list with dot leaders -->
      <div class="rp-list">
        <article v-for="(it, i) in items" :key="i" class="rp-row">
          <span class="rp-row__num">{{ it.num }}</span>
          <div class="rp-row__body">
            <div class="rp-row__line">
              <h3 class="rp-row__name">{{ it.name }}</h3>
              <span class="rp-row__leader" aria-hidden="true"></span>
              <span class="rp-row__price">
                <em v-if="it.suffix && !it.suffix.startsWith('/')" class="rp-row__suffix">{{ it.suffix }}</em>
                <strong>{{ it.price }}</strong>
                <em v-if="it.suffix && it.suffix.startsWith('/')" class="rp-row__suffix">&nbsp;{{ it.suffix }}</em>
              </span>
            </div>
            <p class="rp-row__desc">{{ it.desc }}</p>
            <span class="rp-row__note">{{ it.note }}</span>
          </div>
        </article>
      </div>

      <!-- Footer strip -->
      <footer class="rp-foot">
        <p class="rp-foot__note">{{ t('rates.note') }}</p>
        <span class="rp-foot__terms">{{ t('rates.terms') }}</span>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rp-page {
  min-height: 100vh;
  min-height: 100svh;
  padding: 56px 20px 12px;
  display: flex;
  align-items: stretch;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 52px 10px 10px;
  }
}

.rp-sheet {
  position: relative;
  width: 100%;
  padding: 24px 44px 20px;
  border: 1px solid var(--border);
  background: var(--bg);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 18px;
  overflow: hidden;

  @media (max-width: 768px) { padding: 24px 20px 22px; gap: 14px; }
}

// Registration marks
.rp-mark {
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;

  &::before, &::after {
    content: '';
    position: absolute;
    background: var(--fg);
  }

  &--tl { top: -1px; left: -1px;
    &::before { top: 0; left: 0; width: 1px; height: 100%; }
    &::after  { top: 0; left: 0; width: 100%; height: 1px; }
  }
  &--tr { top: -1px; right: -1px;
    &::before { top: 0; right: 0; width: 1px; height: 100%; }
    &::after  { top: 0; right: 0; width: 100%; height: 1px; }
  }
  &--bl { bottom: -1px; left: -1px;
    &::before { bottom: 0; left: 0; width: 1px; height: 100%; }
    &::after  { bottom: 0; left: 0; width: 100%; height: 1px; }
  }
  &--br { bottom: -1px; right: -1px;
    &::before { bottom: 0; right: 0; width: 1px; height: 100%; }
    &::after  { bottom: 0; right: 0; width: 100%; height: 1px; }
  }
}

// Top strip
.rp-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--ls-chrome);
  text-transform: uppercase;
  color: var(--muted);
}

.rp-corner { color: var(--muted); }

.rp-meta {
  display: flex;
  gap: 10px;
  align-items: baseline;
  color: var(--fg);
}

.rp-meta__sep { opacity: 0.4; }

.rp-meta__time {
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}

// Title block
.rp-head {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.rp-title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  line-height: 0.9;
  letter-spacing: var(--ls-display);
  color: var(--fg);
  margin: 0;
  font-weight: 500;
}

.rp-subtitle {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(14px, 1.1vw, 18px);
  line-height: 1.4;
  color: var(--muted);
  max-width: 640px;
  margin: 0;
}

// List
.rp-list {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 0;
}

.rp-row {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 18px;
  align-items: start;
  padding: 10px 0;
  border-top: 1px dashed var(--border);

  &:first-child { border-top: none; }

  @media (max-width: 640px) {
    grid-template-columns: 36px 1fr;
    gap: 12px;
  }
}

.rp-row__num {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: var(--ls-meta);
  color: var(--muted);
  padding-top: 12px;
}

.rp-row__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rp-row__line {
  display: flex;
  align-items: baseline;
  gap: 14px;
  min-height: 0;
}

.rp-row__name {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  line-height: 1;
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  color: var(--fg);
  margin: 0;
  font-weight: 500;
  white-space: nowrap;
}

.rp-row__leader {
  flex: 1;
  height: 1px;
  background: radial-gradient(circle, var(--muted) 45%, transparent 45%) 0 50% / 6px 2px repeat-x;
  opacity: 0.55;
  transform: translateY(-4px);
  min-width: 16px;
}

.rp-row__price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: var(--font-display);
  color: var(--fg);
  white-space: nowrap;

  strong {
    font-weight: 500;
    font-size: clamp(26px, 2.8vw, 40px);
    line-height: 1;
    letter-spacing: var(--ls-display);
  }
}

.rp-row__suffix {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: clamp(10px, 0.9vw, 13px);
  letter-spacing: var(--ls-meta);
  color: var(--muted);
  text-transform: uppercase;
}

.rp-row__desc {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(13px, 1vw, 16px);
  line-height: 1.45;
  color: var(--muted);
  margin: 0;
  max-width: 68ch;
}

.rp-row__note {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--ls-meta);
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.7;
}

// Footer
.rp-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--border);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}

.rp-foot__note {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(13px, 1vw, 16px);
  line-height: 1.4;
  color: var(--fg);
  margin: 0;
  max-width: 640px;
}

.rp-foot__terms {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
</style>
