<script setup lang="ts">
import HeroSection from '../components/sections/HeroSection.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
import StackSection from '../components/sections/StackSection.vue'
import ProcessSection from '../components/sections/ProcessSection.vue'
import PrinciplesSection from '../components/sections/PrinciplesSection.vue'
import FaqSection from '../components/sections/FaqSection.vue'
import ContactsSection from '../components/sections/ContactsSection.vue'
</script>

<template>
  <div class="landing">
    <HeroSection />
    <ServicesSection />
    <StackSection />
    <ProcessSection />
    <PrinciplesSection />
    <FaqSection />
    <ContactsSection />
  </div>
</template>

<style lang="scss" scoped>
.landing {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
</style>
