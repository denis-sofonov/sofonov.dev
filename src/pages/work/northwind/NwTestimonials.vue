<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Testimonial { quote: string; name: string; role: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-testimonial', { y: 50, stagger: 0.1, duration: 0.9, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="nw-testimonials">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.testimonials.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.testimonials.title') }}</h2>
    </div>
    <div class="nw-testimonials__grid">
      <div
        v-for="(item, i) in (tm('northwind.testimonials.items') as Testimonial[])"
        :key="i"
        class="nw-testimonial"
      >
        <div class="nw-testimonial__quote">"{{ item.quote }}"</div>
        <div class="nw-testimonial__author">
          <div class="nw-testimonial__avatar" :class="`nw-testimonial__avatar--${i}`">
            {{ item.name.split(' ').map((s) => s[0]).join('') }}
          </div>
          <div>
            <div class="nw-testimonial__name">{{ item.name }}</div>
            <div class="nw-testimonial__role">{{ item.role }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-testimonials {
  padding: 80px 24px 160px;
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-testimonials__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

.nw-testimonial {
  background: $nw-bg-card;
  border: 1px solid $nw-border;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: $nw-border-bright;
    background: $nw-bg-elevated;
  }
}

.nw-testimonial__quote {
  font-size: 17px;
  line-height: 1.55;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
  color: $nw-fg;
}

.nw-testimonial__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nw-testimonial__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.nw-testimonial__avatar--0 { background: linear-gradient(135deg, #00d4ff, #0099ff); }
.nw-testimonial__avatar--1 { background: linear-gradient(135deg, #ff3366, #ff6699); }
.nw-testimonial__avatar--2 { background: linear-gradient(135deg, #00ffaa, #00cc99); }
.nw-testimonial__avatar--3 { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }

.nw-testimonial__name { font-size: 14px; font-weight: 600; color: $nw-fg; }
.nw-testimonial__role { font-size: 12px; color: $nw-fg-muted; margin-top: 2px; }
</style>
