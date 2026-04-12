<script setup lang="ts">
import FoNav from './forma/FoNav.vue'
import FoHero from './forma/FoHero.vue'
import FoTicker from './forma/FoTicker.vue'
import FoStory from './forma/FoStory.vue'
import FoSpecs from './forma/FoSpecs.vue'
import FoColors from './forma/FoColors.vue'
import FoBox from './forma/FoBox.vue'
import FoReviews from './forma/FoReviews.vue'
import FoBuy from './forma/FoBuy.vue'
import FoFooter from './forma/FoFooter.vue'
</script>

<template>
  <div class="fo">
    <FoNav />
    <FoHero />
    <FoTicker />
    <FoStory />
    <FoSpecs />
    <FoColors />
    <FoBox />
    <FoReviews />
    <FoBuy />
    <FoFooter />
  </div>
</template>

<style lang="scss">
// Global font import
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.fo {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #fafaf6;
  color: #0a0a0a;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  position: relative;

  *, *::before, *::after { box-sizing: border-box; cursor: auto; }

  a, button, [role='button'] { cursor: pointer; }
}
</style>
