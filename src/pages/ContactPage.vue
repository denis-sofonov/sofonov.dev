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
  // Title — character-by-character opacity stagger (no flipping, no y)
  const el = document.querySelector('.contact__title')
  if (el) {
    const text = el.textContent || ''
    el.innerHTML = text.split('').map(ch =>
      ch === ' ' ? ' ' : `<span class="contact__char">${ch}</span>`,
    ).join('')
    gsap.from('.contact__char', { opacity: 0, stagger: 0.025, duration: 0.35, ease: 'power2.out', delay: 0.15 })
  }

  gsap.from('.contact__sub', { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.45 })
  gsap.from('.contact__link', { opacity: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.6 })
})
</script>

<template>
  <PageFrame num="07" :section="t('nav.contact')">
    <div class="contact-page">
      <h1 class="contact__title">{{ t('cta.title') }}</h1>
      <p class="contact__sub">{{ t('cta.subtitle') }}</p>
      <div class="contact__links">
        <a v-for="link in links" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer" class="contact__link magnetic">
          {{ link.label.toLowerCase() }} <span class="contact__arrow">→</span>
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
  letter-spacing: -0.02em;
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
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 12px 24px;
  letter-spacing: 0;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
}

.contact__arrow {
  transition: transform 0.2s ease;
}
.contact__link:hover .contact__arrow { transform: translate(2px, -2px); }
</style>
