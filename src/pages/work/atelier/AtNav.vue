<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <nav class="at-nav">
    <div class="at-nav__inner">
      <a href="#" class="at-nav__logo">
        <span class="at-nav__logo-mark">◐</span>
        <span class="at-nav__logo-text">ATELIER</span>
      </a>

      <div class="at-nav__links">
        <a href="#work">{{ t('atelier.nav.work') }}</a>
        <a href="#services">{{ t('atelier.nav.services') }}</a>
        <a href="#about">{{ t('atelier.nav.about') }}</a>
        <a href="#contact">{{ t('atelier.nav.contact') }}</a>
      </div>

      <div class="at-nav__status">
        <span class="at-nav__status-dot"></span>
        {{ t('atelier.navStatus') }}
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 28px 40px;
  mix-blend-mode: difference;

  @media (max-width: 768px) { padding: 20px 20px; }
}

.at-nav__inner {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.at-nav__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: $at-bg;
  flex-shrink: 0;
}

.at-nav__logo-mark {
  font-size: 20px;
  line-height: 1;
}

.at-nav__logo-text {
  @include at-display;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.at-nav__links {
  display: flex;
  gap: 32px;
  @include at-mono;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: lowercase;

  a {
    color: $at-bg;
    text-decoration: none;
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.5; }
  }

  @media (max-width: 768px) { display: none; }
}

.at-nav__status {
  display: flex;
  align-items: center;
  gap: 10px;
  @include at-mono;
  font-size: 11px;
  color: $at-bg;

  @media (max-width: 600px) { display: none; }
}

.at-nav__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $at-accent;
  box-shadow: 0 0 8px $at-accent;
  animation: atPulse 2s ease-in-out infinite;
}

@keyframes atPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
