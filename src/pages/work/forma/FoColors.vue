<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick, computed } from 'vue'
import { useReveal } from './useReveal'
import { photos } from './photos'

interface Color { name: string; hex: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

const activeColor = ref(0)
const variantImages = [photos.variant1, photos.variant2, photos.variant3, photos.variant4]
const currentImage = computed(() => variantImages[activeColor.value])

onMounted(async () => {
  await nextTick()
  reveal('.fo-col__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.fo-col__layout', { y: 50, duration: 1.2, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="fo-col">
    <div class="fo-col__inner">
      <div class="fo-col__head">
        <div class="fo-col__eyebrow">{{ t('forma.colors.eyebrow') }}</div>
        <h2 class="fo-col__title">{{ t('forma.colors.title') }}</h2>
      </div>

      <div class="fo-col__layout">
        <div class="fo-col__photo">
          <img :src="currentImage" :key="activeColor" alt="Forma One" />
          <div class="fo-col__photo-tag">
            <span class="fo-col__photo-tag-mark" :style="{ background: (tm('forma.colors.items') as Color[])[activeColor].hex }"></span>
            {{ (tm('forma.colors.items') as Color[])[activeColor].name }}
          </div>
        </div>

        <div class="fo-col__picker">
          <div class="fo-col__picker-label">SELECT FINISH</div>
          <div class="fo-col__swatches">
            <button
              v-for="(c, i) in (tm('forma.colors.items') as Color[])"
              :key="i"
              class="fo-col__swatch"
              :class="{ 'fo-col__swatch--active': activeColor === i }"
              @click="activeColor = i"
            >
              <span class="fo-col__swatch-dot" :style="{ background: c.hex }"></span>
              <div class="fo-col__swatch-info">
                <div class="fo-col__swatch-name">{{ c.name }}</div>
                <div class="fo-col__swatch-status">{{ activeColor === i ? 'SELECTED' : 'AVAILABLE' }}</div>
              </div>
              <span v-if="activeColor === i" class="fo-col__swatch-check">✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-col {
  @include fo-section-padding;
  background: $fo-bg;
}

.fo-col__inner {
  max-width: 1440px;
  margin: 0 auto;
}

.fo-col__head {
  margin-bottom: 80px;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.fo-col__eyebrow {
  @include fo-mono;
  font-size: 11px;
  color: $fo-fg-muted;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fo-col__title {
  @include fo-display-title;
  text-wrap: balance;
}

.fo-col__layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

.fo-col__photo {
  position: relative;
  aspect-ratio: 4/3;
  background: $fo-bg-elevated;
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    filter: contrast(1.05);
    animation: foColFade 0.6s ease;
  }
}

@keyframes foColFade {
  from { opacity: 0; transform: scale(1.03); }
  to { opacity: 1; transform: scale(1); }
}

.fo-col__photo-tag {
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $fo-fg;
  background: rgba(250, 250, 246, 0.95);
  backdrop-filter: blur(10px);
  padding: 8px 14px;
  border-radius: 100px;
  border: 1px solid $fo-border;
  text-transform: uppercase;
}

.fo-col__photo-tag-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
}

.fo-col__picker {}

.fo-col__picker-label {
  @include fo-mono;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: $fo-fg-subtle;
  margin-bottom: 16px;
}

.fo-col__swatches {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fo-col__swatch {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: $fo-bg-alt;
  border: 1px solid $fo-border;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;

  &:hover {
    border-color: $fo-fg-muted;
    background: $fo-bg-elevated;
  }
}

.fo-col__swatch--active {
  border-color: $fo-fg !important;
  background: $fo-fg !important;

  .fo-col__swatch-name { color: $fo-bg !important; }
  .fo-col__swatch-status { color: $fo-accent !important; }
  .fo-col__swatch-check { color: $fo-bg; }
}

.fo-col__swatch-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  flex-shrink: 0;
  box-shadow: inset 0 -4px 8px rgba(0,0,0,0.1);
}

.fo-col__swatch-info {
  flex: 1;
}

.fo-col__swatch-name {
  @include fo-sans;
  font-size: 15px;
  font-weight: 600;
  color: $fo-fg;
  margin-bottom: 2px;
}

.fo-col__swatch-status {
  @include fo-mono;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $fo-fg-muted;
}

.fo-col__swatch-check {
  font-size: 18px;
  font-weight: 700;
}
</style>
