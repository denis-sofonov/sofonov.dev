<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="fo-foot">
    <div class="fo-foot__inner">
      <div class="fo-foot__top">
        <div class="fo-foot__brand">
          <a href="#" class="fo-foot__logo">
            <span class="fo-foot__logo-mark">◉</span>
            FORMA
          </a>
          <p class="fo-foot__tagline">{{ t('forma.footer.tagline') }}</p>
        </div>

        <div class="fo-foot__cols">
          <div class="fo-foot__col">
            <div class="fo-foot__col-title">{{ t('forma.footer.product') }}</div>
            <a href="#">Forma One</a>
            <a href="#">Forma Studio</a>
            <a href="#">Accessories</a>
            <a href="#">Compare</a>
          </div>
          <div class="fo-foot__col">
            <div class="fo-foot__col-title">{{ t('forma.footer.company') }}</div>
            <a href="#">About</a>
            <a href="#">Stores</a>
            <a href="#">Press</a>
            <a href="#">Sustainability</a>
          </div>
          <div class="fo-foot__col">
            <div class="fo-foot__col-title">{{ t('forma.footer.support') }}</div>
            <a href="#">Help</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Warranty</a>
          </div>
          <div class="fo-foot__col">
            <div class="fo-foot__col-title">{{ t('forma.footer.legal') }}</div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Imprint</a>
          </div>
        </div>
      </div>

      <div class="fo-foot__bottom">
        <span>© 2026 Forma Audio. {{ t('forma.footer.rights') }}</span>
        <span>Built by <router-link to="/" class="fo-foot__author">Denis Sofonov →</router-link></span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-foot {
  background: $fo-bg-alt;
  padding: 80px 40px 40px;

  @media (max-width: 768px) { padding: 60px 24px 32px; }
}

.fo-foot__inner {
  max-width: 1440px;
  margin: 0 auto;
}

.fo-foot__top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
  padding-bottom: 64px;
  border-bottom: 1px solid $fo-border;
  margin-bottom: 32px;

  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 48px; }
}

.fo-foot__brand {
  max-width: 320px;
}

.fo-foot__logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  @include fo-display;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: $fo-fg;
  text-decoration: none;
  margin-bottom: 16px;
}

.fo-foot__logo-mark {
  color: $fo-accent;
  font-size: 18px;
}

.fo-foot__tagline {
  @include fo-sans;
  font-size: 14px;
  line-height: 1.6;
  color: $fo-fg-muted;
}

.fo-foot__cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;

  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
}

.fo-foot__col {
  display: flex;
  flex-direction: column;
  gap: 12px;

  a {
    @include fo-sans;
    font-size: 14px;
    color: $fo-fg-muted;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: $fo-fg; }
  }
}

.fo-foot__col-title {
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: $fo-fg;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.fo-foot__bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 24px;
  @include fo-mono;
  font-size: 11px;
  color: $fo-fg-subtle;
}

.fo-foot__author {
  color: $fo-accent;
  text-decoration: none;
  &:hover { color: $fo-fg; }
}
</style>
