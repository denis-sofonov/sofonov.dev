<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.at-ct__eyebrow', { y: 30, duration: 1, start: 'top 80%' })
  reveal('.at-ct__line', { y: 100, duration: 1.4, stagger: 0.1, start: 'top 80%' })
  reveal('.at-ct__sub', { y: 30, duration: 1, start: 'top 80%' })
  reveal('.at-ct__cta', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="contact" class="at-ct">
    <div class="at-ct__inner">
      <div class="at-ct__eyebrow">{{ t('atelier.contact.eyebrow') }}</div>

      <h2 class="at-ct__title">
        <div class="at-ct__line-wrap"><span class="at-ct__line">{{ t('atelier.contact.line1') }}</span></div>
        <div class="at-ct__line-wrap"><span class="at-ct__line at-ct__line--italic">{{ t('atelier.contact.line2') }}</span></div>
      </h2>

      <p class="at-ct__sub">{{ t('atelier.contact.sub') }}</p>

      <div class="at-ct__buttons">
        <a href="#" class="at-ct__cta at-ct__cta--primary">
          <span>hello@atelier.studio</span>
          <span>→</span>
        </a>
        <a href="#" class="at-ct__cta">
          <span>{{ t('atelier.contact.ctaSecondary') }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-ct {
  background: $at-fg;
  color: $at-bg;
  padding: 200px 40px 160px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) { padding: 100px 20px; }
}

.at-ct__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.at-ct__eyebrow {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-subtle;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 60px;
}

.at-ct__title {
  @include at-display;
  font-size: clamp(60px, 12vw, 200px);
  line-height: 0.9;
  letter-spacing: -0.05em;
  font-weight: 500;
  color: $at-bg;
  margin-bottom: 80px;
}

.at-ct__line-wrap {
  display: block;
  overflow: hidden;
}

.at-ct__line { display: inline-block; }

.at-ct__line--italic {
  @include at-display-italic;
  color: $at-accent;
}

.at-ct__sub {
  @include at-sans;
  font-size: clamp(15px, 1.3vw, 20px);
  line-height: 1.6;
  color: $at-fg-subtle;
  max-width: 540px;
  margin-bottom: 64px;
}

.at-ct__buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.at-ct__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  @include at-mono;
  font-size: clamp(16px, 2vw, 24px);
  text-decoration: none;
  color: $at-bg;
  border: 1px solid $at-fg-subtle;
  border-radius: 100px;
  padding: 24px 40px;
  transition: all 0.3s ease;

  &:hover {
    background: $at-bg;
    color: $at-fg;
    border-color: $at-bg;
  }
}

.at-ct__cta--primary {
  background: $at-accent;
  color: $at-fg;
  border-color: $at-accent;

  &:hover {
    background: $at-bg;
    border-color: $at-bg;
  }
}
</style>
