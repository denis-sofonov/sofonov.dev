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
  reveal('.lu-pair__photo', { y: 60, duration: 1.6, start: 'top 80%' })
  reveal('.lu-pair__content > *', { y: 30, stagger: 0.12, duration: 1.4, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="lu-pair">
    <div class="lu-pair__inner">
      <div class="lu-pair__photo">
        <img :src="photos.bottle" alt="" loading="lazy" />
        <div class="lu-pair__overlay"></div>
      </div>
      <div class="lu-pair__content">
        <div class="lu-pair__eyebrow">{{ t('lumen.pairing.eyebrow') }}</div>
        <div class="lu-pair__label">{{ t('lumen.pairing.wineLabel') }}</div>
        <div class="lu-pair__producer">{{ t('lumen.pairing.wineProducer') }}</div>
        <h3 class="lu-pair__name">{{ t('lumen.pairing.wineName') }}</h3>
        <div class="lu-pair__region">{{ t('lumen.pairing.wineRegion') }}</div>
        <p class="lu-pair__desc">{{ t('lumen.pairing.wineDesc') }}</p>
        <a href="#wine" class="lu-pair__cta">
          {{ t('lumen.pairing.cta') }}
          <span>→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-pair {
  @include lu-section-padding;
  background: $lu-bg;
}

.lu-pair__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 100px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

.lu-pair__photo {
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

.lu-pair__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(14,10,8,0.4) 100%);
}

.lu-pair__content { max-width: 540px; }

.lu-pair__eyebrow { @include lu-eyebrow; }

.lu-pair__label {
  @include lu-display-italic;
  font-size: 16px;
  color: $lu-fg-muted;
  margin-bottom: 16px;
}

.lu-pair__producer {
  @include lu-sans;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: $lu-fg-subtle;
  margin-bottom: 12px;
}

.lu-pair__name {
  @include lu-display;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: $lu-fg;
  margin-bottom: 12px;
}

.lu-pair__region {
  @include lu-display-italic;
  font-size: 18px;
  color: $lu-gold;
  margin-bottom: 32px;
}

.lu-pair__desc {
  @include lu-sans;
  font-size: 16px;
  line-height: 1.7;
  color: $lu-fg-muted;
  margin-bottom: 40px;
}

.lu-pair__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  @include lu-sans;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $lu-fg;
  text-decoration: none;
  padding-bottom: 8px;
  border-bottom: 1px solid $lu-gold;
  transition: all 0.3s ease;

  &:hover {
    color: $lu-gold;
    span { transform: translateX(6px); }
  }

  span { transition: transform 0.3s ease; }
}
</style>
