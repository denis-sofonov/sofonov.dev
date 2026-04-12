<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <nav class="nw-nav">
    <div class="nw-nav__inner">
      <a href="#" class="nw-nav__logo">
        <svg viewBox="0 0 24 24" class="nw-nav__logo-mark">
          <path d="M4 4 L12 20 L20 4 L12 12 Z" fill="currentColor" />
        </svg>
        <span>Northwind</span>
      </a>
      <div class="nw-nav__links">
        <a href="#bento">{{ t('northwind.nav.features') }}</a>
        <a href="#code">Developers</a>
        <a href="#pricing">{{ t('northwind.nav.pricing') }}</a>
        <a href="#">Customers</a>
        <a href="#">{{ t('northwind.nav.docs') }}</a>
      </div>
      <div class="nw-nav__cta">
        <a href="#" class="nw-nav__signin">{{ t('northwind.nav.signin') }}</a>
        <a href="#" class="nw-btn-sm">{{ t('northwind.nav.signup') }} <span>→</span></a>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px) saturate(180%);
  background: rgba(5, 5, 7, 0.75);
  border-bottom: 1px solid $nw-border;
}

.nw-nav__inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.nw-nav__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  flex-shrink: 0;
  color: $nw-fg;
  text-decoration: none;
}

.nw-nav__logo-mark {
  width: 22px;
  height: 22px;
  color: $nw-accent;
}

.nw-nav__links {
  display: flex;
  gap: 32px;
  font-size: 14px;
  font-weight: 500;
  color: $nw-fg-muted;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
    &:hover { color: $nw-fg; }
  }

  @media (max-width: 900px) { display: none; }
}

.nw-nav__cta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.nw-nav__signin {
  font-size: 14px;
  font-weight: 500;
  color: $nw-fg-muted;
  text-decoration: none;
  transition: color 0.15s ease;
  &:hover { color: $nw-fg; }
  @media (max-width: 480px) { display: none; }
}

.nw-btn-sm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, $nw-accent 0%, $nw-accent-bright 100%);
  color: #050507;
  border-radius: 100px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.3),
    0 0 0 1px rgba(0,212,255,0.4),
    0 4px 16px rgba(0,212,255,0.25);

  &:hover {
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.4),
      0 0 0 1px rgba(0,212,255,0.6),
      0 8px 24px rgba(0,212,255,0.4);
    transform: translateY(-1px);
  }

  span { transition: transform 0.2s ease; }
  &:hover span { transform: translateX(3px); }
}
</style>
