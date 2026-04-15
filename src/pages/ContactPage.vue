<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import gsap from 'gsap'
import PageFrame from '../components/PageFrame.vue'

const { t } = useI18n()

const links = [
  { label: 'GitHub', href: 'https://github.com/denis-sofonov' },
  { label: 'Telegram', href: 'https://t.me/denis_sofonov' },
  { label: 'Email', href: 'mailto:denissofonovv@gmail.com' },
]

onMounted(() => {
  // Title character split
  const el = document.querySelector('.contact__title')
  if (el) {
    const text = el.textContent || ''
    el.innerHTML = text.split('').map(ch =>
      ch === ' ' ? ' ' : `<span class="contact__char-wrap"><span class="contact__char">${ch}</span></span>`
    ).join('')
    gsap.from('.contact__char', { y: '100%', rotateX: -40, stagger: 0.025, duration: 0.6, ease: 'power3.out', delay: 0.3 })
  }

  gsap.from('.contact__sub', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.7 })
  gsap.from('.contact__link', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out', delay: 0.9 })
})
</script>

<template>
  <PageFrame num="08" :section="t('nav.contact')" :subtitle="t('sections.contact')" sheet="SHEET 08/08">
    <div class="contact-page">
      <h1 class="contact__title">{{ t('cta.title') }}</h1>
      <p class="contact__sub">{{ t('cta.subtitle') }}</p>
      <div class="contact__links">
        <a v-for="link in links" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer" class="contact__link magnetic">
          [ {{ link.label }} &nearr; ]
        </a>
      </div>
    </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.contact-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px 8px;
  }
}

.contact__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--fs-hero);
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  line-height: 0.95;
  margin-bottom: 28px;
}

.contact__char-wrap {
  display: inline-block;
  overflow: hidden;
}

.contact__char {
  display: inline-block;
}

.contact__sub {
  font-size: 15px;
  color: var(--muted);
  max-width: 45ch;
  line-height: 1.6;
  margin-bottom: 40px;
}

.contact__links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.contact__link {
  font-size: 13px;
  text-decoration: none;
  color: var(--fg);
  border: 1px solid var(--border);
  padding: 14px 28px;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: var(--fg);
    color: var(--bg);
  }
}
</style>
