<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AtCursor from './atelier/AtCursor.vue'
import AtNav from './atelier/AtNav.vue'
import AtHero from './atelier/AtHero.vue'
import AtMarquee from './atelier/AtMarquee.vue'
import AtAbout from './atelier/AtAbout.vue'
import AtServices from './atelier/AtServices.vue'
import AtWork from './atelier/AtWork.vue'
import AtProcess from './atelier/AtProcess.vue'
import AtClients from './atelier/AtClients.vue'
import AtAwards from './atelier/AtAwards.vue'
import AtContact from './atelier/AtContact.vue'
import AtFooter from './atelier/AtFooter.vue'

const { t } = useI18n()
</script>

<template>
  <div class="at">
    <AtCursor />
    <AtNav />
    <AtHero />
    <AtMarquee :text="t('atelier.marquee1')" />
    <AtAbout />
    <AtServices />
    <AtWork />
    <AtMarquee :text="t('atelier.marquee2')" variant="accent" />
    <AtProcess />
    <AtClients />
    <AtAwards />
    <AtContact />
    <AtFooter />
  </div>
</template>

<style lang="scss">
// Global font import
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.at {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f0ede4;
  color: #0a0a0a;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  position: relative;
  scroll-behavior: smooth;

  *, *::before, *::after { box-sizing: border-box; }

  // Hide native cursor on hover-capable devices (custom cursor takes over)
  @media (hover: hover) {
    &, *, a, button {
      cursor: none !important;
    }
  }

  a, button { color: inherit; }
}
</style>
