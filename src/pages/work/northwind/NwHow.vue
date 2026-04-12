<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Step { num: string; title: string; desc: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-step', { x: -60, y: 0, stagger: 0.2, duration: 1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="nw-how">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.how.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.how.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.how.subtitle') }}</p>
    </div>
    <div class="nw-how__steps">
      <div
        v-for="(step, i) in (tm('northwind.how.steps') as Step[])"
        :key="i"
        class="nw-step"
      >
        <div class="nw-step__num">{{ step.num }}</div>
        <div class="nw-step__line"></div>
        <div class="nw-step__content">
          <h3 class="nw-step__title">{{ step.title }}</h3>
          <p class="nw-step__desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-how {
  padding: 80px 24px 160px;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-how__steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.nw-step {
  display: flex;
  gap: 32px;
  position: relative;
  padding: 32px 0;
  text-align: left;

  @media (max-width: 600px) { gap: 20px; padding: 24px 0; }
}

.nw-step__num {
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(180deg, $nw-accent-bright 0%, transparent 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  flex-shrink: 0;
  width: 120px;

  @media (max-width: 600px) { font-size: 48px; width: 70px; }
}

.nw-step__line {
  position: absolute;
  left: 130px;
  top: 60px;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, $nw-border-bright, transparent);

  .nw-step:last-child & { display: none; }
  @media (max-width: 600px) { left: 80px; }
}

.nw-step__content {
  padding-top: 12px;
  flex: 1;
}

.nw-step__title {
  font-size: clamp(22px, 2.5vw, 32px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  color: $nw-fg;
}

.nw-step__desc {
  font-size: 15px;
  line-height: 1.55;
  color: $nw-fg-muted;
  max-width: 520px;
}
</style>
