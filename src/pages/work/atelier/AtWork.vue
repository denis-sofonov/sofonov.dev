<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useReveal } from './useReveal'
import { projectPhotos } from './photos'

interface Item { name: string; tag: string; year: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const previewEl = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

const hoveredIdx = ref<number | null>(null)
let mouseX = 0
let mouseY = 0
let previewX = 0
let previewY = 0
let raf = 0

function onRowEnter(i: number) {
  hoveredIdx.value = i
  if (previewEl.value) {
    gsap.to(previewEl.value, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
  }
}

function onRowLeave() {
  hoveredIdx.value = null
  if (previewEl.value) {
    gsap.to(previewEl.value, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.out' })
  }
}

function onMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function tick() {
  previewX += (mouseX - previewX) * 0.18
  previewY += (mouseY - previewY) * 0.18
  if (previewEl.value) {
    previewEl.value.style.left = `${previewX}px`
    previewEl.value.style.top = `${previewY}px`
  }
  raf = requestAnimationFrame(tick)
}

onMounted(async () => {
  await nextTick()
  reveal('.at-work__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.at-work__row', { y: 40, stagger: 0.05, duration: 0.9, start: 'top 80%' })
  document.addEventListener('mousemove', onMove)
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section ref="root" id="work" class="at-work">
    <div class="at-work__inner">
      <div class="at-work__head">
        <div class="at-work__eyebrow">{{ t('atelier.work.eyebrow') }}</div>
        <h2 class="at-work__title">{{ t('atelier.work.title') }}</h2>
      </div>

      <div class="at-work__list">
        <div
          v-for="(item, i) in (tm('atelier.work.items') as Item[])"
          :key="i"
          class="at-work__row"
          :class="{ 'at-work__row--dim': hoveredIdx !== null && hoveredIdx !== i }"
          @mouseenter="onRowEnter(i)"
          @mouseleave="onRowLeave"
        >
          <div class="at-work__row-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="at-work__row-name">
            {{ item.name }}
            <span class="at-work__row-arrow">→</span>
          </div>
          <div class="at-work__row-tag">{{ item.tag }}</div>
          <div class="at-work__row-year">{{ item.year }}</div>
        </div>
      </div>
    </div>

    <!-- Floating preview that follows cursor -->
    <div ref="previewEl" class="at-work__preview" aria-hidden="true">
      <div
        v-for="(item, i) in (tm('atelier.work.items') as Item[])"
        :key="i"
        class="at-work__preview-img"
        :class="{ 'at-work__preview-img--active': hoveredIdx === i }"
        :style="{ backgroundImage: `url(${projectPhotos[i]})` }"
      ></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-work {
  @include at-section-padding;
  background: $at-bg;
  border-top: 1px solid $at-fg;
  position: relative;
}

.at-work__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.at-work__head {
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

.at-work__eyebrow {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  padding-top: 12px;
}

.at-work__title {
  @include at-display;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 500;
  color: $at-fg;
}

.at-work__list {
  display: flex;
  flex-direction: column;
}

.at-work__row {
  display: grid;
  grid-template-columns: 60px 1fr 200px 80px;
  gap: 32px;
  align-items: center;
  padding: 28px 0;
  border-top: 1px solid $at-border-bright;
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child { border-bottom: 1px solid $at-border-bright; }

  &:hover {
    .at-work__row-name { transform: translateX(24px); }
    .at-work__row-arrow { opacity: 1; transform: translateX(8px); }
  }

  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 60px;

    .at-work__row-tag { display: none; }
  }
}

.at-work__row--dim {
  opacity: 0.3;
}

.at-work__row-num {
  @include at-mono;
  font-size: 12px;
  color: $at-fg-muted;
}

.at-work__row-name {
  @include at-display;
  font-size: clamp(32px, 4.5vw, 64px);
  line-height: 1;
  font-weight: 500;
  color: $at-fg;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
}

.at-work__row-arrow {
  display: inline-block;
  margin-left: 16px;
  opacity: 0;
  transition: all 0.4s ease;
}

.at-work__row-tag {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.at-work__row-year {
  @include at-mono;
  font-size: 12px;
  color: $at-fg-muted;
  text-align: right;
}

// Preview that follows cursor
.at-work__preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 400px;
  pointer-events: none;
  z-index: 50;
  transform: translate(-50%, -50%);
  opacity: 0;

  @media (max-width: 900px) { display: none; }
}

.at-work__preview-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: saturate(1.1) contrast(1.05);
}

.at-work__preview-img--active {
  opacity: 1;
}
</style>
