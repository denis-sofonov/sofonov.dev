<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const dotEl = ref<HTMLElement | null>(null)
const ringEl = ref<HTMLElement | null>(null)
const isHovering = ref(false)

let mouseX = 0
let mouseY = 0
let dotX = 0
let dotY = 0
let ringX = 0
let ringY = 0
let raf = 0

function onMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function onMouseEnter(e: Event) {
  const target = e.target as HTMLElement
  if (target.matches('a, button, [data-cursor="hover"]')) {
    isHovering.value = true
  }
}

function onMouseLeave(e: Event) {
  const target = e.target as HTMLElement
  if (target.matches('a, button, [data-cursor="hover"]')) {
    isHovering.value = false
  }
}

function tick() {
  // Dot follows instantly
  dotX += (mouseX - dotX) * 0.7
  dotY += (mouseY - dotY) * 0.7
  // Ring follows with lag
  ringX += (mouseX - ringX) * 0.15
  ringY += (mouseY - ringY) * 0.15

  if (dotEl.value) {
    dotEl.value.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`
  }
  if (ringEl.value) {
    ringEl.value.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseover', onMouseEnter)
  document.addEventListener('mouseout', onMouseLeave)
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseover', onMouseEnter)
  document.removeEventListener('mouseout', onMouseLeave)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="dotEl" class="at-cursor at-cursor__dot"></div>
  <div ref="ringEl" class="at-cursor at-cursor__ring" :class="{ 'at-cursor__ring--hover': isHovering }"></div>
</template>

<style lang="scss" scoped>
.at-cursor {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10000;
  will-change: transform;
}

.at-cursor__dot {
  width: 8px;
  height: 8px;
  background: #0a0a0a;
  border-radius: 50%;
  mix-blend-mode: difference;
  filter: invert(1);
}

.at-cursor__ring {
  width: 36px;
  height: 36px;
  border: 1px solid #0a0a0a;
  border-radius: 50%;
  mix-blend-mode: difference;
  filter: invert(1);
  transition: width 0.3s ease, height 0.3s ease, background 0.3s ease;
}

.at-cursor__ring--hover {
  width: 70px;
  height: 70px;
  background: rgba(212, 255, 0, 0.3);
  border-color: rgba(212, 255, 0, 0.8);
  mix-blend-mode: normal;
  filter: none;
}

// Hide on touch devices
@media (hover: none) {
  .at-cursor { display: none; }
}
</style>
