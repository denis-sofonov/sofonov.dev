<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="at-foot">
    <div class="at-foot__inner">
      <div class="at-foot__top">
        <div class="at-foot__logo">
          <span class="at-foot__logo-mark">◐</span>
          <span class="at-foot__logo-text">ATELIER</span>
        </div>
        <div class="at-foot__location">
          <div class="at-foot__label">STUDIO</div>
          <div>{{ t('atelier.footer.location') }}</div>
        </div>
        <div class="at-foot__contact">
          <div class="at-foot__label">CONTACT</div>
          <div>hello@atelier.studio</div>
          <div>+1 (646) 555-0119</div>
        </div>
        <div class="at-foot__social">
          <div class="at-foot__label">FOLLOW</div>
          <a href="#">Instagram</a>
          <a href="#">Are.na</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>

      <div class="at-foot__bottom">
        <span>© 2026 Atelier Studio. {{ t('atelier.footer.rights') }}</span>
        <span>Built by <router-link to="/" class="at-foot__author">Denis Sofonov →</router-link></span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-foot {
  background: $at-fg;
  color: $at-bg;
  padding: 80px 40px 40px;
  border-top: 1px solid $at-fg-muted;

  @media (max-width: 768px) { padding: 60px 20px 32px; }
}

.at-foot__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.at-foot__top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 64px;
  border-bottom: 1px solid $at-fg-subtle;
  margin-bottom: 32px;

  @media (max-width: 800px) { grid-template-columns: 1fr 1fr; gap: 32px; }
}

.at-foot__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.at-foot__logo-mark {
  font-size: 32px;
  color: $at-accent;
}

.at-foot__logo-text {
  @include at-display;
  font-size: 24px;
  font-weight: 600;
}

.at-foot__label {
  @include at-mono;
  font-size: 10px;
  color: $at-fg-subtle;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}

.at-foot__location,
.at-foot__contact,
.at-foot__social {
  @include at-mono;
  font-size: 13px;
  line-height: 1.7;
  color: $at-bg;

  a {
    display: block;
    color: $at-bg;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: $at-accent; }
  }
}

.at-foot__bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  @include at-mono;
  font-size: 11px;
  color: $at-fg-subtle;
}

.at-foot__author {
  color: $at-accent;
  text-decoration: none;
  &:hover { color: $at-bg; }
}
</style>
