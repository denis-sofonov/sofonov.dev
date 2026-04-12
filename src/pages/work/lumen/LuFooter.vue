<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="lu-footer">
    <div class="lu-footer__inner">
      <!-- Cinematic logo section -->
      <div class="lu-footer__hero">
        <a href="#" class="lu-footer__logo">
          <span class="lu-footer__logo-l">L</span>
          <span class="lu-footer__logo-rest">UMEN</span>
        </a>
        <div class="lu-footer__tagline">{{ t('lumen.footer.tagline') }}</div>
        <div class="lu-footer__divider"></div>
      </div>

      <!-- Minimal info grid -->
      <div class="lu-footer__info">
        <div class="lu-footer__info-item">
          <span class="lu-footer__label">VISIT</span>
          <span>147 Wythe Avenue, Brooklyn NY 11211</span>
        </div>
        <div class="lu-footer__info-item">
          <span class="lu-footer__label">HOURS</span>
          <span>Tue — Sat · 5:00 PM — Late</span>
        </div>
        <div class="lu-footer__info-item">
          <span class="lu-footer__label">CONTACT</span>
          <span>+1 (347) 555-0142</span>
        </div>
        <div class="lu-footer__info-item">
          <span class="lu-footer__label">FOLLOW</span>
          <a href="#">Instagram</a>
        </div>
      </div>

      <div class="lu-footer__bottom">
        <span>© 2026 Lumen Wine Bar. {{ t('lumen.footer.rights') }}</span>
        <span>Built by <router-link to="/" class="lu-footer__author">Denis Sofonov →</router-link></span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-footer {
  background: $lu-bg;
  border-top: 1px solid $lu-border;
  padding: 0 32px 40px;

  @media (max-width: 768px) { padding: 0 20px 32px; }
}

.lu-footer__inner {
  max-width: 1280px;
  margin: 0 auto;
}

// Cinematic logo hero
.lu-footer__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 140px 0 80px;

  @media (max-width: 768px) { padding: 80px 0 56px; }
}

.lu-footer__logo {
  display: flex;
  align-items: baseline;
  text-decoration: none;
  color: $lu-fg;
  margin-bottom: 24px;
}

.lu-footer__logo-l {
  @include lu-display-italic;
  font-size: clamp(80px, 12vw, 160px);
  color: $lu-gold;
  line-height: 0.8;
}

.lu-footer__logo-rest {
  @include lu-display;
  font-size: clamp(56px, 8vw, 120px);
  letter-spacing: 0.15em;
  margin-left: 4px;
}

.lu-footer__tagline {
  @include lu-display-italic;
  font-size: clamp(16px, 2vw, 22px);
  color: $lu-fg-muted;
  margin-bottom: 40px;
}

.lu-footer__divider {
  width: 60px;
  height: 1px;
  background: $lu-gold;
  opacity: 0.5;
}

// Minimal info as horizontal bar
.lu-footer__info {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 0;
  border-top: 1px solid $lu-border-bright;
  border-bottom: 1px solid $lu-border-bright;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
}

.lu-footer__info-item {
  display: flex;
  gap: 12px;
  @include lu-sans;
  font-size: 12px;
  color: $lu-fg-muted;
  align-items: baseline;

  a {
    color: $lu-fg-muted;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: $lu-gold; }
  }
}

.lu-footer__label {
  @include lu-sans;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: $lu-gold;
  flex-shrink: 0;
}

.lu-footer__bottom {
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  @include lu-sans;
  font-size: 11px;
  color: $lu-fg-subtle;
}

.lu-footer__author {
  color: $lu-gold;
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover { color: $lu-fg; }
}
</style>
