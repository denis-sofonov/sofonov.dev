<script setup lang="ts">
import LuNav from './lumen/LuNav.vue'
import LuHero from './lumen/LuHero.vue'
import LuIntro from './lumen/LuIntro.vue'
import LuPhilosophy from './lumen/LuPhilosophy.vue'
import LuWines from './lumen/LuWines.vue'
import LuMenu from './lumen/LuMenu.vue'
import LuGallery from './lumen/LuGallery.vue'
import LuPairing from './lumen/LuPairing.vue'
import LuPress from './lumen/LuPress.vue'
import LuEvents from './lumen/LuEvents.vue'
import LuVisit from './lumen/LuVisit.vue'
import LuFooter from './lumen/LuFooter.vue'
</script>

<template>
  <div class="lu">
    <div class="lu-grain" aria-hidden="true"></div>
    <LuNav />
    <LuHero />
    <LuIntro />

    <!-- Breathing pause — one word, centered -->
    <div class="lu-breath">
      <span class="lu-breath__text">Terroir.</span>
    </div>

    <LuPhilosophy />
    <LuWines />

    <!-- Breathing pause — italic serif -->
    <div class="lu-breath">
      <span class="lu-breath__text lu-breath__text--italic">Every bottle has a story.</span>
    </div>

    <LuMenu />
    <LuGallery />
    <LuPairing />
    <LuPress />

    <!-- Breathing pause — minimal -->
    <div class="lu-breath lu-breath--short">
      <span class="lu-breath__divider"></span>
    </div>

    <LuEvents />
    <LuVisit />
    <LuFooter />
  </div>
</template>

<style lang="scss">
// Global font import
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap');

.lu {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0e0a08;
  color: #f4ede1;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  position: relative;

  *, *::before, *::after { box-sizing: border-box; cursor: auto; }

  a, button, [role='button'] { cursor: pointer; }
}

// Subtle film grain
.lu-grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

// Luxury breathing sections — dramatic pauses
.lu-breath {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 0 40px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { min-height: 35vh; }
}

.lu-breath--short {
  min-height: 30vh;
}

.lu-breath__text {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(36px, 5vw, 72px);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #d4a960;
  opacity: 0.6;
  text-align: center;
  line-height: 1.2;
}

.lu-breath__text--italic {
  font-style: italic;
  font-size: clamp(28px, 4vw, 56px);
  color: #f4ede1;
  opacity: 0.35;
}

.lu-breath__divider {
  display: block;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4a960, transparent);
  animation: luDividerPulse 3s ease-in-out infinite;
}

@keyframes luDividerPulse {
  0%, 100% { width: 40px; opacity: 0.3; }
  50% { width: 100px; opacity: 0.7; }
}
</style>
