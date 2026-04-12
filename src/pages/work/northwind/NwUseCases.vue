<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Tab { label: string; title: string; desc: string; features: string[] }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)
const activeTab = ref(0)

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-usecases__panel', { y: 50, duration: 1, start: 'top 75%' })
})
</script>

<template>
  <section ref="root" class="nw-usecases">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.usecases.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.usecases.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.usecases.subtitle') }}</p>
    </div>

    <div class="nw-usecases__tabs">
      <button
        v-for="(tab, i) in (tm('northwind.usecases.tabs') as Tab[])"
        :key="i"
        class="nw-usecases__tab"
        :class="{ 'nw-usecases__tab--active': activeTab === i }"
        @click="activeTab = i"
      >
        <span class="nw-usecases__tab-num">0{{ i + 1 }}</span>
        {{ tab.label }}
      </button>
    </div>

    <div class="nw-usecases__panel">
      <div class="nw-usecases__content">
        <h3 class="nw-usecases__title">{{ (tm('northwind.usecases.tabs') as Tab[])[activeTab].title }}</h3>
        <p class="nw-usecases__desc">{{ (tm('northwind.usecases.tabs') as Tab[])[activeTab].desc }}</p>
        <ul class="nw-usecases__features">
          <li v-for="(f, i) in (tm('northwind.usecases.tabs') as Tab[])[activeTab].features" :key="i">
            <span class="nw-usecases__check">✓</span>
            {{ f }}
          </li>
        </ul>
      </div>
      <div class="nw-usecases__visual">
        <!-- Different visual per tab -->
        <div v-if="activeTab === 0" class="nw-usecases__viz">
          <div class="nw-usecases__viz-head">
            <span>FUNNEL · LAST 7 DAYS</span>
            <span class="nw-usecases__viz-pill">PM VIEW</span>
          </div>
          <div class="nw-usecases__bars">
            <div class="nw-usecases__bar" style="width: 100%"><span>Visit landing</span><b>48,291</b></div>
            <div class="nw-usecases__bar" style="width: 64%"><span>Sign up</span><b>30,906</b></div>
            <div class="nw-usecases__bar" style="width: 41%"><span>Activate</span><b>19,799</b></div>
            <div class="nw-usecases__bar" style="width: 28%"><span>Convert</span><b>13,521</b></div>
          </div>
        </div>
        <div v-else-if="activeTab === 1" class="nw-usecases__viz">
          <div class="nw-usecases__viz-head">
            <span>EVENTS API</span>
            <span class="nw-usecases__viz-pill">DEV VIEW</span>
          </div>
          <pre class="nw-usecases__code"><span class="kw">import</span> <span class="op">{</span> Northwind <span class="op">}</span> <span class="kw">from</span> <span class="str">'@northwind/sdk'</span>

<span class="kw">const</span> nw <span class="op">=</span> <span class="kw">new</span> <span class="fn">Northwind</span>(<span class="str">'pk_live'</span>)

nw.<span class="fn">track</span>(<span class="str">'feature_used'</span>, <span class="op">{</span>
  feature: <span class="str">'export_csv'</span>,
  plan: <span class="str">'pro'</span>,
<span class="op">}</span>)</pre>
        </div>
        <div v-else class="nw-usecases__viz">
          <div class="nw-usecases__viz-head">
            <span>FOUNDER DASHBOARD</span>
            <span class="nw-usecases__viz-pill">CEO VIEW</span>
          </div>
          <div class="nw-usecases__kpis">
            <div class="nw-usecases__kpi">
              <div class="nw-usecases__kpi-label">MRR</div>
              <div class="nw-usecases__kpi-value">$248K</div>
              <div class="nw-usecases__kpi-delta">↑ 12.4%</div>
            </div>
            <div class="nw-usecases__kpi">
              <div class="nw-usecases__kpi-label">ARR</div>
              <div class="nw-usecases__kpi-value">$2.97M</div>
              <div class="nw-usecases__kpi-delta">↑ 8.2%</div>
            </div>
            <div class="nw-usecases__kpi">
              <div class="nw-usecases__kpi-label">CHURN</div>
              <div class="nw-usecases__kpi-value">2.4%</div>
              <div class="nw-usecases__kpi-delta nw-usecases__kpi-delta--down">↓ 0.4%</div>
            </div>
            <div class="nw-usecases__kpi">
              <div class="nw-usecases__kpi-label">LTV</div>
              <div class="nw-usecases__kpi-value">$8.4K</div>
              <div class="nw-usecases__kpi-delta">↑ 18.0%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-usecases {
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

.nw-usecases__tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.nw-usecases__tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: $nw-bg-card;
  border: 1px solid $nw-border;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: $nw-fg-muted;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    border-color: $nw-border-bright;
    color: $nw-fg;
  }
}

.nw-usecases__tab--active {
  background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05));
  border-color: $nw-accent;
  color: $nw-accent-bright;
}

.nw-usecases__tab-num {
  font-size: 11px;
  color: $nw-fg-subtle;
  font-weight: 700;

  .nw-usecases__tab--active & { color: $nw-accent; }
}

.nw-usecases__panel {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  background: $nw-bg-card;
  border: 1px solid $nw-border-bright;
  border-radius: 18px;
  padding: 48px;
  align-items: center;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.04),
    0 30px 60px -20px rgba(0,0,0,0.5),
    0 0 80px rgba(0,212,255,0.05);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 28px;
  }
}

.nw-usecases__content { text-align: left; }

.nw-usecases__title {
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 16px;
  color: $nw-fg;
}

.nw-usecases__desc {
  font-size: 16px;
  line-height: 1.55;
  color: $nw-fg-muted;
  margin-bottom: 28px;
}

.nw-usecases__features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    gap: 12px;
    font-size: 14px;
    color: rgba(255,255,255,0.85);
    line-height: 1.4;
  }
}

.nw-usecases__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 212, 255, 0.1);
  color: $nw-accent;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.nw-usecases__visual {
  background: linear-gradient(180deg, $nw-bg-elevated 0%, rgba(0,0,0,0.4) 100%);
  border: 1px solid $nw-border;
  border-radius: 12px;
  padding: 24px;
  min-height: 320px;
}

.nw-usecases__viz {
  text-align: left;
}

.nw-usecases__viz-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-fg-subtle;
  padding-bottom: 16px;
  border-bottom: 1px solid $nw-border;
  margin-bottom: 20px;
}

.nw-usecases__viz-pill {
  background: rgba(0,212,255,0.1);
  color: $nw-accent-bright;
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid rgba(0,212,255,0.2);
}

// PM bars
.nw-usecases__bars {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nw-usecases__bar {
  position: relative;
  height: 32px;
  background: linear-gradient(90deg, $nw-accent, $nw-purple);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 0 20px rgba(0,212,255,0.2);
}

// Dev code
.nw-usecases__code {
  @include nw-mono;
  font-size: 13px;
  color: $nw-fg;
  line-height: 1.7;
  margin: 0;

  .kw { color: $nw-purple; }
  .str { color: $nw-green; }
  .fn { color: $nw-accent-bright; }
  .op { color: $nw-fg-muted; }
}

// Founder KPIs
.nw-usecases__kpis {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.nw-usecases__kpi {
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 18px;
}

.nw-usecases__kpi-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-fg-subtle;
  margin-bottom: 8px;
}

.nw-usecases__kpi-value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: $nw-fg;
  margin-bottom: 4px;
}

.nw-usecases__kpi-delta {
  font-size: 11px;
  font-weight: 600;
  color: $nw-green;
}

.nw-usecases__kpi-delta--down { color: $nw-pink; }
</style>
