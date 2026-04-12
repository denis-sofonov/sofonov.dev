<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useReveal } from './useReveal'

interface Stat { value: string; label: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

import { onMounted, nextTick } from 'vue'
onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-stat-big', { y: 50, stagger: 0.12, duration: 1, start: 'top 75%' })
})
</script>

<template>
  <section ref="root" class="nw-stats">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.stats.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.stats.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.stats.subtitle') }}</p>
    </div>
    <div class="nw-stats__grid">
      <div
        v-for="(s, i) in (tm('northwind.stats.items') as Stat[])"
        :key="i"
        class="nw-stat-big"
      >
        <div class="nw-stat-big__value">{{ s.value }}</div>
        <div class="nw-stat-big__label">{{ s.label }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-stats {
  padding: 160px 24px;
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 100px 16px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: $nw-border;
  border: 1px solid $nw-border;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
}

.nw-stat-big {
  background: $nw-bg;
  padding: 56px 32px;
  text-align: center;
  transition: background 0.2s ease;

  &:hover { background: $nw-bg-alt; }
}

.nw-stat-big__value {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 12px;
  background: linear-gradient(180deg, $nw-accent-bright 0%, $nw-accent 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-variant-numeric: tabular-nums;
}

.nw-stat-big__label {
  font-size: 13px;
  color: $nw-fg-muted;
  font-weight: 500;
}
</style>
