<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, ref } from 'vue'

const { t } = useI18n()

const visible = ref(false)

let scrollRaf = 0
function onScroll() {
  cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(() => {
    visible.value = window.scrollY > window.innerHeight * 0.55
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(scrollRaf)
})
</script>

<template>
  <a
    href="https://t.me/denis_sofonov"
    target="_blank"
    rel="noopener"
    class="sticky-cta"
    :class="{ 'is-visible': visible }"
  >
    <span class="sticky-cta__label">{{ t('cta.discuss') }}</span>
  </a>
</template>

<style lang="scss" scoped>
.sticky-cta {
  position: fixed;
  left: 50%;
  bottom: 48px;
  z-index: 9997;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 35px;
  padding: 0;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  border-radius: 4px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 24px);
  transition:
    opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
  will-change: transform, opacity;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background: #0a0a0a;
    color: #fff;
  }

  :root[data-theme='dark'] &:hover {
    background: #fff;
    color: var(--accent);
  }

  @media (max-width: 640px) {
    bottom: 32px;
    width: 220px;
    font-size: 12px;
  }
}

.sticky-cta__label {
  position: relative;
}
</style>
