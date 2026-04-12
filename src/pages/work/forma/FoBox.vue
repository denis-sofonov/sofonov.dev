<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'
import { photos } from './photos'

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.fo-box__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.fo-box__row', { y: 30, stagger: 0.08, duration: 0.9, start: 'top 80%' })
  reveal('.fo-box__photo', { y: 50, duration: 1.2, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="fo-box">
    <div class="fo-box__inner">
      <div class="fo-box__layout">
        <div class="fo-box__photo">
          <img :src="photos.box" alt="In the box" />
        </div>

        <div class="fo-box__content">
          <div class="fo-box__head">
            <div class="fo-box__eyebrow">{{ t('forma.box.eyebrow') }}</div>
            <h2 class="fo-box__title">{{ t('forma.box.title') }}</h2>
          </div>

          <div class="fo-box__list">
            <div
              v-for="(item, i) in (tm('forma.box.items') as string[])"
              :key="i"
              class="fo-box__row"
            >
              <div class="fo-box__num">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="fo-box__name">{{ item }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-box {
  @include fo-section-padding;
  background: $fo-bg-alt;
  border-top: 1px solid $fo-border;
}

.fo-box__inner {
  max-width: 1440px;
  margin: 0 auto;
}

.fo-box__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

.fo-box__photo {
  aspect-ratio: 4/5;
  background: $fo-bg-elevated;
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    filter: contrast(1.05);
  }
}

.fo-box__content {
  max-width: 540px;
}

.fo-box__head {
  margin-bottom: 56px;
}

.fo-box__eyebrow {
  @include fo-mono;
  font-size: 11px;
  color: $fo-fg-muted;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fo-box__title {
  @include fo-display-title;
  text-wrap: balance;
}

.fo-box__list {
  display: flex;
  flex-direction: column;
}

.fo-box__row {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 20px 0;
  border-bottom: 1px solid $fo-border;

  &:first-child { border-top: 1px solid $fo-border; }
}

.fo-box__num {
  @include fo-mono;
  font-size: 12px;
  color: $fo-fg-subtle;
  font-weight: 600;
}

.fo-box__name {
  @include fo-sans;
  font-size: 16px;
  color: $fo-fg;
  font-weight: 500;
}
</style>
