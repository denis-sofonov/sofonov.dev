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
  reveal('.at-proc__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.at-proc__step', { y: 50, stagger: 0.12, duration: 1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="at-proc">
    <div class="at-proc__inner">
      <div class="at-proc__head">
        <div class="at-proc__eyebrow">{{ t('atelier.process.eyebrow') }}</div>
        <h2 class="at-proc__title">{{ t('atelier.process.title') }}</h2>
      </div>

      <div class="at-proc__grid">
        <div
          v-for="(item, i) in (tm('atelier.process.items') as Item[])"
          :key="i"
          class="at-proc__step"
        >
          <div class="at-proc__num">{{ item.num }}</div>
          <h3 class="at-proc__name">{{ item.title }}</h3>
          <p class="at-proc__desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-proc {
  @include at-section-padding;
  background: $at-bg;
  border-top: 1px solid $at-fg;
}

.at-proc__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.at-proc__head {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 80px;
  margin-bottom: 100px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 56px;
  }
}

.at-proc__eyebrow {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  padding-top: 12px;
}

.at-proc__title {
  @include at-display;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 500;
  color: $at-fg;
}

.at-proc__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.at-proc__step {
  padding-top: 32px;
  border-top: 2px solid $at-fg;
}

.at-proc__num {
  @include at-mono;
  font-size: 12px;
  color: $at-fg-muted;
  margin-bottom: 32px;
}

.at-proc__name {
  @include at-display;
  font-size: clamp(28px, 3vw, 44px);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: $at-fg;
  margin-bottom: 20px;
  line-height: 1;
}

.at-proc__desc {
  @include at-sans;
  font-size: 14px;
  line-height: 1.6;
  color: $at-fg-muted;
}
</style>
