<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.at-about__eyebrow', { y: 30, duration: 1, start: 'top 80%' })
  reveal('.at-about__title', { y: 60, duration: 1.2, start: 'top 80%' })
  reveal('.at-about__body', { y: 30, duration: 1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="about" class="at-about">
    <div class="at-about__inner">
      <div class="at-about__eyebrow">{{ t('atelier.about.eyebrow') }}</div>
      <h2 class="at-about__title">{{ t('atelier.about.title') }}</h2>
      <p class="at-about__body">{{ t('atelier.about.body') }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-about {
  @include at-section-padding;
  background: $at-bg;
}

.at-about__inner {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.at-about__eyebrow {
  @include at-mono;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: $at-fg-muted;
  padding-top: 24px;
}

.at-about__title {
  @include at-display;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: $at-fg;
  font-weight: 500;
  margin-bottom: 56px;
  max-width: 1100px;
}

.at-about__body {
  @include at-sans;
  font-size: clamp(16px, 1.4vw, 21px);
  line-height: 1.55;
  color: $at-fg-muted;
  max-width: 720px;
  font-weight: 400;
  grid-column: 2;

  @media (max-width: 900px) { grid-column: 1; }
}
</style>
