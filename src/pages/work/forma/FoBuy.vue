<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal } from './useReveal'
import { photos } from './photos'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)
const displayPrice = ref('$0')

onMounted(async () => {
  await nextTick()
  reveal('.fo-buy__inner > *', { y: 40, stagger: 0.12, duration: 1.2, start: 'top 80%' })

  // Animated price counter
  if (root.value) {
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const obj = { v: 0 }
        gsap.to(obj, {
          v: 549,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { displayPrice.value = '$' + Math.floor(obj.v) },
        })
      },
    })
  }
})

onUnmounted(() => {
  if (root.value) {
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger && root.value!.contains(st.trigger as Node)) st.kill()
    })
  }
})
</script>

<template>
  <section ref="root" class="fo-buy">
    <div class="fo-buy__bg">
      <img :src="photos.buy" alt="" />
      <div class="fo-buy__overlay"></div>
    </div>

    <div class="fo-buy__inner">
      <div class="fo-buy__eyebrow">{{ t('forma.buy.eyebrow') }}</div>
      <h2 class="fo-buy__title">{{ t('forma.buy.title') }}</h2>
      <p class="fo-buy__sub">{{ t('forma.buy.sub') }}</p>

      <div class="fo-buy__action">
        <div class="fo-buy__price">{{ displayPrice }}</div>
        <a href="#" class="fo-buy__cta">
          {{ t('forma.buy.cta') }}
          <span>→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-buy {
  position: relative;
  padding: 200px 40px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid $fo-border;
  border-bottom: 1px solid $fo-border;

  @media (max-width: 768px) { padding: 100px 24px; }
}

.fo-buy__bg {
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.85);
  }
}

.fo-buy__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.7) 100%);
}

.fo-buy__inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.fo-buy__eyebrow {
  display: inline-block;
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(250, 250, 246, 0.7);
  background: rgba(250, 250, 246, 0.08);
  border: 1px solid rgba(250, 250, 246, 0.15);
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 32px;
}

.fo-buy__title {
  @include fo-display;
  font-size: clamp(48px, 7vw, 100px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: $fo-bg;
  margin-bottom: 32px;
  font-weight: 500;
  text-wrap: balance;
}

.fo-buy__sub {
  @include fo-sans;
  font-size: 17px;
  line-height: 1.6;
  color: rgba(250, 250, 246, 0.75);
  max-width: 540px;
  margin: 0 auto 56px;
}

.fo-buy__action {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  background: rgba(250, 250, 246, 0.06);
  border: 1px solid rgba(250, 250, 246, 0.15);
  border-radius: 100px;
  padding: 12px 12px 12px 32px;
  backdrop-filter: blur(20px);

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 24px;
    border-radius: 24px;
  }
}

.fo-buy__price {
  @include fo-display;
  font-size: 32px;
  font-weight: 600;
  color: $fo-bg;
  letter-spacing: -0.02em;
}

.fo-buy__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  @include fo-sans;
  font-size: 15px;
  font-weight: 600;
  color: $fo-fg;
  background: $fo-bg;
  padding: 18px 32px;
  border-radius: 100px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: $fo-accent;
    color: $fo-bg;
  }

  span { transition: transform 0.2s ease; }
  &:hover span { transform: translateX(4px); }
}
</style>
