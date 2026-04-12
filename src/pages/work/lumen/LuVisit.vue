<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'
import { photos } from './photos'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.lu-visit__photo', { y: 60, duration: 1.6, start: 'top 80%' })
  reveal('.lu-visit__content > *', { y: 30, stagger: 0.1, duration: 1.4, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="visit" class="lu-visit">
    <div class="lu-visit__inner">
      <div class="lu-visit__content">
        <div class="lu-visit__eyebrow">{{ t('lumen.visit.eyebrow') }}</div>
        <h2 class="lu-visit__title">{{ t('lumen.visit.title') }}</h2>

        <div class="lu-visit__address">
          <div class="lu-visit__address-text">{{ t('lumen.visit.address') }}</div>
        </div>

        <div class="lu-visit__details">
          <div class="lu-visit__detail">
            <div class="lu-visit__detail-label">{{ t('lumen.visit.hoursLabel') }}</div>
            <div class="lu-visit__detail-value">{{ t('lumen.visit.hours') }}</div>
          </div>
          <div class="lu-visit__detail">
            <div class="lu-visit__detail-label">{{ t('lumen.visit.phoneLabel') }}</div>
            <div class="lu-visit__detail-value">{{ t('lumen.visit.phone') }}</div>
            <div class="lu-visit__detail-label" style="margin-top: 24px">{{ t('lumen.visit.emailLabel') }}</div>
            <div class="lu-visit__detail-value">hello@lumenwine.com</div>
          </div>
        </div>

        <a href="#" class="lu-visit__cta">
          {{ t('lumen.visit.cta') }}
          <span>→</span>
        </a>
      </div>

      <div class="lu-visit__photo">
        <img :src="photos.visit" alt="" loading="lazy" />
        <div class="lu-visit__photo-overlay"></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-visit {
  @include lu-section-padding;
  background: $lu-bg-alt;
  border-top: 1px solid $lu-border;
}

.lu-visit__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

.lu-visit__content { max-width: 540px; }

.lu-visit__eyebrow { @include lu-eyebrow; }

.lu-visit__title {
  @include lu-display;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: $lu-fg;
  margin-bottom: 48px;
}

.lu-visit__address {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid $lu-border-bright;
}

.lu-visit__address-text {
  @include lu-display-italic;
  font-size: 22px;
  color: $lu-gold;
  line-height: 1.5;
  white-space: pre-line;
}

.lu-visit__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 48px;
}

.lu-visit__detail {}

.lu-visit__detail-label {
  @include lu-sans;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $lu-fg-subtle;
  margin-bottom: 8px;
}

.lu-visit__detail-value {
  @include lu-sans;
  font-size: 14px;
  line-height: 1.6;
  color: $lu-fg;
  white-space: pre-line;
}

.lu-visit__cta {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  @include lu-sans;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $lu-fg;
  text-decoration: none;
  padding: 18px 40px;
  border: 1px solid $lu-fg;
  transition: all 0.3s ease;

  &:hover {
    background: $lu-gold;
    color: $lu-bg;
    border-color: $lu-gold;
  }

  span { transition: transform 0.3s ease; }
  &:hover span { transform: translateX(4px); }
}

.lu-visit__photo {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
  }
}

.lu-visit__photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(14,10,8,0.6));
}
</style>
