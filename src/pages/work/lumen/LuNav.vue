<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="lu-nav" :class="{ 'lu-nav--scrolled': scrolled }">
    <div class="lu-nav__inner">
      <div class="lu-nav__links lu-nav__links--left">
        <a href="#story">{{ t('lumen.nav.story') }}</a>
        <a href="#wine">{{ t('lumen.nav.wine') }}</a>
        <a href="#menu">{{ t('lumen.nav.menu') }}</a>
      </div>
      <a href="#" class="lu-nav__logo">
        <span class="lu-nav__logo-mark">L</span>
        <span class="lu-nav__logo-text">UMEN</span>
      </a>
      <div class="lu-nav__links lu-nav__links--right">
        <a href="#events">{{ t('lumen.nav.events') }}</a>
        <a href="#visit">{{ t('lumen.nav.visit') }}</a>
        <a href="#" class="lu-nav__reserve">{{ t('lumen.nav.reserve') }}</a>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24px 40px;
  transition: all 0.4s ease;

  @media (max-width: 768px) { padding: 16px 20px; }
}

.lu-nav--scrolled {
  background: rgba(14, 10, 8, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid $lu-border;
  padding: 16px 40px;

  @media (max-width: 768px) { padding: 12px 20px; }
}

.lu-nav__inner {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 32px;
}

.lu-nav__links {
  display: flex;
  gap: 32px;
  @include lu-sans;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  a {
    color: $lu-fg;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: $lu-gold; }
  }

  @media (max-width: 900px) { display: none; }
}

.lu-nav__links--right {
  justify-content: flex-end;
}

.lu-nav__logo {
  display: flex;
  align-items: baseline;
  text-decoration: none;
  color: $lu-fg;
  justify-self: center;
}

.lu-nav__logo-mark {
  @include lu-display-italic;
  font-size: 32px;
  color: $lu-gold;
  line-height: 1;

  .lu-nav--scrolled & { font-size: 26px; }
}

.lu-nav__logo-text {
  @include lu-display;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.18em;
  margin-left: 2px;

  .lu-nav--scrolled & { font-size: 18px; }
}

.lu-nav__reserve {
  border: 1px solid $lu-fg !important;
  padding: 8px 16px;
  letter-spacing: 0.15em;

  &:hover {
    background: $lu-fg;
    color: $lu-bg !important;
  }
}
</style>
