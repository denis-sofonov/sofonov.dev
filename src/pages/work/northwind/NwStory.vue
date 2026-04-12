<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Metric { value: string; label: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.nw-story__inner > *', { y: 40, stagger: 0.12, duration: 0.9 })
})
</script>

<template>
  <section ref="root" class="nw-story">
    <div class="nw-story__bg">
      <div class="nw-story__glow"></div>
    </div>
    <div class="nw-story__inner">
      <div class="nw-eyebrow">{{ t('northwind.story.eyebrow') }}</div>
      <div class="nw-story__quote-mark">"</div>
      <p class="nw-story__quote">{{ t('northwind.story.quote') }}</p>
      <div class="nw-story__author">
        <div class="nw-story__avatar">JO</div>
        <div>
          <div class="nw-story__name">{{ t('northwind.story.author') }}</div>
          <div class="nw-story__role">{{ t('northwind.story.role') }}</div>
        </div>
      </div>
      <div class="nw-story__metrics">
        <div
          v-for="(m, i) in (tm('northwind.story.metrics') as Metric[])"
          :key="i"
          class="nw-story__metric"
        >
          <div class="nw-story__metric-value">{{ m.value }}</div>
          <div class="nw-story__metric-label">{{ m.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-story {
  position: relative;
  padding: 120px 24px;
  max-width: 1100px;
  margin: 0 auto;
  z-index: 2;
  overflow: hidden;

  @media (max-width: 768px) { padding: 80px 16px; }
}

.nw-story__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nw-story__glow {
  position: absolute;
  width: 700px;
  height: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, rgba(0, 212, 255, 0.12) 0%, transparent 60%);
  filter: blur(60px);
}

.nw-story__inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

.nw-eyebrow { @include nw-eyebrow; margin-bottom: 24px; }

.nw-story__quote-mark {
  font-size: 120px;
  font-weight: 700;
  color: $nw-accent;
  line-height: 0;
  margin-bottom: 32px;
  opacity: 0.5;
}

.nw-story__quote {
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: $nw-fg;
  max-width: 880px;
  margin: 0 auto 40px;
  text-wrap: balance;
}

.nw-story__author {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 64px;
}

.nw-story__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}

.nw-story__name { font-size: 16px; font-weight: 600; color: $nw-fg; text-align: left; }
.nw-story__role { font-size: 13px; color: $nw-fg-muted; margin-top: 2px; text-align: left; }

.nw-story__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  border-top: 1px solid $nw-border;
  padding-top: 56px;
  max-width: 720px;
  margin: 0 auto;

  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 32px; }
}

.nw-story__metric {
  text-align: center;
}

.nw-story__metric-value {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(180deg, $nw-accent-bright 0%, $nw-accent 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.nw-story__metric-label {
  font-size: 13px;
  color: $nw-fg-muted;
  font-weight: 500;
}
</style>
