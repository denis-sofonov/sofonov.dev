<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm } = useI18n()

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
const items = computed(() => tm('experience.items') as Item[])

const hoveredIdx = ref<number>(-1)

// Marquee carries context, not the title — the header already names the
// section, so repeating it here just doubled up.
const marqueeItems = computed(() => [
  `${t('experience.label')} · ${String(items.value.length).padStart(2, '0')}`,
  t('mq.leadFullstack'),
  t('mq.yrsProd'),
])
</script>

<template>
  <section
    id="experience"
    class="exp"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" />

    <SectionHeader :title="t('experience.title')" data-stage>
      <template #meta>
        <span class="sec-meta-k">{{ t('experience.label') }}</span>
        <span class="sec-meta-v">{{ String(items.length).padStart(2, '0') }}</span>
      </template>
    </SectionHeader>

    <!-- Career timeline — a vertical spine threads the roles, newest on top
         with a live node. Each entry: period anchor + sector on the rail, then
         org, role, a one-line summary, achievement bullets and the stack. -->
    <div class="exp__ledger" :class="{ 'has-hover': hoveredIdx !== -1 }" data-stage>
      <article
        v-for="(item, i) in items"
        :key="i"
        class="exp__row"
        :class="{ 'is-hot': hoveredIdx === i, 'is-dim': hoveredIdx !== -1 && hoveredIdx !== i, 'is-now': i === 0 }"
        @pointerenter="hoveredIdx = i"
        @pointerleave="hoveredIdx = hoveredIdx === i ? -1 : hoveredIdx"
      >
        <span class="exp__spine" aria-hidden="true" />
        <span class="exp__node" aria-hidden="true" />

        <div class="exp__rail">
          <span class="exp__tag">{{ item.tag }}</span>
          <span class="exp__period">{{ item.period }}</span>
          <span class="exp__duration">{{ item.duration }}</span>
        </div>

        <div class="exp__main">
          <div class="exp__head">
            <h3 class="exp__org" data-gsap-mask data-split="words">{{ item.org }}</h3>
            <span class="exp__note">{{ item.orgNote }}</span>
            <span class="exp__role">{{ item.role }}</span>
          </div>
          <p class="exp__summary">{{ item.summary }}</p>
          <ul class="exp__points">
            <li v-for="(p, pi) in item.points" :key="pi" class="exp__point">
              <span class="exp__point-mark" aria-hidden="true">▸</span>{{ p }}
            </li>
          </ul>
          <div class="exp__stack">
            <span class="exp__stack-k">{{ t('experience.stackLabel') }}</span>
            <span class="exp__stack-list">
              <template v-for="(s, si) in item.stack" :key="si"
                >{{ s }}<span v-if="si < item.stack.length - 1" class="exp__stack-sep" aria-hidden="true"> · </span></template>
            </span>
          </div>
        </div>

        <span v-if="i < items.length - 1" class="exp__rule" aria-hidden="true" />
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.exp {
  position: relative;
  min-height: 100svh;
  padding: 92px 64px 96px;
  background: var(--bg);
  overflow: hidden;
  z-index: 4;
  display: flex;
  flex-direction: column;

  @media (max-width: 1279px) { padding: 92px 48px 88px; }
  @media (max-width: 768px) {
    min-height: auto;
    padding: 76px 20px 88px;
  }
}

.exp__ledger {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  max-width: 1240px;
  width: 100%;
  align-self: center;
  min-height: 0;

  @media (max-width: 1279px) { max-width: 100%; margin-top: 14px; }
}

/* ── ROW — one role ──────────────────────────────────────────────── */
.exp__row {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: clamp(190px, 17vw, 240px) 1fr;
  gap: clamp(20px, 3vw, 48px);
  align-content: center;
  padding: 18px 0;

  /* Left accent ribbon — drawn on hover, same gesture as the manifesto */
  &::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 18px;
    bottom: 18px;
    width: 2px;
    background: var(--accent);
    transform: scaleY(0);
    transform-origin: top center;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
  transition: opacity 0.4s ease;

  &.is-hot::before { transform: scaleY(1); }
  .exp__ledger.has-hover &.is-dim { opacity: 0.34; }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 22px 0;
  }
}

/* ── SPINE + NODE — the timeline thread ──────────────────────────── */
.exp__spine {
  position: absolute;
  left: 3px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
}
/* the thread runs from the newest node down to the oldest — no dangling ends */
.exp__row.is-now .exp__spine { top: 50%; }
.exp__row:last-child .exp__spine { bottom: 50%; }
.exp__node {
  position: absolute;
  left: 0;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted);
  transform: translateY(-50%);
  z-index: 1;
}
.exp__row.is-now .exp__node {
  background: var(--accent);
  animation: exp-node-pulse 1.9s ease-in-out infinite;
}
@keyframes exp-node-pulse {
  0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  50%      { box-shadow: 0 0 0 7px color-mix(in srgb, var(--accent) 5%, transparent); }
}
.exp__row.is-hot .exp__node { background: var(--accent); }

/* ── RAIL — period anchor + sector ───────────────────────────────── */
.exp__rail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 26px;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 14px;
  }
}
.exp__tag {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.85;
}
.exp__period {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.3vw, 30px);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: var(--fg);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  @media (max-width: 768px) { font-size: 22px; }
}
.exp__duration {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: var(--muted);
  opacity: 0.7;
}

/* ── MAIN — org, role, summary, points, stack ────────────────────── */
.exp__main { min-width: 0; }

.exp__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-bottom: 8px;
}
.exp__org {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(26px, 3.2vw, 46px);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: var(--fg);
}
.exp__note {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.6;
}
.exp__role {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-left: auto;

  @media (max-width: 768px) { margin-left: 0; }
}

.exp__summary {
  margin: 0 0 12px;
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.45;
  color: var(--fg);
  opacity: 0.84;
  max-width: 70ch;
}

.exp__points {
  list-style: none;
  margin: 0 0 14px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 88ch;
}
.exp__point {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--fg);
  opacity: 0.66;

  @media (max-width: 1279px) { font-size: 12px; }
}
.exp__point-mark {
  color: var(--accent);
  flex-shrink: 0;
  font-size: 9px;
  line-height: 1.7;
  opacity: 0.8;
}

.exp__stack {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
}
.exp__stack-k {
  flex-shrink: 0;
  color: var(--muted);
  opacity: 0.5;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 9.5px;
}
.exp__stack-list {
  color: var(--fg);
  opacity: 0.7;
  letter-spacing: 0.02em;
  line-height: 1.5;
}
.exp__stack-sep { color: var(--accent); opacity: 0.5; }

/* Hairline between rows — drawn in on entrance */
.exp__rule {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--border);
  transform-origin: left center;
}
</style>
