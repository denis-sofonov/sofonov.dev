<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, tm } = useI18n()

interface Step { name: string; desc: string; eta: string; out: string; does: string[] }
const steps = computed(() => tm('process.steps') as Step[])
</script>

<template>
  <section id="process" class="process">
    <div class="process__marquee" aria-hidden="true" data-parallax="28">
      <div v-for="g in 2" :key="g" class="process__marquee-track">
        <span v-for="n in 24" :key="n" class="process__marquee-item">
          <span>{{ t('process.title') }}</span>
          <span class="process__marquee-dot">•</span>
        </span>
      </div>
    </div>

    <div class="process__stage">
      <div class="process__steps">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="p-step"
          data-reveal="scale"
        >
          <div class="p-step__content">
            <div class="p-step__head">
              <span class="p-step__n">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="p-step__name">{{ step.name }}</h3>
              <span class="p-step__dot" aria-hidden="true" />
            </div>
            <p class="p-step__desc">{{ step.desc }}</p>
            <ul class="p-step__does">
              <li v-for="(d, j) in step.does" :key="j">{{ d }}</li>
            </ul>
            <div class="p-step__meta">
              <span class="p-step__eta">{{ step.eta }}</span>
              <span class="p-step__arrow">→</span>
              <span class="p-step__out">{{ step.out }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.process {
  position: relative;
  padding: 60px 0 80px;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) { padding: 56px 0 56px; }
}


.process__marquee {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  padding: 0 0 56px;

  @media (max-width: 768px) { padding: 0 0 36px; }
}
.process__marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: proc-marquee 52s linear infinite reverse;
  gap: 28px;
  padding-right: 28px;
  align-items: center;
}
.process__marquee-item {
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
.process__marquee-dot {
  color: var(--accent);
  opacity: 0.6;
  font-size: 6px;
}
@keyframes proc-marquee { to { transform: translateX(calc(-100% - 28px)); } }

.process__stage {
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 900px) { padding: 0 16px; }
}

.process__steps {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.p-step {
  position: relative;
  padding: 32px 40px;
  border-top: 1px solid var(--border);
  transition: background-color 0.3s ease;
  cursor: default;

  &:nth-child(1),
  &:nth-child(2) { border-top: 1px solid var(--border); }

  &:nth-child(2n) { border-left: 1px solid var(--border); }

  &:nth-child(3),
  &:nth-child(4) { border-bottom: 1px solid var(--border); }

  @media (max-width: 900px) {
    padding: 26px 4px;
    border-left: none !important;

    &:last-child { border-bottom: 1px solid var(--border); }
  }
}

.p-step__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  will-change: transform, opacity;
}

.p-step__head {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.p-step__n {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  opacity: 0.55;
  letter-spacing: 0;
}
.p-step__name {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.2vw, 44px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.015em;
  margin: 0;
  text-transform: lowercase;
  color: var(--fg);
  transition: color 0.3s ease;
}
.p-step__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.55;
  margin-left: auto;
  align-self: center;
  animation: proc-dot-pulse 3s ease-in-out infinite;
}

.p-step__desc {
  font-size: clamp(14px, 1.05vw, 16px);
  line-height: 1.6;
  color: var(--fg);
  opacity: 0.8;
  margin: 0;
  max-width: 58ch;
}

.p-step__does {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 0 28px;
  justify-content: start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  li {
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.5;
    color: var(--fg);
    opacity: 0.72;
    padding-left: 14px;
    position: relative;
    letter-spacing: 0.02em;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 9px;
      width: 6px;
      height: 1px;
      background: var(--accent);
      opacity: 0.8;
    }
  }
}

.p-step__meta {
  display: inline-flex;
  gap: 10px;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
  letter-spacing: 0.02em;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  align-self: stretch;
}
.p-step__arrow { color: var(--accent); font-family: var(--font-sans); }
.p-step__out { color: var(--accent); font-family: var(--font-sans); font-weight: 500; }

@keyframes proc-dot-pulse {
  0%, 65%, 100% { transform: scale(1); opacity: 0.55; }
  10%  { transform: scale(1.8); opacity: 1; }
  25% { transform: scale(1); opacity: 0.55; }
}

.p-step:hover .p-step__name { color: var(--accent); }
.p-step:hover .p-step__dot { opacity: 1; transform: scale(1.6); animation: none; }

.process__steps:has(.p-step:hover) .p-step:not(:hover) {
  opacity: 0.45;
}
</style>
