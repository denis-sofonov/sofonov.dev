<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Service { num: string; name: string; tags: string; desc: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.at-svc__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.at-svc__row', { y: 50, stagger: 0.1, duration: 1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="services" class="at-svc">
    <div class="at-svc__inner">
      <div class="at-svc__head">
        <div class="at-svc__eyebrow">{{ t('atelier.services.eyebrow') }}</div>
        <h2 class="at-svc__title">{{ t('atelier.services.title') }}</h2>
      </div>

      <div class="at-svc__list">
        <article
          v-for="(s, i) in (tm('atelier.services.items') as Service[])"
          :key="i"
          class="at-svc__row"
        >
          <div class="at-svc__num">{{ s.num }}</div>
          <div class="at-svc__name">{{ s.name }}</div>
          <div class="at-svc__details">
            <p class="at-svc__desc">{{ s.desc }}</p>
            <div class="at-svc__tags">{{ s.tags }}</div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-svc {
  @include at-section-padding;
  background: $at-bg;
  border-top: 1px solid $at-fg;
}

.at-svc__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.at-svc__head {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 80px;
  margin-bottom: 100px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 56px;
  }
}

.at-svc__eyebrow {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  padding-top: 12px;
}

.at-svc__title {
  @include at-display;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 500;
  color: $at-fg;
  max-width: 1100px;
}

.at-svc__list {
  display: flex;
  flex-direction: column;
}

.at-svc__row {
  display: grid;
  grid-template-columns: 100px 1fr 1.2fr;
  gap: 64px;
  align-items: start;
  padding: 56px 0;
  border-top: 1px solid $at-border-bright;
  cursor: default;
  transition: all 0.4s ease;
  position: relative;

  &:last-child { border-bottom: 1px solid $at-border-bright; }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: $at-fg;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
    z-index: 0;
  }

  &:hover::before { transform: scaleY(1); transform-origin: top; }

  &:hover {
    .at-svc__num,
    .at-svc__name,
    .at-svc__desc,
    .at-svc__tags { color: $at-bg; }
    .at-svc__name { transform: translateX(20px); }
  }

  & > * { position: relative; z-index: 1; }

  @media (max-width: 900px) {
    grid-template-columns: 60px 1fr;
    gap: 16px;
    padding: 32px 0;

    .at-svc__details { grid-column: 1 / -1; }
  }
}

.at-svc__num {
  @include at-mono;
  font-size: 13px;
  color: $at-fg-muted;
  padding-top: 16px;
  transition: color 0.3s ease;
}

.at-svc__name {
  @include at-display;
  font-size: clamp(36px, 5vw, 72px);
  line-height: 0.95;
  font-weight: 500;
  color: $at-fg;
  letter-spacing: -0.03em;
  transition: color 0.3s ease, transform 0.4s cubic-bezier(0.7, 0, 0.3, 1);
}

.at-svc__details {
  padding-top: 18px;
}

.at-svc__desc {
  @include at-sans;
  font-size: 16px;
  line-height: 1.55;
  color: $at-fg-muted;
  margin-bottom: 16px;
  max-width: 480px;
  transition: color 0.3s ease;
}

.at-svc__tags {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-subtle;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}
</style>
