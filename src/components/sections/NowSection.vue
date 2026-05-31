<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm } = useI18n()

interface Item { k: string; v: string; tag: string; level: number }
const items = computed(() => tm('now.items') as Item[])

const marqueeItems = computed(() => [
  t('now.label'),
  t('now.updated'),
  'python · php · go',
])
</script>

<template>
  <section
    id="now"
    class="now"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" reverse />

    <SectionHeader :title="t('now.title')" data-stage>
      <template #meta>
        <span class="now__dot" aria-hidden="true" />
        <span class="sec-meta-v">{{ t('now.updated') }}</span>
      </template>
    </SectionHeader>

    <div class="now__board" data-stage>
      <article
        v-for="(item, i) in items"
        :key="i"
        class="now__row"
      >
        <div class="now__row-top">
          <span class="now__k">{{ item.k }}</span>
          <span class="now__tag">{{ item.tag }}</span>
        </div>
        <p class="now__v" data-gsap-mask data-split="words">{{ item.v }}</p>
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
