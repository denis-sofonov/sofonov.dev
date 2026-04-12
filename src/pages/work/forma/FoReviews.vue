<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Review { quote: string; source: string; score: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.fo-rev__eyebrow', { y: 30, duration: 1, start: 'top 80%' })
  reveal('.fo-rev__card', { y: 50, stagger: 0.12, duration: 1.1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="fo-rev">
    <div class="fo-rev__inner">
      <div class="fo-rev__eyebrow">{{ t('forma.reviews.eyebrow') }}</div>

      <div class="fo-rev__grid">
        <article
          v-for="(r, i) in (tm('forma.reviews.items') as Review[])"
          :key="i"
          class="fo-rev__card"
        >
          <div class="fo-rev__score">{{ r.score }}</div>
          <p class="fo-rev__quote">"{{ r.quote }}"</p>
          <div class="fo-rev__source">— {{ r.source }}</div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-rev {
  @include fo-section-padding;
  background: $fo-bg;
}

.fo-rev__inner {
  max-width: 1440px;
  margin: 0 auto;
}

.fo-rev__eyebrow {
  @include fo-mono;
  font-size: 11px;
  color: $fo-fg-muted;
  margin-bottom: 64px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

.fo-rev__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.fo-rev__card {
  background: $fo-bg-alt;
  border: 1px solid $fo-border;
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    border-color: $fo-fg-muted;
    background: $fo-bg-elevated;
    transform: translateY(-3px);
  }
}

.fo-rev__score {
  @include fo-display;
  font-size: 56px;
  font-weight: 600;
  color: $fo-accent;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
  line-height: 1;
}

.fo-rev__quote {
  @include fo-sans;
  font-size: 17px;
  line-height: 1.6;
  color: $fo-fg;
  margin-bottom: 24px;
  flex: 1;
  font-weight: 500;
}

.fo-rev__source {
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $fo-fg-muted;
  text-transform: uppercase;
  padding-top: 24px;
  border-top: 1px solid $fo-border-bright;
}
</style>
