<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, tm } = useI18n()

interface Group { cat: string; items: string[] }
const groups = computed(() => tm('stack.groups') as Group[])
</script>

<template>
  <section id="stack" class="stack">
    <div class="stack__marquee" aria-hidden="true" data-parallax="28">
      <div v-for="g in 2" :key="g" class="stack__marquee-track">
        <span v-for="n in 24" :key="n" class="stack__marquee-item">
          <span>{{ t('stack.title') }}</span>
          <span class="stack__marquee-dot">•</span>
        </span>
      </div>
    </div>

    <div class="stack__list">
      <div
        v-for="(group, i) in groups"
        :key="i"
        class="stack-row"
        data-reveal="fade-up"
      >
        <div class="stack-row__label">
          <span class="stack-row__n">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="stack-row__cat">{{ group.cat }}</span>
        </div>
        <div class="stack-row__items">
          <template v-for="(item, j) in group.items" :key="j">
            <span class="stack-row__item">{{ item }}</span>
            <span
              v-if="j < group.items.length - 1"
              class="stack-row__sep"
              aria-hidden="true"
            >·</span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.stack {
  position: relative;
  padding: 60px 0 72px;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) { padding: 56px 0 56px; }
}

.stack__marquee {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  padding: 0 0 56px;

  @media (max-width: 768px) { padding: 0 0 36px; }
}
.stack__marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: stack-marquee 50s linear infinite;
  gap: 28px;
  padding-right: 28px;
  align-items: center;
}
.stack__marquee-item {
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
.stack__marquee-dot {
  color: var(--accent);
  opacity: 0.6;
  font-size: 6px;
}
@keyframes stack-marquee { to { transform: translateX(calc(-100% - 28px)); } }

.stack__list {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) { padding: 0 16px; }
}

.stack-row {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 48px;
  align-items: baseline;
  padding: 34px 4px;
  border-top: 1px solid var(--border);

  &:last-child { border-bottom: 1px solid var(--border); }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 26px 4px;
  }
}

.stack-row__label {
  display: inline-flex;
  gap: 14px;
  align-items: baseline;
}

.stack-row__n {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  opacity: 0.55;
}

.stack-row__cat {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stack-row__items {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 18px;
  row-gap: 10px;
}

.stack-row__item {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.4vw, 32px);
  font-weight: 500;
  letter-spacing: -0.01em;
  text-transform: lowercase;
  color: var(--fg);
  transition: color 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
  cursor: default;
}

.stack-row__sep {
  color: var(--muted);
  opacity: 0.4;
  font-size: 16px;
  will-change: transform, opacity;
}

.stack-row__items:has(.stack-row__item:hover) .stack-row__item:not(:hover) {
  opacity: 0.35;
}
.stack-row__item:hover {
  color: var(--accent);
  transform: translateY(-2px);
}
</style>
