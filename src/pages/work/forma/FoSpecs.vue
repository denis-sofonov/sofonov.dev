<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface SpecItem { name: string; value: string }
interface SpecGroup { label: string; items: SpecItem[] }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.fo-specs__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.fo-specs__group', { y: 50, stagger: 0.1, duration: 1, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="specs" class="fo-specs">
    <div class="fo-specs__inner">
      <div class="fo-specs__head">
        <div class="fo-specs__eyebrow">{{ t('forma.specs.eyebrow') }}</div>
        <h2 class="fo-specs__title">{{ t('forma.specs.title') }}</h2>
      </div>

      <div class="fo-specs__grid">
        <div
          v-for="(group, gi) in (tm('forma.specs.groups') as SpecGroup[])"
          :key="gi"
          class="fo-specs__group"
        >
          <div class="fo-specs__group-label">
            <span class="fo-specs__group-icon">{{ ['♫', '⚡', '◉', '◈'][gi] }}</span>
            {{ group.label }}
          </div>
          <div class="fo-specs__list">
            <div
              v-for="(item, i) in group.items"
              :key="i"
              class="fo-specs__row"
            >
              <div class="fo-specs__name">{{ item.name }}</div>
              <div class="fo-specs__value">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-specs {
  @include fo-section-padding;
  background: $fo-bg-alt;
  border-top: 1px solid $fo-border;
  border-bottom: 1px solid $fo-border;
}

.fo-specs__inner {
  max-width: 1440px;
  margin: 0 auto;
}

.fo-specs__head {
  margin-bottom: 100px;

  @media (max-width: 768px) { margin-bottom: 56px; }
}

.fo-specs__eyebrow {
  @include fo-mono;
  font-size: 11px;
  color: $fo-fg-muted;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fo-specs__title {
  @include fo-display-title;
  max-width: 900px;
  text-wrap: balance;
}

.fo-specs__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
  }
}

.fo-specs__group {}

.fo-specs__group-label {
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: $fo-accent;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid $fo-border-bright;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fo-specs__group-icon {
  font-size: 16px;
  opacity: 0.7;
}

.fo-specs__list {
  display: flex;
  flex-direction: column;
}

.fo-specs__row {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid $fo-border;
  align-items: baseline;

  &:last-child { border-bottom: none; }
}

.fo-specs__name {
  @include fo-sans;
  font-size: 13px;
  color: $fo-fg-muted;
  font-weight: 500;
}

.fo-specs__value {
  @include fo-sans;
  font-size: 14px;
  color: $fo-fg;
  font-weight: 500;
  text-align: right;

  @media (max-width: 600px) { text-align: left; }
}
</style>
