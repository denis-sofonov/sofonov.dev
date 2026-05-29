<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'
import SectionMarquee from '../SectionMarquee.vue'
import SectionHeader from '../SectionHeader.vue'

const { t, tm } = useI18n()

interface Item { kicker: string; title: string; desc: string; tech: string }
const items = computed(() => tm('built.items') as Item[])

const sectionRef = ref<HTMLElement | null>(null)
const cardEls = ref<HTMLElement[]>([])
const hoveredIdx = ref<number>(-1)
let entered = false

const marqueeItems = computed(() => [
  t('built.title'),
  `${t('built.label')} · ${String(items.value.length).padStart(2, '0')}`,
  t('built.hint'),
  'bpmn · forms · widgets · pdf · tiptap',
])

onMounted(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !entered) {
        entered = true
        runEntrance()
        io.disconnect()
      }
    }
  }, { threshold: 0.14 })
  if (sectionRef.value) io.observe(sectionRef.value)
})

function runEntrance() {
  const cards = cardEls.value.filter(Boolean)
  gsap.fromTo(cards,
    { y: 26, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    {
      y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
      duration: 0.9, ease: 'expo.out', stagger: { each: 0.07, grid: [2, 3], from: 'start' },
    },
  )
}
</script>

<template>
  <section
    id="built"
    ref="sectionRef"
    class="built"
    data-snap-segments="1"
    data-snap-vp="1"
  >
    <SectionMarquee :items="marqueeItems" reverse />

    <SectionHeader sigil="§ 03" :title="t('built.title')">
      <template #meta>
        <span class="sec-meta-k">{{ t('built.label') }}</span>
        <span class="sec-meta-v">{{ String(items.length).padStart(2, '0') }}</span>
      </template>
    </SectionHeader>

    <!-- Catalog grid — each built system is a spec card. Hovering one lifts it
         and dims the rest, the way the experience ledger reads the room. -->
    <div class="built__grid" :class="{ 'has-hover': hoveredIdx !== -1 }">
      <article
        v-for="(item, i) in items"
        :key="i"
        :ref="(el) => { if (el) cardEls[i] = el as HTMLElement }"
        class="built__card"
        :class="{ 'is-hot': hoveredIdx === i, 'is-dim': hoveredIdx !== -1 && hoveredIdx !== i }"
        @pointerenter="hoveredIdx = i"
        @pointerleave="hoveredIdx = hoveredIdx === i ? -1 : hoveredIdx"
      >
        <header class="built__card-top">
          <span class="built__kicker">{{ item.kicker }}</span>
          <span class="built__n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
        </header>
        <h3 class="built__title">{{ item.title }}</h3>
        <p class="built__desc">{{ item.desc }}</p>
        <div class="built__tech">{{ item.tech }}</div>
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.built {
  position: relative;
  min-height: 100svh;
  padding: 92px 64px 96px;
  background: var(--bg);
  overflow: hidden;
  z-index: 4;
  display: flex;
  flex-direction: column;

  @media (max-width: 1279px) { padding: 92px 48px 88px; }
  @media (max-width: 768px) {
    min-height: auto;
    padding: 76px 20px 88px;
  }
}

.built__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 22px;
  max-width: 1240px;
  width: 100%;
  align-self: center;
  min-height: 0;

  @media (max-width: 1279px) { max-width: 100%; }
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; gap: 12px; }
}

/* ── CARD — one built system ─────────────────────────────────────── */
.built__card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 22px 22px 20px;
  border: 1px solid var(--border);
  background: var(--bg);
  overflow: hidden;
  transition: border-color 0.4s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  will-change: transform, opacity, clip-path;

  /* Accent wash sweeps up from the bottom edge on hover */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &.is-hot {
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    transform: translateY(-4px);
    &::after { transform: scaleX(1); }
  }
  .built__grid.has-hover &.is-dim { opacity: 0.4; }

  @media (max-width: 768px) { padding: 20px 18px 18px; }
}

.built__card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}
.built__kicker {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.9;
  max-width: 70%;
  line-height: 1.4;
}
.built__n {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--muted);
  opacity: 0.5;
  font-variant-numeric: tabular-nums;
}

.built__title {
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: clamp(20px, 1.9vw, 27px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.0;
  color: var(--fg);
}

.built__desc {
  margin: 0 0 18px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--fg);
  opacity: 0.7;
  flex: 1;

  @media (max-width: 1279px) { font-size: 12.5px; }
}

.built__tech {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--muted);
  opacity: 0.65;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
</style>
