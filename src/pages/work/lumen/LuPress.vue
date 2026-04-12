<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Press { quote: string; source: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.lu-press__eyebrow', { y: 30, duration: 1.4, start: 'top 80%' })
  reveal('.lu-press__item', { y: 60, stagger: 0.18, duration: 1.6, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="lu-press">
    <div class="lu-press__inner">
      <div class="lu-press__eyebrow">{{ t('lumen.press.eyebrow') }}</div>

      <div class="lu-press__list">
        <figure
          v-for="(item, i) in (tm('lumen.press.items') as Press[])"
          :key="i"
          class="lu-press__item"
        >
          <div class="lu-press__quote-mark">"</div>
          <blockquote class="lu-press__quote">{{ item.quote }}</blockquote>
          <figcaption class="lu-press__source">— {{ item.source }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-press {
  @include lu-section-padding;
  background: $lu-bg-alt;
  border-top: 1px solid $lu-border;
  border-bottom: 1px solid $lu-border;
}

.lu-press__inner {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.lu-press__eyebrow {
  @include lu-eyebrow;
  margin-bottom: 80px;

  &::before { content: '— '; opacity: 0.6; }
  &::after { content: ' —'; opacity: 0.6; }
}

.lu-press__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 64px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

.lu-press__item {
  text-align: center;
  position: relative;
}

.lu-press__quote-mark {
  @include lu-display-italic;
  font-size: 80px;
  color: $lu-gold;
  line-height: 0;
  margin-bottom: 24px;
  opacity: 0.5;
}

.lu-press__quote {
  @include lu-display;
  font-size: clamp(20px, 2vw, 26px);
  font-style: italic;
  line-height: 1.4;
  color: $lu-fg;
  margin: 0 0 32px;
  font-weight: 400;
}

.lu-press__source {
  @include lu-sans;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $lu-gold;
}
</style>
