<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

interface Wine { producer: string; wine: string; region: string; glass: string; bottle: string }
interface Category { name: string; items: Wine[] }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)
const expandedWine = ref<string | null>(null)

function toggleWine(id: string) {
  expandedWine.value = expandedWine.value === id ? null : id
}

// Tasting notes — fake but realistic
const tastingNotes: Record<string, string> = {
  '450 SLM': 'Crisp, mineral, tiny bubbles. Green apple and white flowers. Drink ice cold.',
  'Ci Confonde': 'Funky, dry, cidery. Wild ferment character. Challenging in the best way.',
  'Sivi': 'Deep amber. Honey, dried apricot, walnut skin. Textured, long finish.',
  'Faugères Blanc': 'Bright citrus, garrigue herbs. Clean and precise. Great with oysters.',
  'Pithos Bianco': 'Amphora-aged, oxidative edge. Golden, nutty, complex.',
  'Susucaru Rosso': 'Light, electric, volcanic. Cherry, blood orange, crushed rock.',
  'Morgon Côte du Py': 'Deep Gamay. Dark fruit, granite, earth. Serious wine.',
  'Bianchello': 'Skin-contact red. Tannic, savory, meaty. Needs food.',
}

onMounted(async () => {
  await nextTick()
  // Slow elegant reveal for header
  reveal('.lu-wines__head > *', { y: 40, stagger: 0.15, duration: 1.8, start: 'top 80%', ease: 'power2.out' })
  // Each wine item staggers independently with horizontal slide
  reveal('.lu-wines__cat-head', { x: -30, y: 0, stagger: 0.2, duration: 1.4, start: 'top 85%' })
  reveal('.lu-wines__item', { y: 30, stagger: 0.06, duration: 1.2, start: 'top 85%', ease: 'power2.out' })
})
</script>

<template>
  <section ref="root" id="wine" class="lu-wines">
    <div class="lu-wines__inner">
      <div class="lu-wines__head">
        <div class="lu-wines__eyebrow">{{ t('lumen.wines.eyebrow') }}</div>
        <h2 class="lu-wines__title">{{ t('lumen.wines.title') }}</h2>
        <p class="lu-wines__sub">{{ t('lumen.wines.subtitle') }}</p>
      </div>

      <div class="lu-wines__list">
        <div
          v-for="(cat, i) in (tm('lumen.wines.categories') as Category[])"
          :key="i"
          class="lu-wines__category"
        >
          <div class="lu-wines__cat-head">
            <h3 class="lu-wines__cat-name">{{ cat.name }}</h3>
            <div class="lu-wines__cat-cols">
              <span>GLASS</span>
              <span>BOTTLE</span>
            </div>
          </div>

          <div class="lu-wines__items">
            <div
              v-for="(w, j) in cat.items"
              :key="j"
              class="lu-wines__item"
              :class="{ 'lu-wines__item--open': expandedWine === w.wine }"
              @click="toggleWine(w.wine)"
            >
              <div class="lu-wines__item-row">
                <div class="lu-wines__item-info">
                  <div class="lu-wines__producer">{{ w.producer }}</div>
                  <div class="lu-wines__wine-name">{{ w.wine }}</div>
                  <div class="lu-wines__region">{{ w.region }}</div>
                </div>
                <div class="lu-wines__prices">
                  <div class="lu-wines__price">${{ w.glass }}</div>
                  <div class="lu-wines__price">${{ w.bottle }}</div>
                </div>
              </div>
              <div v-if="expandedWine === w.wine && tastingNotes[w.wine]" class="lu-wines__notes">
                {{ tastingNotes[w.wine] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.lu-wines {
  @include lu-section-padding;
  background: $lu-bg;
}

.lu-wines__inner {
  max-width: 980px;
  margin: 0 auto;
}

.lu-wines__head {
  text-align: center;
  margin-bottom: 100px;

  @media (max-width: 768px) { margin-bottom: 60px; }
}

.lu-wines__eyebrow { @include lu-eyebrow; }

.lu-wines__title {
  @include lu-display;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: $lu-fg;
  margin-bottom: 24px;
}

.lu-wines__sub {
  @include lu-sans;
  font-size: 15px;
  line-height: 1.7;
  color: $lu-fg-muted;
  max-width: 540px;
  margin: 0 auto;
}

.lu-wines__list {
  display: flex;
  flex-direction: column;
  gap: 80px;

  @media (max-width: 768px) { gap: 56px; }
}

.lu-wines__category { }

.lu-wines__cat-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid $lu-border-bright;
}

.lu-wines__cat-name {
  @include lu-display-italic;
  font-size: clamp(24px, 3vw, 36px);
  color: $lu-gold;
  font-weight: 400;
}

.lu-wines__cat-cols {
  display: flex;
  gap: 60px;
  @include lu-sans;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: $lu-fg-subtle;

  span {
    width: 60px;
    text-align: right;
  }

  @media (max-width: 600px) {
    gap: 24px;
    span { width: 40px; }
  }
}

.lu-wines__items {
  display: flex;
  flex-direction: column;
}

.lu-wines__item {
  padding: 24px 0;
  border-bottom: 1px solid $lu-border;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: $lu-gold;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    .lu-wines__producer { color: $lu-gold; }
    &::after { transform: scaleX(1); }
  }
}

.lu-wines__item-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.lu-wines__item-info { flex: 1; }

.lu-wines__notes {
  @include lu-display-italic;
  font-size: 14px;
  color: $lu-gold;
  margin-top: 12px;
  padding-left: 0;
  line-height: 1.5;
  animation: luNoteIn 0.4s ease;
}

@keyframes luNoteIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.lu-wines__item--open {
  .lu-wines__producer { color: $lu-gold; }
}

.lu-wines__producer {
  @include lu-sans;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: $lu-fg-subtle;
  margin-bottom: 6px;
  transition: color 0.3s ease;
}

.lu-wines__wine-name {
  @include lu-display;
  font-size: clamp(20px, 2.4vw, 28px);
  color: $lu-fg;
  line-height: 1.2;
  margin-bottom: 4px;
}

.lu-wines__region {
  @include lu-display-italic;
  font-size: 14px;
  color: $lu-fg-muted;
}

.lu-wines__prices {
  display: flex;
  gap: 60px;
  @include lu-display;
  font-size: 22px;
  color: $lu-fg;
  font-variant-numeric: tabular-nums;

  @media (max-width: 600px) { gap: 24px; }
}

.lu-wines__price {
  width: 60px;
  text-align: right;

  @media (max-width: 600px) { width: 40px; font-size: 18px; }
}
</style>
