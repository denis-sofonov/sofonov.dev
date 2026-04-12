<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal } from './useReveal'
import { photos } from './photos'

gsap.registerPlugin(ScrollTrigger)

const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)
const tweens: gsap.core.Tween[] = []

const items = [
  { src: photos.gallery1, span: 'lu-gal__item--tall', alt: '' },
  { src: photos.gallery2, span: '', alt: '' },
  { src: photos.gallery3, span: '', alt: '' },
  { src: photos.gallery4, span: 'lu-gal__item--wide', alt: '' },
  { src: photos.gallery5, span: '', alt: '' },
]

onMounted(async () => {
  await nextTick()
  reveal('.lu-gal__item', { y: 50, stagger: 0.12, duration: 1.4, start: 'top 85%' })

  // Parallax — each photo scrolls at different speed
  if (root.value) {
    const imgs = root.value.querySelectorAll('.lu-gal__item img')
    imgs.forEach((img, i) => {
      const speed = [30, -20, 15, -25, 20][i] || 0
      tweens.push(
        gsap.to(img, {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }),
      )
    })
  }
})

onUnmounted(() => {
  tweens.forEach(t => t.kill())
})
</script>

<template>
  <section ref="root" class="lu-gal">
    <div class="lu-gal__grid">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="lu-gal__item"
        :class="item.span"
      >
        <img :src="item.src" :alt="item.alt" loading="lazy" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-gal {
  padding: 0;
  background: $lu-bg;
}

.lu-gal__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 280px;
  gap: 4px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 220px;
  }
}

.lu-gal__item {
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.85) saturate(1.05);
    transition: transform 1.2s cubic-bezier(0.2, 0, 0.2, 1), filter 0.6s ease;
  }

  &:hover img {
    transform: scale(1.08);
    filter: brightness(1) saturate(1.1);
  }
}

.lu-gal__item--tall {
  grid-row: span 2;

  @media (max-width: 900px) { grid-row: span 1; }
}

.lu-gal__item--wide {
  grid-column: span 2;

  @media (max-width: 900px) { grid-column: span 1; }
}
</style>
