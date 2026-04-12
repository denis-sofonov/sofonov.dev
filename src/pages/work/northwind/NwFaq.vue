<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Faq { q: string; a: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

const openFaq = ref<number | null>(0)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-faq__item', { y: 30, stagger: 0.06, duration: 0.7, start: 'top 85%' })
})
</script>

<template>
  <section ref="root" class="nw-faq">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.faq.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.faq.title') }}</h2>
    </div>
    <div class="nw-faq__list">
      <div
        v-for="(item, i) in (tm('northwind.faq.items') as Faq[])"
        :key="i"
        class="nw-faq__item"
        :class="{ 'nw-faq__item--open': openFaq === i }"
      >
        <button class="nw-faq__q" @click="toggleFaq(i)">
          <span>{{ item.q }}</span>
          <span class="nw-faq__icon">{{ openFaq === i ? '−' : '+' }}</span>
        </button>
        <div v-show="openFaq === i" class="nw-faq__a">{{ item.a }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-faq {
  padding: 80px 24px 160px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-faq__list { display: flex; flex-direction: column; }

.nw-faq__item {
  border-bottom: 1px solid $nw-border;
  transition: all 0.2s ease;
  text-align: left;

  &:first-child { border-top: 1px solid $nw-border; }
}

.nw-faq__q {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  color: $nw-fg;
  letter-spacing: -0.01em;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover { color: $nw-accent-bright; }
}

.nw-faq__icon {
  font-size: 24px;
  font-weight: 300;
  color: $nw-fg-muted;
  flex-shrink: 0;
}

.nw-faq__a {
  padding: 0 0 24px;
  font-size: 14px;
  line-height: 1.6;
  color: $nw-fg-muted;
  max-width: 700px;
}
</style>
