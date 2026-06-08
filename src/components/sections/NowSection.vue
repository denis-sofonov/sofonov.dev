<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm } = useI18n()

interface Chip { label: string; url: string }
interface Item { k: string; v: string; tag: string; chips?: Chip[] }
const items = computed(() => tm('now.items') as Item[])

const marqueeItems = computed(() => [
  t('now.label'),
  t('now.updated'),
  'fastapi · laravel · nuxt',
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

    <!-- A live ledger of what's actually in motion — each stream pairs a focus
         with the real repos it's flowing into right now. -->
    <div class="now__board" data-stage>
      <article
        v-for="(item, i) in items"
        :key="i"
        class="now__stream"
      >
        <div class="now__meta">
          <span class="now__idx" aria-hidden="true">§{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="now__k">{{ item.k }}</span>
          <span class="now__tag">{{ item.tag }}</span>
        </div>

        <div class="now__body">
          <p class="now__v" data-gsap-mask data-split="words">{{ item.v }}</p>
          <ul v-if="item.chips && item.chips.length" class="now__chips">
            <li v-for="(c, ci) in item.chips" :key="ci" class="now__chip-li">
              <a :href="c.url" target="_blank" rel="noopener" class="now__chip">
                {{ c.label }} <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
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

/* ── one focus stream — meta rail | statement + repo chips ─────────── */
.now__stream {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: clamp(148px, 18vw, 228px) 1fr;
  gap: clamp(20px, 4vw, 72px);
  align-items: center;
  padding: clamp(18px, 3vh, 38px) 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
    align-items: start;
    padding: 22px 0;
  }
}

.now__meta {
  display: flex;
  flex-direction: column;
  gap: 9px;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: baseline;
    gap: 12px;
  }
}
.now__idx {
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 42px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.now__k {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg);
}
.now__tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--muted);
  opacity: 0.65;

  @media (max-width: 768px) { margin-left: auto; }
}

.now__body { min-width: 0; }
.now__v {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(19px, 2.5vw, 33px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.12;
  color: var(--fg);
  max-width: 32ch;

  @media (max-width: 1279px) { font-size: clamp(18px, 2.2vw, 27px); }
}

/* artifact chips — the actual repos this focus is flowing into */
.now__chips {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.now__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--muted);
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 2px;
  text-decoration: none;
  transition: color 0.25s ease, border-color 0.25s ease;
  span { color: var(--accent); transition: transform 0.3s ease; display: inline-block; }
  &:hover { color: var(--fg); border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
  &:hover span { transform: translate(2px, -2px); }
}

.now__rule {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--border);
}

@media (prefers-reduced-motion: reduce) {
  .now__dot { animation: none; }
}
</style>
