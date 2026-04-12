<script setup lang="ts">
import NwNav from './northwind/NwNav.vue'
import NwHero from './northwind/NwHero.vue'
import NwStats from './northwind/NwStats.vue'
import NwBento from './northwind/NwBento.vue'
import NwSticky from './northwind/NwSticky.vue'
import NwCode from './northwind/NwCode.vue'
import NwUseCases from './northwind/NwUseCases.vue'
import NwHow from './northwind/NwHow.vue'
import NwCompare from './northwind/NwCompare.vue'
import NwStory from './northwind/NwStory.vue'
import NwTestimonials from './northwind/NwTestimonials.vue'
import NwPricing from './northwind/NwPricing.vue'
import NwFaq from './northwind/NwFaq.vue'
import NwCta from './northwind/NwCta.vue'
import NwFooter from './northwind/NwFooter.vue'
</script>

<template>
  <div class="nw">
    <div class="nw-noise" aria-hidden="true"></div>
    <NwNav />
    <NwHero />
    <NwStats />
    <NwBento />
    <NwSticky />
    <NwCode />
    <NwUseCases />
    <NwHow />
    <NwCompare />
    <NwStory />
    <NwTestimonials />
    <NwPricing />
    <NwFaq />
    <NwCta />
    <NwFooter />
  </div>
</template>

<style lang="scss">
// Global font import (loaded once)
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap');

.nw {
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #050507;
  color: #ffffff;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
  position: relative;
  scroll-behavior: smooth;
  // NOTE: NO overflow-x: hidden here — it would break position: sticky
  // (browser implicitly sets overflow-y: auto when overflow-x is hidden,
  // creating a scroll container that traps sticky elements)

  *, *::before, *::after { box-sizing: border-box; cursor: auto; }

  a, button, [role='button'] { cursor: pointer; }
}


.nw-noise {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}
</style>
