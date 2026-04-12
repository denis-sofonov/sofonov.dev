<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Plan {
  name: string
  price: string
  period: string
  desc: string
  features: string[]
  cta: string
  highlight?: boolean
}

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)
const isAnnual = ref(false)

// Adjust price based on toggle (just visual — multiply by 0.8 for annual)
function priceFor(plan: Plan): string {
  if (!isAnnual.value) return plan.price
  if (plan.price === '$0' || plan.price === 'Custom' || plan.price === 'По запросу') return plan.price
  // Extract number, multiply by 0.8, round
  const num = parseInt(plan.price.replace(/\D/g, ''), 10)
  if (isNaN(num)) return plan.price
  return '$' + Math.round(num * 0.8)
}

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-plan', { y: 60, stagger: 0.12, duration: 0.9, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="pricing" class="nw-pricing">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.pricing.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.pricing.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.pricing.subtitle') }}</p>
    </div>

    <div class="nw-pricing__toggle">
      <button
        class="nw-pricing__toggle-btn"
        :class="{ 'nw-pricing__toggle-btn--active': !isAnnual }"
        @click="isAnnual = false"
      >{{ t('northwind.pricingToggle.monthly') }}</button>
      <button
        class="nw-pricing__toggle-btn"
        :class="{ 'nw-pricing__toggle-btn--active': isAnnual }"
        @click="isAnnual = true"
      >
        {{ t('northwind.pricingToggle.annual') }}
        <span class="nw-pricing__save">{{ t('northwind.pricingToggle.save') }}</span>
      </button>
    </div>

    <div class="nw-pricing__grid">
      <div
        v-for="(plan, i) in (tm('northwind.pricing.plans') as Plan[])"
        :key="i"
        class="nw-plan"
        :class="{ 'nw-plan--highlight': plan.highlight }"
      >
        <div v-if="plan.highlight" class="nw-plan__badge">MOST POPULAR</div>
        <div class="nw-plan__name">{{ plan.name }}</div>
        <div class="nw-plan__price">
          <span class="nw-plan__amount">{{ priceFor(plan) }}</span>
          <span class="nw-plan__period">/ {{ plan.period }}</span>
        </div>
        <p class="nw-plan__desc">{{ plan.desc }}</p>
        <a href="#" class="nw-plan__cta" :class="{ 'nw-plan__cta--primary': plan.highlight }">
          {{ plan.cta }}
          <span>→</span>
        </a>
        <ul class="nw-plan__features">
          <li v-for="f in plan.features" :key="f">
            <span class="nw-plan__check">✓</span>
            {{ f }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-pricing {
  padding: 80px 24px 160px;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-pricing__toggle {
  display: inline-flex;
  margin: 0 auto 48px;
  background: $nw-bg-card;
  border: 1px solid $nw-border-bright;
  border-radius: 100px;
  padding: 4px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.nw-pricing__toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  color: $nw-fg-muted;
  background: none;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover { color: $nw-fg; }
}

.nw-pricing__toggle-btn--active {
  background: linear-gradient(135deg, $nw-accent, $nw-accent-bright);
  color: #050507;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.3),
    0 4px 16px rgba(0,212,255,0.25);
}

.nw-pricing__save {
  font-size: 10px;
  font-weight: 700;
  background: rgba(0, 255, 170, 0.2);
  color: $nw-green;
  padding: 2px 8px;
  border-radius: 100px;

  .nw-pricing__toggle-btn--active & {
    background: rgba(5, 5, 7, 0.2);
    color: #050507;
  }
}

.nw-pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
}

.nw-plan {
  background: $nw-bg-card;
  border: 1px solid $nw-border;
  border-radius: 18px;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    border-color: $nw-border-bright;
    transform: translateY(-3px);
  }
}

.nw-plan--highlight {
  border-color: rgba(0,212,255,0.5);
  background: linear-gradient(180deg, rgba(0,212,255,0.06) 0%, $nw-bg-card 50%);
  box-shadow:
    0 0 0 1px rgba(0,212,255,0.4),
    0 30px 80px -20px $nw-accent-glow;

  &:hover {
    box-shadow:
      0 0 0 1px $nw-accent,
      0 40px 100px -20px $nw-accent-glow;
  }
}

.nw-plan__badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, $nw-accent, $nw-accent-bright);
  color: #050507;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 5px 12px;
  border-radius: 100px;
  white-space: nowrap;
}

.nw-plan__name {
  font-size: 14px;
  font-weight: 600;
  color: $nw-accent-bright;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.nw-plan__price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.nw-plan__amount {
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  color: $nw-fg;
}

.nw-plan__period { font-size: 14px; color: $nw-fg-muted; }

.nw-plan__desc {
  font-size: 14px;
  color: $nw-fg-muted;
  line-height: 1.5;
  margin-bottom: 28px;
}

.nw-plan__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  background: rgba(255,255,255,0.04);
  color: $nw-fg;
  border: 1px solid $nw-border-bright;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: $nw-accent;
  }
}

.nw-plan__cta--primary {
  background: linear-gradient(180deg, #ffffff 0%, #d8d8e0 100%);
  color: #050507;
  border-color: transparent;

  &:hover {
    background: linear-gradient(180deg, $nw-accent-bright 0%, $nw-accent 100%);
    color: #050507;
  }
}

.nw-plan__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
  padding: 28px 0 0;
  border-top: 1px solid $nw-border;
  flex: 1;

  li {
    display: flex;
    gap: 10px;
    font-size: 14px;
    color: rgba(255,255,255,0.85);
    line-height: 1.4;
  }
}

.nw-plan__check {
  color: $nw-accent;
  font-weight: 700;
  flex-shrink: 0;
}
</style>
