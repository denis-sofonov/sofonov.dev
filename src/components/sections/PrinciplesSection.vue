<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, tm } = useI18n()

interface Item { label: string; title: string; body: string }
const items = computed(() => tm('principles.items') as Item[])
</script>

<template>
  <section id="principles" class="principles">
    <div class="principles__marquee" aria-hidden="true" data-parallax="28">
      <div v-for="g in 2" :key="g" class="principles__marquee-track">
        <span v-for="n in 24" :key="n" class="principles__marquee-item">
          <span>{{ t('principles.title') }}</span>
          <span class="principles__marquee-dot">•</span>
        </span>
      </div>
    </div>

    <div class="principles__list">
      <article
        v-for="(p, i) in items"
        :key="i"
        class="p-card"
      >
        <div class="p-card__left">
          <div class="p-card__meta" data-reveal="fade-in">
            <span class="p-card__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="p-card__bar" aria-hidden="true" />
            <span class="p-card__ordinal">{{ p.label }}</span>
          </div>
          <h3 class="p-card__title js-squish" data-reveal="clip-up">{{ p.title }}</h3>
        </div>
        <p class="p-card__body" data-reveal="fade-up">{{ p.body }}</p>
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.principles {
  position: relative;
  padding: 60px 0 72px;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) { padding: 56px 0 56px; }
}

.principles__marquee {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  padding: 0 0 64px;

  @media (max-width: 768px) { padding: 0 0 40px; }
}
.principles__marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: principles-marquee 54s linear infinite;
  gap: 28px;
  padding-right: 28px;
  align-items: center;
}
.principles__marquee-item {
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
.principles__marquee-dot {
  color: var(--accent);
  opacity: 0.6;
  font-size: 6px;
}
@keyframes principles-marquee { to { transform: translateX(calc(-100% - 28px)); } }

.principles__list {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) { padding: 0 16px; }
}

.p-card {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 48px;
  align-items: baseline;
  padding: 28px 4px;
  border-top: 1px solid var(--border);
  transition: padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;

  &:last-child { border-bottom: 1px solid var(--border); }

  &:hover {
    padding-left: 14px;

    .p-card__title { color: var(--accent); }
    .p-card__bar { width: 56px; background: var(--accent); opacity: 1; }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 24px 4px;
  }
}

.p-card__left {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.p-card__meta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: lowercase;
}
.p-card__n {
  color: var(--accent);
  font-weight: 500;
}
.p-card__bar {
  display: inline-block;
  width: 32px;
  height: 1px;
  background: var(--accent);
  opacity: 0.7;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease, opacity 0.25s ease;
}
.p-card__ordinal { opacity: 0.7; }

.p-card__title {
  font-family: var(--font-display);
  font-size: clamp(26px, 2.9vw, 40px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.015em;
  margin: 0;
  text-transform: lowercase;
  color: var(--fg);
  transition: color 0.3s ease;
  max-width: 18ch;
}

.p-card__body {
  font-size: clamp(14px, 1vw, 16px);
  line-height: 1.6;
  color: var(--fg);
  opacity: 0.78;
  margin: 0;
  max-width: 54ch;
}
</style>
