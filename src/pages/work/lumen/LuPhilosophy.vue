<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Item { num: string; title: string; desc: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.lu-phil__head > *', { y: 30, stagger: 0.12, duration: 1.4, start: 'top 80%' })
  reveal('.lu-phil__item', { y: 50, stagger: 0.18, duration: 1.4, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="lu-phil">
    <div class="lu-phil__inner">
      <div class="lu-phil__head">
        <div class="lu-phil__eyebrow">{{ t('lumen.philosophy.eyebrow') }}</div>
        <h2 class="lu-phil__title">{{ t('lumen.philosophy.title') }}</h2>
      </div>

      <div class="lu-phil__grid">
        <div
          v-for="(item, i) in (tm('lumen.philosophy.items') as Item[])"
          :key="i"
          class="lu-phil__item"
        >
          <div class="lu-phil__num">{{ item.num }}</div>
          <h3 class="lu-phil__name">{{ item.title }}</h3>
          <p class="lu-phil__desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-phil {
  @include lu-section-padding;
  background: $lu-bg-alt;
  border-top: 1px solid $lu-border;
  border-bottom: 1px solid $lu-border;
}

.lu-phil__inner {
  max-width: 1280px;
  margin: 0 auto;
}

.lu-phil__head {
  text-align: center;
  margin-bottom: 100px;

  @media (max-width: 768px) { margin-bottom: 60px; }
}

.lu-phil__eyebrow { @include lu-eyebrow; }

.lu-phil__title {
  @include lu-display;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: $lu-fg;
  max-width: 800px;
  margin: 0 auto;
}

.lu-phil__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 80px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 64px;
  }
}

.lu-phil__item {
  text-align: left;
  position: relative;
  padding-top: 24px;
  border-top: 1px solid $lu-border-bright;
}

.lu-phil__num {
  @include lu-display-italic;
  font-size: 64px;
  color: $lu-gold;
  line-height: 1;
  margin-bottom: 24px;
  opacity: 0.9;
}

.lu-phil__name {
  @include lu-display;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: $lu-fg;
  margin-bottom: 16px;
}

.lu-phil__desc {
  @include lu-sans;
  font-size: 15px;
  line-height: 1.7;
  color: $lu-fg-muted;
}
</style>
