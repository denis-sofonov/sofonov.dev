<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { photos } from './photos'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const tweens: gsap.core.Tween[] = []
const timelines: gsap.core.Timeline[] = []

onMounted(async () => {
  await nextTick()
  if (!root.value) return

  const $ = (s: string) => root.value!.querySelectorAll(s)

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  timelines.push(tl)

  tl
    .fromTo($('.fo-hero__photo img'),
      { y: 60, opacity: 0, scale: 1.05 },
      { y: 0, opacity: 1, scale: 1, duration: 1.6 })
    .fromTo($('.fo-hero__eyebrow'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }, '-=1.2')
    .fromTo($('.fo-hero__title'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }, '-=0.7')
    .fromTo($('.fo-hero__sub'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }, '-=0.9')
    .fromTo($('.fo-hero__price-block, .fo-hero__buttons, .fo-hero__shipping, .fo-hero__features'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, '-=0.7')

  // Slow product photo float
  tweens.push(
    gsap.to($('.fo-hero__photo img'), {
      y: -20,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.6,
    }),
  )

  // Subtle parallax on scroll
  tweens.push(
    gsap.to($('.fo-hero__photo'), {
      y: 60,
      rotateY: 8,
      scale: 0.95,
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    }),
  )
})

onUnmounted(() => {
  tweens.forEach((t) => t.kill())
  timelines.forEach((t) => t.kill())
  if (root.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger && root.value!.contains(st.trigger as Node)) st.kill()
    })
  }
})
</script>

<template>
  <section ref="root" class="fo-hero">
    <div class="fo-hero__inner">
      <div class="fo-hero__photo">
        <img :src="photos.hero" alt="Forma One headphones" />
        <div class="fo-hero__photo-tag">
          <span class="fo-hero__photo-tag-mark">●</span>
          MIDNIGHT
        </div>
      </div>

      <div class="fo-hero__content">
        <div class="fo-hero__eyebrow">{{ t('forma.hero.eyebrow') }}</div>

        <h1 class="fo-hero__title">{{ t('forma.hero.title') }}</h1>

        <p class="fo-hero__sub">{{ t('forma.hero.sub') }}</p>

        <div class="fo-hero__price-block">
          <div class="fo-hero__price">{{ t('forma.hero.price') }}</div>
          <div class="fo-hero__price-label">{{ t('forma.hero.priceLabel') }}</div>
        </div>

        <div class="fo-hero__buttons">
          <a href="#" class="fo-btn fo-btn--primary">
            {{ t('forma.hero.cta') }}
            <span>→</span>
          </a>
          <a href="#" class="fo-btn fo-btn--ghost">
            {{ t('forma.hero.secondary') }}
          </a>
        </div>

        <div class="fo-hero__shipping">
          <span class="fo-hero__shipping-icon">⊘</span>
          {{ t('forma.hero.shipping') }}
        </div>

        <div class="fo-hero__features">
          <div class="fo-hero__feature">
            <div class="fo-hero__feature-num">40h</div>
            <div class="fo-hero__feature-label">Battery</div>
          </div>
          <div class="fo-hero__feature">
            <div class="fo-hero__feature-num">−32 dB</div>
            <div class="fo-hero__feature-label">Noise cancel</div>
          </div>
          <div class="fo-hero__feature">
            <div class="fo-hero__feature-num">264 g</div>
            <div class="fo-hero__feature-label">Weight</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-hero {
  position: relative;
  padding: 140px 40px 80px;
  min-height: 100vh;
  display: flex;
  align-items: center;

  @media (max-width: 900px) { padding: 100px 24px 60px; }
}

.fo-hero__inner {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

.fo-hero__photo {
  position: relative;
  aspect-ratio: 1;
  background: $fo-bg-elevated;
  border-radius: 4px;
  overflow: hidden;
  perspective: 1000px;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    mix-blend-mode: multiply;
    filter: contrast(1.05);
  }
}

.fo-hero__photo-tag {
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $fo-fg;
  background: rgba(250, 250, 246, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px 14px;
  border-radius: 100px;
  border: 1px solid $fo-border;
}

.fo-hero__photo-tag-mark {
  color: #1a1a1d;
  font-size: 10px;
}

.fo-hero__content {
  max-width: 520px;
}

.fo-hero__eyebrow {
  display: inline-block;
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $fo-accent;
  background: rgba(184, 89, 58, 0.08);
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 32px;
}

.fo-hero__title {
  @include fo-display;
  font-size: clamp(40px, 5.5vw, 80px);
  line-height: 1;
  letter-spacing: -0.04em;
  color: $fo-fg;
  margin-bottom: 28px;
  font-weight: 500;
  text-wrap: balance;
}

.fo-hero__sub {
  @include fo-sans;
  font-size: clamp(15px, 1.3vw, 18px);
  line-height: 1.6;
  color: $fo-fg-muted;
  margin-bottom: 40px;
}

.fo-hero__price-block {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid $fo-border;
}

.fo-hero__price {
  @include fo-display;
  font-size: 44px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: $fo-fg;
}

.fo-hero__price-label {
  @include fo-sans;
  font-size: 13px;
  color: $fo-fg-muted;
}

.fo-hero__buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.fo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  @include fo-sans;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  padding: 16px 28px;
  border-radius: 100px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;

  span { transition: transform 0.2s ease; }
  &:hover span { transform: translateX(4px); }
}

.fo-btn--primary {
  background: $fo-fg;
  color: $fo-bg;

  &:hover { background: $fo-accent; }
}

.fo-btn--ghost {
  background: transparent;
  color: $fo-fg;
  border-color: $fo-border-bright;

  &:hover { border-color: $fo-fg; }
}

.fo-hero__shipping {
  display: flex;
  align-items: center;
  gap: 8px;
  @include fo-sans;
  font-size: 12px;
  color: $fo-fg-muted;
  margin-bottom: 48px;
}

.fo-hero__shipping-icon {
  color: $fo-success;
  font-weight: 600;
}

.fo-hero__features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid $fo-border;
}

.fo-hero__feature {}

.fo-hero__feature-num {
  @include fo-display;
  font-size: 24px;
  font-weight: 600;
  color: $fo-fg;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
}

.fo-hero__feature-label {
  @include fo-mono;
  font-size: 10px;
  font-weight: 500;
  color: $fo-fg-muted;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
