<script setup lang="ts">
import HeroSection from '../components/sections/HeroSection.vue'
import ExperienceSection from '../components/sections/ExperienceSection.vue'
import StackSection from '../components/sections/StackSection.vue'
import ProjectsSection from '../components/sections/ProjectsSection.vue'
import NowSection from '../components/sections/NowSection.vue'
import ContactsSection from '../components/sections/ContactsSection.vue'
</script>

<template>
  <div class="landing">
    <HeroSection />
    <ExperienceSection />
    <StackSection />
    <ProjectsSection />
    <NowSection />
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
