<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal, tween } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.nw-cta__inner > *', { y: 40, stagger: 0.15, duration: 1, start: 'top 80%' })
  tween('.nw-cta__glow',
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out' })
})
</script>

<template>
  <section ref="root" class="nw-cta">
    <div class="nw-cta__bg">
      <div class="nw-cta__glow"></div>
      <div class="nw-cta__grid"></div>
    </div>
    <div class="nw-cta__inner">
      <div class="nw-eyebrow">{{ t('northwind.cta.eyebrow') }}</div>
      <h2 class="nw-cta__title">{{ t('northwind.cta.title') }}</h2>
      <p class="nw-cta__sub">{{ t('northwind.cta.subtitle') }}</p>
      <div class="nw-cta__buttons">
        <a href="#" class="nw-btn nw-btn--primary">
          {{ t('northwind.cta.button') }}
          <span>→</span>
        </a>
        <a href="#" class="nw-btn nw-btn--ghost">
          {{ t('northwind.cta.secondary') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-cta {
  position: relative;
  padding: 160px 24px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid $nw-border;
  border-bottom: 1px solid $nw-border;
  z-index: 2;

  @media (max-width: 768px) { padding: 100px 16px; }
}

.nw-eyebrow { @include nw-eyebrow; }

.nw-cta__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nw-cta__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
}

.nw-cta__glow {
  position: absolute;
  width: 900px;
  height: 500px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, $nw-accent-glow 0%, transparent 60%);
  filter: blur(60px);
}

.nw-cta__inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
}

.nw-cta__title {
  font-size: clamp(44px, 7vw, 88px);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 24px 0 22px;
  @include nw-gradient-text;
}

.nw-cta__sub {
  font-size: 19px;
  color: $nw-fg-muted;
  line-height: 1.5;
  margin-bottom: 40px;
}

.nw-cta__buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.nw-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid transparent;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  span { transition: transform 0.2s ease; }
  &:hover span { transform: translateX(4px); }
}

.nw-btn--primary {
  background: linear-gradient(180deg, #ffffff 0%, #d8d8e0 100%);
  color: #050507;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.6),
    0 0 0 1px rgba(255,255,255,0.1),
    0 8px 24px rgba(0,212,255,0.15);

  &:hover {
    background: linear-gradient(180deg, $nw-accent-bright 0%, $nw-accent 100%);
    color: #050507;
    box-shadow:
      0 0 0 1px rgba(0,212,255,0.4),
      0 12px 40px $nw-accent-glow;
  }
}

.nw-btn--ghost {
  background: rgba(255,255,255,0.04);
  color: $nw-fg;
  border-color: $nw-border-bright;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: $nw-accent;
  }
}
</style>
