<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Row { name: string; nw: boolean; mp: boolean; am: boolean }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-compare__table', { y: 50, duration: 1, start: 'top 75%' })
})
</script>

<template>
  <section ref="root" class="nw-compare">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.compare.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.compare.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.compare.subtitle') }}</p>
    </div>

    <div class="nw-compare__table">
      <div class="nw-compare__row nw-compare__row--head">
        <div class="nw-compare__cell nw-compare__cell--name">{{ (tm('northwind.compare.cols') as string[])[0] }}</div>
        <div class="nw-compare__cell nw-compare__cell--us">
          <svg viewBox="0 0 24 24" class="nw-compare__logo"><path d="M4 4 L12 20 L20 4 L12 12 Z" fill="currentColor"/></svg>
          {{ (tm('northwind.compare.cols') as string[])[1] }}
        </div>
        <div class="nw-compare__cell">{{ (tm('northwind.compare.cols') as string[])[2] }}</div>
        <div class="nw-compare__cell">{{ (tm('northwind.compare.cols') as string[])[3] }}</div>
      </div>

      <div
        v-for="(row, i) in (tm('northwind.compare.rows') as Row[])"
        :key="i"
        class="nw-compare__row"
      >
        <div class="nw-compare__cell nw-compare__cell--name">{{ row.name }}</div>
        <div class="nw-compare__cell nw-compare__cell--us">
          <span v-if="row.nw" class="nw-compare__check">✓</span>
          <span v-else class="nw-compare__cross">−</span>
        </div>
        <div class="nw-compare__cell">
          <span v-if="row.mp" class="nw-compare__check nw-compare__check--muted">✓</span>
          <span v-else class="nw-compare__cross">−</span>
        </div>
        <div class="nw-compare__cell">
          <span v-if="row.am" class="nw-compare__check nw-compare__check--muted">✓</span>
          <span v-else class="nw-compare__cross">−</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-compare {
  padding: 80px 24px 160px;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-compare__table {
  background: $nw-bg-card;
  border: 1px solid $nw-border;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.04),
    0 30px 60px -20px rgba(0,0,0,0.5);
}

.nw-compare__row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  border-bottom: 1px solid $nw-border;

  &:last-child { border-bottom: none; }

  &:not(.nw-compare__row--head):hover {
    background: rgba(255,255,255,0.02);
  }
}

.nw-compare__row--head {
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid $nw-border-bright;

  .nw-compare__cell {
    padding: 18px 20px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: $nw-fg-muted;
    text-transform: uppercase;
  }
}

.nw-compare__cell {
  padding: 16px 20px;
  font-size: 14px;
  text-align: center;
  color: $nw-fg-muted;
  border-left: 1px solid $nw-border;

  &:first-child { border-left: none; }
}

.nw-compare__cell--name {
  text-align: left;
  color: $nw-fg;
  font-weight: 500;
}

.nw-compare__cell--us {
  background: linear-gradient(180deg, rgba(0,212,255,0.06), rgba(0,212,255,0.02));
  color: $nw-fg !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.nw-compare__row--head .nw-compare__cell--us {
  color: $nw-accent-bright !important;
}

.nw-compare__logo {
  width: 14px;
  height: 14px;
  color: $nw-accent;
}

.nw-compare__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 255, 170, 0.15);
  color: $nw-green;
  font-weight: 700;
  font-size: 13px;
}

.nw-compare__check--muted {
  background: rgba(255,255,255,0.05);
  color: $nw-fg-muted;
}

.nw-compare__cross {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: $nw-fg-subtle;
  font-size: 18px;
  font-weight: 300;
}
</style>
