<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

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
  isGlitching.value = true
  setTimeout(() => { isGlitching.value = false }, 300)
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

// Custom cursor + magnetic elements
const cursorEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!cursorEl.value) return
  const cursor = cursorEl.value
  let cx = 0, cy = 0, tx = 0, ty = 0

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX
    ty = e.clientY

    // Magnetic effect — push nearby magnetic elements toward cursor
    document.querySelectorAll('.magnetic').forEach(el => {
      const rect = (el as HTMLElement).getBoundingClientRect()
      const elX = rect.left + rect.width / 2
      const elY = rect.top + rect.height / 2
      const dx = tx - elX
      const dy = ty - elY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 100

      if (dist < maxDist) {
        const pull = (1 - dist / maxDist) * 0.35;
        (el as HTMLElement).style.transform = `translate(${dx * pull}px, ${dy * pull}px)`
      } else {
        (el as HTMLElement).style.transform = ''
      }
    })
  })

  function animate() {
    cx += (tx - cx) * 0.12
    cy += (ty - cy) * 0.12
    cursor.style.transform = `translate(${cx - 10}px, ${cy - 10}px)`
    requestAnimationFrame(animate)
  }
  animate()

})

const navLinks = computed(() => [
  { path: '/', label: t('nav.main') },
  { path: '/about', label: t('nav.about') },
  { path: '/services', label: t('nav.services') },
  { path: '/process', label: t('nav.process') },
  { path: '/rates', label: t('nav.rates') },
  { path: '/work', label: t('nav.work') },
  { path: '/stack', label: t('nav.stack') },
  { path: '/contact', label: t('nav.contact') },
])

function onKeydown(e: KeyboardEvent) {
  if (isStandalone.value) return
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  if (e.metaKey || e.ctrlKey || e.altKey) return

  const paths = navLinks.value.map(l => l.path)
  const idx = paths.indexOf(route.path)
  if (idx === -1) return

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    const next = paths[(idx + 1) % paths.length]
    router.push(next)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    const prev = paths[(idx - 1 + paths.length) % paths.length]
    router.push(prev)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

onMounted(() => {
  console.log(
    '%c> LOOKING FOR A FULLSTACK ENGINEER?',
    'color: #e8e8e8; font-size: 20px; font-weight: 900; font-family: monospace;'
  )
  console.log(
    '%cYou found one. Check the source — it\'s clean.\nhttps://github.com/denis-sofonov | https://t.me/denis_sofonov',
    'color: #888; font-size: 13px; font-family: monospace;'
  )
})
</script>

<template>
  <!-- Standalone pet project pages — no wrapper -->
  <RouterView v-if="isStandalone" />

  <!-- Main portfolio site -->
  <div v-else class="page" :class="{ 'page--glitching': isGlitching }">
    <Teleport to="body">
      <div ref="cursorEl" class="cursor"></div>
    </Teleport>

    <header class="header">
      <RouterLink to="/" class="header__logo">sofonov.dev</RouterLink>
      <nav class="header__nav">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="header__nav-link magnetic"
          :class="{ 'header__nav-link--active': route.path === link.path }"
        >
          [ {{ link.label }} ]
        </RouterLink>
      </nav>
      <div class="header__controls">
        <button class="header__btn" @click="toggleTheme">
          {{ isDark ? t('theme.light') : t('theme.dark') }}
        </button>
        <button class="header__btn" @click="toggleLocale">
          {{ t('switchLang') }}
        </button>
      </div>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in" :duration="{ enter: 400, leave: 300 }">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>

    <!-- footer removed — pages are full-screen compositions -->
  </div>
</template>

<style lang="scss">
@use 'assets/global';
</style>
