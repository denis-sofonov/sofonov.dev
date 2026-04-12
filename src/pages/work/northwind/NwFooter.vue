<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const email = ref('')
</script>

<template>
  <footer class="nw-footer">
    <!-- Newsletter -->
    <div class="nw-footer__newsletter">
      <div class="nw-footer__newsletter-text">
        <h3 class="nw-footer__newsletter-title">{{ t('northwind.newsletter.title') }}</h3>
        <p class="nw-footer__newsletter-desc">{{ t('northwind.newsletter.desc') }}</p>
      </div>
      <form class="nw-footer__newsletter-form" @submit.prevent>
        <input
          v-model="email"
          type="email"
          placeholder="you@company.com"
          class="nw-footer__newsletter-input"
        />
        <button type="submit" class="nw-footer__newsletter-btn">
          {{ t('northwind.newsletter.button') }}
          <span>→</span>
        </button>
      </form>
    </div>

    <div class="nw-footer__top">
      <div class="nw-footer__brand">
        <a href="#" class="nw-footer__logo">
          <svg viewBox="0 0 24 24" class="nw-footer__logo-mark">
            <path d="M4 4 L12 20 L20 4 L12 12 Z" fill="currentColor" />
          </svg>
          <span>Northwind</span>
        </a>
        <p class="nw-footer__tagline">Analytics built for product teams, not data teams.</p>
        <div class="nw-footer__socials">
          <a href="#">𝕏</a>
          <a href="#">GH</a>
          <a href="#">in</a>
        </div>
      </div>
      <div class="nw-footer__cols">
        <div class="nw-footer__col">
          <div class="nw-footer__title">Product</div>
          <a href="#">Features</a><a href="#">Pricing</a><a href="#">Changelog</a><a href="#">Roadmap</a>
        </div>
        <div class="nw-footer__col">
          <div class="nw-footer__title">Company</div>
          <a href="#">About</a><a href="#">Blog</a><a href="#">Careers</a><a href="#">Contact</a>
        </div>
        <div class="nw-footer__col">
          <div class="nw-footer__title">Resources</div>
          <a href="#">Docs</a><a href="#">API</a><a href="#">Status</a><a href="#">Community</a>
        </div>
        <div class="nw-footer__col">
          <div class="nw-footer__title">Legal</div>
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a><a href="#">DPA</a>
        </div>
      </div>
    </div>
    <div class="nw-footer__bottom">
      <span>© 2026 Northwind, Inc. All rights reserved.</span>
      <span>Built by <router-link to="/" class="nw-footer__author">Denis Sofonov →</router-link></span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-footer {
  padding: 80px 24px 40px;
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.nw-footer__newsletter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 56px 48px;
  background: linear-gradient(135deg, rgba(0,212,255,0.06), transparent);
  border: 1px solid $nw-border-bright;
  border-radius: 16px;
  margin-bottom: 64px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 200px;
    top: -100px;
    right: -100px;
    background: radial-gradient(ellipse, rgba(0,212,255,0.2), transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    padding: 36px 24px;
    gap: 24px;
  }
}

.nw-footer__newsletter-text { position: relative; z-index: 1; }

.nw-footer__newsletter-title {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 12px;
  color: $nw-fg;
}

.nw-footer__newsletter-desc {
  font-size: 14px;
  color: $nw-fg-muted;
  line-height: 1.5;
}

.nw-footer__newsletter-form {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.nw-footer__newsletter-input {
  flex: 1;
  background: rgba(0,0,0,0.4);
  border: 1px solid $nw-border-bright;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 14px;
  color: $nw-fg;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder { color: $nw-fg-subtle; }

  &:focus { border-color: $nw-accent; }
}

.nw-footer__newsletter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, $nw-accent, $nw-accent-bright);
  color: #050507;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0,212,255,0.25);

  &:hover {
    box-shadow: 0 8px 24px rgba(0,212,255,0.4);
    transform: translateY(-1px);
  }

  span { transition: transform 0.2s ease; }
  &:hover span { transform: translateX(3px); }
}

.nw-footer__top {
  display: grid;
  grid-template-columns: 1fr 2.2fr;
  gap: 80px;
  padding-bottom: 56px;
  border-bottom: 1px solid $nw-border;

  @media (max-width: 800px) { grid-template-columns: 1fr; gap: 48px; }
}

.nw-footer__brand { max-width: 320px; }

.nw-footer__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: $nw-fg;
  text-decoration: none;
}

.nw-footer__logo-mark {
  width: 22px;
  height: 22px;
  color: $nw-accent;
}

.nw-footer__tagline {
  margin-top: 16px;
  font-size: 14px;
  color: $nw-fg-muted;
  line-height: 1.5;
}

.nw-footer__socials {
  display: flex;
  gap: 8px;
  margin-top: 24px;

  a {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid $nw-border;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: $nw-fg-muted;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      border-color: $nw-accent;
      color: $nw-accent-bright;
    }
  }
}

.nw-footer__cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;

  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
}

.nw-footer__col {
  display: flex;
  flex-direction: column;
  gap: 12px;

  a {
    font-size: 14px;
    color: $nw-fg-muted;
    text-decoration: none;
    transition: color 0.15s ease;
    &:hover { color: $nw-fg; }
  }
}

.nw-footer__title {
  font-size: 13px;
  font-weight: 600;
  color: $nw-fg;
  margin-bottom: 4px;
}

.nw-footer__bottom {
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: $nw-fg-muted;
  flex-wrap: wrap;
  gap: 12px;
}

.nw-footer__author {
  color: $nw-accent-bright;
  text-decoration: none;
  transition: color 0.15s ease;
  &:hover { color: $nw-fg; }
}
</style>
