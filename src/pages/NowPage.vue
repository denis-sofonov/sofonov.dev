<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, nextTick } from 'vue'
import { animate as anime } from 'animejs'
import PageFrame from '../components/PageFrame.vue'

const { t, tm } = useI18n()

interface Section { label: string; items: string[] }
const sections = computed(() => tm('now.sections') as Section[])

onMounted(() => {
  nextTick(() => {
    anime('.now__head > *', {
      opacity: [0, 1],
      duration: 420,
      delay: (_: unknown, i: number) => 100 + i * 80,
      ease: 'outQuad',
    })
    anime('.now__section', {
      opacity: [0, 1],
      duration: 460,
      delay: (_: unknown, i: number) => 250 + i * 100,
      ease: 'outQuad',
    })
    anime('.now__item', {
      opacity: [0, 1],
      duration: 400,
      delay: (_: unknown, i: number) => 320 + i * 45,
      ease: 'outQuad',
    })
  })
})
</script>

<template>
  <PageFrame num="08" :section="t('nav.now')">
    <div class="now-page">
      <header class="now__head">
        <h1 class="now__title">{{ t('nav.now') }}</h1>
        <p class="now__updated">{{ t('now.updated') }}</p>
        <p class="now__intro">{{ t('now.intro') }}</p>
      </header>

      <div class="now__body">
        <section v-for="(s, si) in sections" :key="si" class="now__section">
          <h2 class="now__label">{{ s.label }}</h2>
          <ul class="now__list">
            <li v-for="(item, ii) in s.items" :key="ii" class="now__item">
              <span class="now__bullet">—</span>
              <span class="now__text">{{ item }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.now-page {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: 64px;
  padding: 40px 24px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  align-content: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px 12px;
  }
}

.now__head {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 24px;
  align-self: start;

  @media (max-width: 960px) {
    position: static;
  }
}

.now__title {
  font-family: var(--font-display);
  font-size: clamp(48px, 6vw, 88px);
  letter-spacing: -0.03em;
  line-height: 0.9;
  color: var(--fg);
  margin: 0;
  font-weight: 500;
}

.now__updated {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0;
}

.now__intro {
  margin: 4px 0 0;
  font-family: var(--font-sans);
  font-size: clamp(14px, 1.1vw, 17px);
  line-height: 1.55;
  color: var(--muted);
  max-width: 34ch;
}

.now__body {
  display: flex;
  flex-direction: column;
  gap: 36px;
  min-width: 0;

  @media (max-width: 960px) {
    gap: 28px;
  }
}

.now__section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.now__label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--accent);
}

.now__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.now__item {
  display: flex;
  gap: 12px;
  font-family: var(--font-sans);
  font-size: clamp(15px, 1.15vw, 18px);
  line-height: 1.55;
  color: var(--fg);
}

.now__bullet {
  color: var(--muted);
  flex-shrink: 0;
  line-height: 1.55;
}

.now__text {
  flex: 1;
}
</style>
