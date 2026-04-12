<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const scrolled = ref(false)
const cartCount = ref(0)

function handleScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="fo-nav" :class="{ 'fo-nav--scrolled': scrolled }">
    <div class="fo-nav__inner">
      <a href="#" class="fo-nav__logo">
        <span class="fo-nav__logo-mark">◉</span>
        FORMA
      </a>

      <div class="fo-nav__links">
        <a href="#story">{{ t('forma.nav.product') }}</a>
        <a href="#story">{{ t('forma.nav.story') }}</a>
        <a href="#specs">{{ t('forma.nav.specs') }}</a>
        <a href="#">{{ t('forma.nav.support') }}</a>
      </div>

      <div class="fo-nav__right">
        <button class="fo-nav__cart">
          <span class="fo-nav__cart-icon">⊙</span>
          {{ t('forma.nav.cart') }}
          <span class="fo-nav__cart-count">{{ cartCount }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(250, 250, 246, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.fo-nav--scrolled {
  border-bottom-color: $fo-border;
  background: rgba(250, 250, 246, 0.95);
}

.fo-nav__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 40px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) { padding: 16px 20px; }
}

.fo-nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  @include fo-display;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: $fo-fg;
  text-decoration: none;
  justify-self: start;
}

.fo-nav__logo-mark {
  color: $fo-accent;
  font-size: 16px;
}

.fo-nav__links {
  display: flex;
  gap: 36px;
  @include fo-sans;
  font-size: 14px;
  font-weight: 500;
  justify-self: center;

  a {
    color: $fo-fg;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: $fo-accent; }
  }

  @media (max-width: 900px) { display: none; }
}

.fo-nav__right {
  justify-self: end;
}

.fo-nav__cart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  @include fo-sans;
  font-size: 14px;
  font-weight: 500;
  color: $fo-fg;
  background: none;
  border: 1px solid $fo-border-bright;
  border-radius: 100px;
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $fo-fg;
    background: $fo-fg;
    color: $fo-bg;
  }
}

.fo-nav__cart-icon { font-size: 14px; }

.fo-nav__cart-count {
  background: $fo-accent;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
</style>
