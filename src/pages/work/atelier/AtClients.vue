<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

onMounted(async () => {
  await nextTick()
  reveal('.at-cli__head > *', { y: 30, stagger: 0.1, duration: 1, start: 'top 80%' })
  reveal('.at-cli__cell', { y: 30, stagger: 0.06, duration: 0.9, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" class="at-cli">
    <div class="at-cli__inner">
      <div class="at-cli__head">
        <div class="at-cli__eyebrow">{{ t('atelier.clients.eyebrow') }}</div>
        <h2 class="at-cli__title">{{ t('atelier.clients.title') }}</h2>
      </div>

      <div class="at-cli__grid">
        <div class="at-cli__cell">
          <svg viewBox="0 0 24 24"><path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor"/></svg>
        </div>
        <div class="at-cli__cell"><span>Linear</span></div>
        <div class="at-cli__cell"><span>Notion</span></div>
        <div class="at-cli__cell">
          <svg viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.945 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="currentColor"/></svg>
        </div>
        <div class="at-cli__cell"><span>Figma</span></div>
        <div class="at-cli__cell"><span>Raycast</span></div>
        <div class="at-cli__cell"><span>Loom</span></div>
        <div class="at-cli__cell"><span>Framer</span></div>
        <div class="at-cli__cell"><span>Arc</span></div>
        <div class="at-cli__cell"><span>Anthropic</span></div>
        <div class="at-cli__cell"><span>Webflow</span></div>
        <div class="at-cli__cell"><span>Pitch</span></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-cli {
  @include at-section-padding;
  background: $at-bg;
  border-top: 1px solid $at-fg;
}

.at-cli__inner {
  max-width: 1600px;
  margin: 0 auto;
}

.at-cli__head {
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

.at-cli__eyebrow {
  @include at-mono;
  font-size: 11px;
  color: $at-fg-muted;
  padding-top: 12px;
}

.at-cli__title {
  @include at-display;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-weight: 500;
  color: $at-fg;
}

.at-cli__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: $at-border-bright;
  border: 1px solid $at-border-bright;

  @media (max-width: 900px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
}

.at-cli__cell {
  background: $at-bg;
  aspect-ratio: 5/2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $at-fg;
  transition: all 0.3s ease;

  svg {
    width: 36px;
    height: 36px;
    transition: transform 0.3s ease;
  }

  span {
    @include at-display;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -0.02em;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: $at-fg;
    color: $at-bg;

    svg, span { transform: scale(1.1); }
  }
}
</style>
