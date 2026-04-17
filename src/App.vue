<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import Lenis from 'lenis'
import StickyCta from './components/StickyCta.vue'
import DrawLayer from './components/DrawLayer.vue'
import LogoMark from './components/LogoMark.vue'

const { t, locale } = useI18n()

function syncPageMeta() {
  document.title = t('pageTitle')
  document.documentElement.setAttribute('lang', locale.value)
}
syncPageMeta()
watch(locale, syncPageMeta)

function getSystemTheme(): string {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return 'light'
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

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const navLinks = computed(() => [
  { href: '/#services', hash: '#services', label: t('nav.services') },
  { href: '/#stack', hash: '#stack', label: t('nav.stack') },
  { href: '/#process', hash: '#process', label: t('nav.process') },
  { href: '/#principles', hash: '#principles', label: t('nav.principles') },
  { href: '/#faq', hash: '#faq', label: t('nav.faq') },
  { href: '/#contacts', hash: '#contacts', label: t('nav.contacts') },
])

let lenis: Lenis | null = null
let rafId = 0

function scrollToAnchor(e: Event, link: { href: string; hash: string }) {
  e.preventDefault()
  const el = document.querySelector(link.hash) as HTMLElement | null
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.3 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const activeSection = ref('')
let sectionObserver: IntersectionObserver | null = null

onMounted(() => {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  })

  let smoothedVelocity = 0
  let smoothedDrift = 0
  const root = document.documentElement

  function updateScrollEffects() {
    if (!lenis) return
    const progress = lenis.progress || 0
    root.style.setProperty('--scroll-progress', progress.toFixed(4))

    const absTarget = Math.min(Math.abs(lenis.velocity) / 45, 1)
    smoothedVelocity += (absTarget - smoothedVelocity) * 0.18
    root.style.setProperty('--scroll-velocity', smoothedVelocity.toFixed(3))

    const signedTarget = Math.max(-1, Math.min(1, lenis.velocity / 45))
    smoothedDrift += (signedTarget - smoothedDrift) * 0.15
    root.style.setProperty('--scroll-drift', smoothedDrift.toFixed(3))

    const vh = window.innerHeight

    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const p = (center - vh / 2) / vh
      const factor = parseFloat(el.dataset.parallax || '30')
      el.style.setProperty('--parallax-y', `${(-p * factor).toFixed(1)}px`)
    })

    const revealStart = vh * 1.0
    const revealEnd = vh * 0.3
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      const rect = el.getBoundingClientRect()
      const raw = (revealStart - rect.top) / (revealStart - revealEnd)
      const p = Math.max(0, Math.min(1, raw))
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2
      el.style.setProperty('--reveal', eased.toFixed(3))
    })
  }

  lenis.on('scroll', updateScrollEffects)
  requestAnimationFrame(() => requestAnimationFrame(updateScrollEffects))
  window.addEventListener('resize', updateScrollEffects)

  function raf(time: number) {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = '#' + entry.target.id
        }
      }
    },
    { threshold: 0.3 },
  )

  const ids = ['services', 'stack', 'process', 'principles', 'faq', 'contacts']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) sectionObserver!.observe(el)
  })
})

onUnmounted(() => {
  sectionObserver?.disconnect()
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
})
</script>

<template>
  <div class="page">
    <header class="header">
      <RouterLink to="/" class="header__logo">
        <LogoMark :size="26" color="#d9211f" class="header__logo-mark" />
        <span>sofonov.dev</span>
      </RouterLink>
      <nav class="header__nav">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="header__nav-link"
          :class="{ 'header__nav-link--active': activeSection === link.hash }"
          @click="scrollToAnchor($event, link)"
        >
          {{ link.label }}
        </a>
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

    <div class="progress-bar" aria-hidden="true" />

    <RouterView />
    <StickyCta />
    <DrawLayer />
  </div>
</template>

<style lang="scss">
@use 'assets/global';
</style>
