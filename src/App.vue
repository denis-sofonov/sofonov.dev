<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()

const isStandalone = computed(() => Boolean(route.meta?.standalone))

function getSystemTheme(): string {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const currentTheme = getSystemTheme()
const isDark = ref(currentTheme === 'dark')
document.documentElement.setAttribute('data-theme', currentTheme)

const savedLocale = localStorage.getItem('locale')
if (savedLocale) {
  locale.value = savedLocale
}

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'ru' : 'en'
  localStorage.setItem('locale', locale.value)
}

const isGlitching = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  // Trigger brief glitch effect on theme switch
  isGlitching.value = true
  setTimeout(() => { isGlitching.value = false }, 460)
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  console.log(
    '%c> LOOKING FOR A FULLSTACK ENGINEER?',
    'color: #DC4513; font-size: 20px; font-weight: 900; font-family: monospace;'
  )
  console.log(
    '%cYou found one. Check the source — it\'s clean.\nhttps://github.com/denis-sofonov | https://t.me/denis_sofonov',
    'color: #f5f5f5; font-size: 13px; font-family: monospace;'
  )
})
</script>

<template>
  <!-- Standalone pet project pages — no brutalist wrapper -->
  <RouterView v-if="isStandalone" />

  <!-- Main brutalist business card site -->
  <div v-else class="page" :class="{ 'page--glitching': isGlitching }">
    <header class="header">
      <span class="header__logo">DS</span>
      <div class="header__controls">
        <button class="header__btn" @click="toggleTheme">
          {{ isDark ? t('theme.light') : t('theme.dark') }}
        </button>
        <button class="header__btn" @click="toggleLocale">
          {{ t('switchLang') }}
        </button>
      </div>
    </header>

    <RouterView />

    <footer class="footer">
      <span>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</span>
      <span class="footer__year">A.D. <em>{{ new Date().getFullYear() }}</em></span>
      <span>
        VUE 3 + TS + VITE ·
        <a href="https://github.com/denis-sofonov" target="_blank" rel="noopener noreferrer" class="footer__link">view source</a>
      </span>
    </footer>
  </div>
</template>

<style lang="scss">
@use 'assets/global';
</style>
