<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'
import { photos } from './photos'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal, tween } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.lu-intro__photo', { y: 60, duration: 1.6, start: 'top 80%' })
  reveal('.lu-intro__eyebrow, .lu-intro__title, .lu-intro__body, .lu-intro__signature', {
    y: 40, stagger: 0.15, duration: 1.4, start: 'top 80%',
  })

  // Subtle parallax on photo
  tween('.lu-intro__img',
    { y: 0 },
    {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.lu-intro',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    },
  )
})
</script>

<template>
  <section ref="root" id="story" class="lu-intro">
    <div class="lu-intro__layout">
      <div class="lu-intro__photo">
        <img :src="photos.intro" alt="" class="lu-intro__img" loading="lazy" />
      </div>

      <div class="lu-intro__content">
        <div class="lu-intro__eyebrow">{{ t('lumen.intro.eyebrow') }}</div>
        <h2 class="lu-intro__title">{{ t('lumen.intro.title') }}</h2>
        <p class="lu-intro__body">{{ t('lumen.intro.body') }}</p>
        <div class="lu-intro__signature">{{ t('lumen.intro.signature') }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-intro {
  @include lu-section-padding;
  background: $lu-bg;
  position: relative;
  overflow: hidden;
}

.lu-intro__layout {
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

.lu-intro__photo {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 2px;
}

.lu-intro__img {
  width: 100%;
  height: 110%;
  object-fit: cover;
  display: block;
  filter: brightness(0.85);
}

.lu-intro__content { max-width: 520px; }

.lu-intro__eyebrow { @include lu-eyebrow; }

.lu-intro__title {
  @include lu-display;
  font-size: clamp(36px, 4.5vw, 60px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: $lu-fg;
  margin-bottom: 32px;
}

.lu-intro__body {
  @include lu-sans;
  font-size: 16px;
  line-height: 1.8;
  color: $lu-fg-muted;
  margin-bottom: 32px;
  font-weight: 400;
}

.lu-intro__signature {
  @include lu-display-italic;
  font-size: 18px;
  color: $lu-gold;
}
</style>
