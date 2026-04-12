<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal } from './useReveal'
import { photos } from './photos'

gsap.registerPlugin(ScrollTrigger)

interface Item { name: string; desc: string; price: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

const itemPhotos = [photos.burrata, photos.tartare, photos.branzino, photos.cacioPepe]

onMounted(async () => {
  await nextTick()
  reveal('.lu-menu__head > *', { y: 40, stagger: 0.15, duration: 1.8, start: 'top 80%' })
  // Photos: clip-path mask reveal from bottom
  if (root.value) {
    const photos = root.value.querySelectorAll('.lu-menu__photo')
    photos.forEach((photo) => {
      gsap.fromTo(photo,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.6,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: photo,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
    })
  }
  // Content: gentle fade from side
  reveal('.lu-menu__content', { x: 40, y: 0, stagger: 0.2, duration: 1.4, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="menu" class="lu-menu">
    <div class="lu-menu__inner">
      <div class="lu-menu__head">
        <div class="lu-menu__eyebrow">{{ t('lumen.menu.eyebrow') }}</div>
        <h2 class="lu-menu__title">{{ t('lumen.menu.title') }}</h2>
      </div>

      <div class="lu-menu__list">
        <article
          v-for="(item, i) in (tm('lumen.menu.items') as Item[])"
          :key="i"
          class="lu-menu__item"
          :class="{ 'lu-menu__item--reverse': i % 2 === 1 }"
        >
          <div class="lu-menu__photo">
            <img :src="itemPhotos[i]" :alt="item.name" loading="lazy" />
          </div>
          <div class="lu-menu__content">
            <div class="lu-menu__num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="lu-menu__name">{{ item.name }}</h3>
            <p class="lu-menu__desc">{{ item.desc }}</p>
            <div class="lu-menu__divider"></div>
            <div class="lu-menu__price">${{ item.price }}</div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-menu {
  @include lu-section-padding;
  background: $lu-bg-alt;
  border-top: 1px solid $lu-border;
  border-bottom: 1px solid $lu-border;
}

.lu-menu__inner {
  max-width: 1280px;
  margin: 0 auto;
}

.lu-menu__head {
  text-align: center;
  margin-bottom: 120px;

  @media (max-width: 768px) { margin-bottom: 60px; }
}

.lu-menu__eyebrow { @include lu-eyebrow; }

.lu-menu__title {
  @include lu-display;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: $lu-fg;
}

.lu-menu__list {
  display: flex;
  flex-direction: column;
  gap: 120px;

  @media (max-width: 768px) { gap: 64px; }
}

.lu-menu__item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.lu-menu__item--reverse {
  .lu-menu__photo { order: 2; }
  .lu-menu__content { order: 1; }

  @media (max-width: 900px) {
    .lu-menu__photo { order: 1; }
    .lu-menu__content { order: 2; }
  }
}

.lu-menu__photo {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border-radius: 2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.2, 0, 0.2, 1);
    filter: brightness(0.92);
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.lu-menu__content { max-width: 500px; }

.lu-menu__num {
  @include lu-display-italic;
  font-size: 56px;
  color: $lu-gold;
  line-height: 1;
  margin-bottom: 24px;
  opacity: 0.8;
}

.lu-menu__name {
  @include lu-display;
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: $lu-fg;
  margin-bottom: 20px;
}

.lu-menu__desc {
  @include lu-sans;
  font-size: 16px;
  line-height: 1.7;
  color: $lu-fg-muted;
  margin-bottom: 32px;
}

.lu-menu__divider {
  width: 50px;
  height: 1px;
  background: $lu-gold;
  margin-bottom: 24px;
}

.lu-menu__price {
  @include lu-display;
  font-size: 28px;
  color: $lu-fg;
  font-variant-numeric: tabular-nums;
}
</style>
