<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Event { date: string; day: string; title: string; desc: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.lu-events__head > *', { y: 30, stagger: 0.12, duration: 1.4, start: 'top 80%' })
  reveal('.lu-events__row', { y: 40, stagger: 0.12, duration: 1.4, start: 'top 85%' })
})
</script>

<template>
  <section ref="root" id="events" class="lu-events">
    <div class="lu-events__inner">
      <div class="lu-events__head">
        <div class="lu-events__eyebrow">{{ t('lumen.events.eyebrow') }}</div>
        <h2 class="lu-events__title">{{ t('lumen.events.title') }}</h2>
      </div>

      <div class="lu-events__list">
        <article
          v-for="(e, i) in (tm('lumen.events.items') as Event[])"
          :key="i"
          class="lu-events__row"
        >
          <div class="lu-events__date">
            <div class="lu-events__date-num">{{ e.date }}</div>
            <div class="lu-events__date-day">{{ e.day }}</div>
          </div>
          <div class="lu-events__content">
            <h3 class="lu-events__name">{{ e.title }}</h3>
            <p class="lu-events__desc">{{ e.desc }}</p>
          </div>
          <div class="lu-events__cta">
            <span>RSVP</span>
            <span class="lu-events__arrow">→</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-events {
  @include lu-section-padding;
  background: $lu-bg;
}

.lu-events__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.lu-events__head {
  margin-bottom: 80px;

  @media (max-width: 768px) { margin-bottom: 48px; }
}

.lu-events__eyebrow { @include lu-eyebrow; }

.lu-events__title {
  @include lu-display;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: $lu-fg;
  max-width: 800px;
}

.lu-events__list {
  display: flex;
  flex-direction: column;
}

.lu-events__row {
  display: grid;
  grid-template-columns: 160px 1fr auto;
  gap: 48px;
  align-items: center;
  padding: 36px 0;
  border-bottom: 1px solid $lu-border;
  cursor: pointer;
  transition: all 0.4s ease;

  &:first-child { border-top: 1px solid $lu-border; }

  &:hover {
    .lu-events__name { color: $lu-gold; }
    .lu-events__arrow { transform: translateX(8px); }
    .lu-events__date-num { color: $lu-gold; }
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.lu-events__date {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid $lu-border-bright;
  padding-right: 32px;

  @media (max-width: 700px) {
    flex-direction: row;
    border-right: none;
    padding-right: 0;
    gap: 12px;
    align-items: baseline;
  }
}

.lu-events__date-num {
  @include lu-display-italic;
  font-size: 36px;
  color: $lu-fg;
  line-height: 1;
  transition: color 0.3s ease;
}

.lu-events__date-day {
  @include lu-sans;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: $lu-fg-subtle;
}

.lu-events__name {
  @include lu-display;
  font-size: clamp(22px, 2.5vw, 32px);
  color: $lu-fg;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.lu-events__desc {
  @include lu-sans;
  font-size: 14px;
  line-height: 1.6;
  color: $lu-fg-muted;
}

.lu-events__cta {
  @include lu-sans;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $lu-gold;
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;

  @media (max-width: 700px) { display: none; }
}

.lu-events__arrow {
  transition: transform 0.4s ease;
}
</style>
