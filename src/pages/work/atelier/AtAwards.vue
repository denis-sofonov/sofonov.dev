<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Award { year: string; name: string; source: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.at-awd__eyebrow', { y: 30, duration: 1, start: 'top 80%' })
  reveal('.at-awd__row', { y: 40, stagger: 0.06, duration: 0.9, start: 'top 85%' })
})
</script>

<template>
  <section ref="root" class="at-awd">
    <div class="at-awd__inner">
      <div class="at-awd__eyebrow">{{ t('atelier.awards.eyebrow') }}</div>

      <div class="at-awd__list">
        <article
          v-for="(a, i) in (tm('atelier.awards.items') as Award[])"
          :key="i"
          class="at-awd__row"
        >
          <div class="at-awd__year">{{ a.year }}</div>
          <div class="at-awd__name">{{ a.name }}</div>
          <div class="at-awd__source">{{ a.source }}</div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-awd {
  @include at-section-padding;
  background: $at-bg;
  border-top: 1px solid $at-fg;
}

.at-awd__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.at-awd__eyebrow {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  margin-bottom: 56px;
  display: block;
}

.at-awd__list {
  display: flex;
  flex-direction: column;
}

.at-awd__row {
  display: grid;
  grid-template-columns: 80px 1fr 200px;
  gap: 32px;
  align-items: baseline;
  padding: 28px 0;
  border-top: 1px solid $at-border-bright;
  transition: all 0.3s ease;

  &:last-child { border-bottom: 1px solid $at-border-bright; }

  &:hover {
    .at-awd__name { transform: translateX(12px); }
  }

  @media (max-width: 700px) {
    grid-template-columns: 60px 1fr;
    .at-awd__source { display: none; }
  }
}

.at-awd__year {
  @include at-mono;
  font-size: 13px;
  color: $at-fg-muted;
}

.at-awd__name {
  @include at-display;
  font-size: clamp(20px, 2.2vw, 32px);
  font-weight: 500;
  color: $at-fg;
  letter-spacing: -0.02em;
  transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
}

.at-awd__source {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: right;
}
</style>
