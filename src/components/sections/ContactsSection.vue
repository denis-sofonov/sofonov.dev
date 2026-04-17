<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, ref, computed } from 'vue'

const { t, locale } = useI18n()

const TG_URL = 'https://t.me/denis_sofonov'
const EMAIL = 'hello@sofonov.dev'
const GITHUB_URL = 'https://github.com/denis-sofonov'

const now = ref(new Date())
let tickId: number | null = null

const stampLabel = computed(() => {
  const ruLocale = locale.value === 'ru'
  const intlLocale = ruLocale ? 'ru-RU' : 'en-US'
  const city = ruLocale ? 'москва' : 'moscow'
  const weekday = new Intl.DateTimeFormat(intlLocale, {
    timeZone: 'Europe/Moscow',
    weekday: 'short',
  }).format(now.value).replace(/\.$/, '').toLowerCase()
  const time = new Intl.DateTimeFormat(intlLocale, {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now.value)
  return `${city} · ${weekday} ${time}`
})

onMounted(() => {
  tickId = window.setInterval(() => { now.value = new Date() }, 30_000)
})

onUnmounted(() => {
  if (tickId !== null) window.clearInterval(tickId)
})
</script>

<template>
  <section id="contacts" class="contacts">
    <div class="contacts__marquee" aria-hidden="true" data-parallax="28">
      <div v-for="g in 2" :key="g" class="contacts__marquee-track">
        <span v-for="n in 24" :key="n" class="contacts__marquee-item">
          <span>{{ t('contacts.title') }}</span>
          <span class="contacts__marquee-dot">•</span>
        </span>
      </div>
    </div>

    <div class="contacts__inner">
      <div class="contacts__stamp" data-reveal="fade-in">
        <span class="contacts__stamp-dot" aria-hidden="true" />
        <span>{{ stampLabel }}</span>
      </div>

      <ul class="contacts__list">
        <li class="contacts__row" data-reveal="slide-right">
          <span class="contacts__n">01</span>
          <span class="contacts__k">{{ t('contacts.items.telegram') }}</span>
          <a :href="TG_URL" target="_blank" rel="noopener" class="contacts__v">@denis_sofonov</a>
          <span class="contacts__arrow" aria-hidden="true">→</span>
        </li>
        <li class="contacts__row" data-reveal="slide-right">
          <span class="contacts__n">02</span>
          <span class="contacts__k">{{ t('contacts.items.email') }}</span>
          <a :href="`mailto:${EMAIL}`" class="contacts__v">{{ EMAIL }}</a>
          <span class="contacts__arrow" aria-hidden="true">→</span>
        </li>
        <li class="contacts__row" data-reveal="slide-right">
          <span class="contacts__n">03</span>
          <span class="contacts__k">{{ t('contacts.items.github') }}</span>
          <a :href="GITHUB_URL" target="_blank" rel="noopener" class="contacts__v">@denis-sofonov</a>
          <span class="contacts__arrow" aria-hidden="true">→</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contacts {
  position: relative;
  padding: 60px 0 140px;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) { padding: 56px 0 120px; }
}

.contacts__marquee {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  padding: 0 0 64px;

  @media (max-width: 768px) { padding: 0 0 44px; }
}
.contacts__marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: contacts-marquee 48s linear infinite reverse;
  gap: 28px;
  padding-right: 28px;
  align-items: center;
}
.contacts__marquee-item {
  display: inline-flex;
  gap: 28px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: 0.06em;
  text-transform: lowercase;
}
.contacts__marquee-dot { color: var(--accent); opacity: 0.6; font-size: 6px; }
@keyframes contacts-marquee { to { transform: translateX(calc(-100% - 28px)); } }

.contacts__inner {
  flex: 1;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;

  @media (max-width: 768px) { padding: 0 16px; gap: 32px; }
}

.contacts__stamp {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.04em;
  text-transform: lowercase;
  align-self: flex-start;
  will-change: transform, opacity;
}

.contacts__stamp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.9;
  animation: contacts-stamp-pulse 2.4s ease-in-out infinite;
}

@keyframes contacts-stamp-pulse {
  0%, 60%, 100% { transform: scale(1); opacity: 0.85; }
  15% { transform: scale(1.9); opacity: 1; }
  30% { transform: scale(1); opacity: 0.85; }
}

.contacts__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.contacts__row {
  display: grid;
  grid-template-columns: 48px 160px 1fr 32px;
  gap: 28px;
  align-items: baseline;
  padding: 28px 4px;
  border-top: 1px solid var(--border);
  transition: padding-left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;

  &:last-child {
    border-bottom: 1px solid var(--border);
  }

  &:hover {
    padding-left: 14px;

    .contacts__v { color: var(--accent); }
    .contacts__n { opacity: 0.9; }
    .contacts__arrow {
      opacity: 1;
      transform: translateX(4px);
      color: var(--accent);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 32px 100px 1fr 22px;
    gap: 14px;
    padding: 22px 4px;
  }
}

.contacts__n {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  opacity: 0.55;
  letter-spacing: 0;
  transition: opacity 0.25s ease;
}

.contacts__k {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contacts__v {
  font-family: var(--font-display);
  font-size: clamp(24px, 2.6vw, 40px);
  font-weight: 500;
  color: var(--fg);
  text-decoration: none;
  letter-spacing: -0.015em;
  line-height: 1.1;
  transition: color 0.25s ease;
}

.contacts__arrow {
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), color 0.25s ease;
  justify-self: end;
}
</style>
