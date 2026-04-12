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

  // Slow ken-burns zoom on hero photo
  tweens.push(
    gsap.to($('.lu-hero__img'), {
      scale: 1.08,
      duration: 18,
      ease: 'none',
      yoyo: true,
      repeat: -1,
    }),
  )

  // Hero entrance — slow elegant fade-up
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  timelines.push(tl)

  tl
    .fromTo($('.lu-hero__eyebrow'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3 })
    .fromTo($('.lu-hero__title-line'),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, stagger: 0.15 }, '-=0.8')
    .fromTo($('.lu-hero__divider'),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, '-=0.6')
    .fromTo($('.lu-hero__sub'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }, '-=0.8')
    .fromTo($('.lu-hero__cta'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }, '-=0.6')
    .fromTo($('.lu-hero__scroll'),
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }, '-=0.4')

  // Parallax: photo moves slower than scroll
  tweens.push(
    gsap.to($('.lu-hero__photo'), {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
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
  <section ref="root" class="lu-hero">
    <div class="lu-hero__photo">
      <img :src="photos.hero" alt="" class="lu-hero__img" loading="eager" />
      <div class="lu-hero__overlay"></div>
    </div>

    <div class="lu-hero__inner">
      <div class="lu-hero__eyebrow">{{ t('lumen.hero.eyebrow') }}</div>

      <h1 class="lu-hero__title">
        <span class="lu-hero__title-line">Natural wines.</span>
        <span class="lu-hero__title-line lu-hero__title-line--italic">Honest food.</span>
      </h1>

      <div class="lu-hero__divider"></div>

      <p class="lu-hero__sub">{{ t('lumen.hero.subtitle') }}</p>

      <a href="#" class="lu-hero__cta">
        {{ t('lumen.hero.reserve') }}
        <span class="lu-hero__cta-arrow">→</span>
      </a>
    </div>

    <div class="lu-hero__scroll">
      <span class="lu-hero__scroll-line"></span>
      <span class="lu-hero__scroll-text">{{ t('lumen.hero.scroll') }}</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.lu-hero__photo {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.lu-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.lu-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(14,10,8,0.6) 0%, rgba(14,10,8,0.35) 50%, rgba(14,10,8,0.95) 100%),
    radial-gradient(ellipse at center, rgba(14,10,8,0.15), rgba(14,10,8,0.55));

  // Animated warm light sweep — cinematic feel
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 30% 50%, rgba(212, 169, 96, 0.08), transparent),
      radial-gradient(ellipse 50% 50% at 70% 40%, rgba(200, 71, 45, 0.06), transparent);
    animation: luHeroGlow 12s ease-in-out infinite alternate;
  }

  // Subtle grain overlay for film texture
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.06;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    animation: luHeroGrain 0.15s steps(3) infinite;
  }
}

@keyframes luHeroGlow {
  0% { opacity: 0.6; transform: translate(0, 0); }
  100% { opacity: 1; transform: translate(15px, -10px); }
}

@keyframes luHeroGrain {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-1px, 1px); }
  66% { transform: translate(1px, -1px); }
  100% { transform: translate(0, 0); }
}

.lu-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 900px;
  padding: 0 24px;
}

.lu-hero__eyebrow {
  @include lu-eyebrow;
  color: $lu-gold;
  margin-bottom: 32px;
  opacity: 0; // hidden until GSAP

  &::before { content: '— '; opacity: 0.6; }
  &::after { content: ' —'; opacity: 0.6; }
}

.lu-hero__title {
  @include lu-display;
  font-size: clamp(56px, 9vw, 130px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: $lu-fg;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lu-hero__title-line {
  display: block;
  overflow: visible;
  opacity: 0; // hidden until GSAP
}

.lu-hero__title-line--italic {
  @include lu-display-italic;
  color: $lu-gold;
}

.lu-hero__divider {
  width: 80px;
  height: 1px;
  background: $lu-gold;
  margin: 0 auto 36px;
  transform-origin: center;
  transform: scaleX(0); // hidden until GSAP
}

.lu-hero__sub {
  @include lu-sans;
  font-size: clamp(15px, 1.3vw, 18px);
  line-height: 1.7;
  color: $lu-fg-muted;
  max-width: 580px;
  margin: 0 auto 48px;
  font-weight: 400;
  opacity: 0;
}

.lu-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  @include lu-sans;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $lu-fg;
  text-decoration: none;
  padding: 18px 40px;
  border: 1px solid $lu-fg;
  transition: all 0.3s ease;
  opacity: 0;

  &:hover {
    background: $lu-fg;
    color: $lu-bg;
  }
}

.lu-hero__cta-arrow {
  transition: transform 0.3s ease;
}

.lu-hero__cta:hover .lu-hero__cta-arrow {
  transform: translateX(4px);
}

.lu-hero__scroll {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
  opacity: 0;
}

.lu-hero__scroll-line {
  width: 1px;
  height: 50px;
  background: linear-gradient(180deg, transparent, $lu-gold);
  animation: luScrollPulse 2s ease-in-out infinite;
}

.lu-hero__scroll-text {
  @include lu-sans;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: $lu-gold;
  writing-mode: vertical-rl;
}

@keyframes luScrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}
</style>
