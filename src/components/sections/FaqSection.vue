<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onUnmounted, nextTick, watch } from 'vue'
import { animate as anime } from 'animejs'

const { t, tm } = useI18n()

interface Item { q: string; a: string }
const allItems = computed(() => tm('faq.items') as Item[])
const openStates = ref<boolean[]>([])

watch(allItems, (val) => { openStates.value = val.map(() => true) }, { immediate: true })

const leftItems = computed(() =>
  allItems.value.map((item, idx) => ({ item, idx })).filter((_, i) => i % 2 === 0),
)

const rightItems = computed(() =>
  allItems.value.map((item, idx) => ({ item, idx })).filter((_, i) => i % 2 === 1),
)

function toggle(idx: number) {
  openStates.value[idx] = !openStates.value[idx]

  if (openStates.value[idx]) nextTick(() => onExpand(idx))
}

function onExpand(idx: number) {
  const row = document.querySelector<HTMLElement>(`[data-faq-idx="${idx}"]`)
  if (!row) return
  const a = row.querySelector('.faq-row__a')
  if (a) {
    anime(a, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 440,
      ease: 'outQuint',
      delay: 100,
    })
  }
}


onUnmounted(() => {})
</script>

<template>
  <section id="faq" class="faq">
    <div class="faq__marquee" aria-hidden="true" data-parallax="28">
      <div v-for="g in 2" :key="g" class="faq__marquee-track">
        <span v-for="n in 24" :key="n" class="faq__marquee-item">
          <span>{{ t('faq.title') }}</span>
          <span class="faq__marquee-dot">•</span>
        </span>
      </div>
    </div>

    <div class="faq__cols">
      <div class="faq__col">
        <div
          v-for="{ item, idx } in leftItems"
          :key="idx"
          :data-faq-idx="idx"
          class="faq-row"
          :class="{ 'is-open': openStates[idx] }"
          data-reveal="fade-up"
        >
          <button class="faq-row__head" @click="toggle(idx)" :aria-expanded="openStates[idx]">
            <span class="faq-row__idx">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span class="faq-row__q">{{ item.q }}</span>
            <span class="faq-row__plus" aria-hidden="true">
              <span class="faq-row__plus-h" />
              <span class="faq-row__plus-v" />
            </span>
          </button>
          <div class="faq-row__body">
            <div class="faq-row__clip">
              <p class="faq-row__a">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="faq__col">
        <div
          v-for="{ item, idx } in rightItems"
          :key="idx"
          :data-faq-idx="idx"
          class="faq-row"
          :class="{ 'is-open': openStates[idx] }"
          data-reveal="fade-up"
        >
          <button class="faq-row__head" @click="toggle(idx)" :aria-expanded="openStates[idx]">
            <span class="faq-row__idx">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span class="faq-row__q">{{ item.q }}</span>
            <span class="faq-row__plus" aria-hidden="true">
              <span class="faq-row__plus-h" />
              <span class="faq-row__plus-v" />
            </span>
          </button>
          <div class="faq-row__body">
            <div class="faq-row__clip">
              <p class="faq-row__a">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.faq {
  position: relative;
  padding: 60px 0 72px;
  min-height: 100vh;
  min-height: 100dvh;

  @media (max-width: 768px) { padding: 56px 0 56px; }
}

.faq__marquee {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  padding: 0 0 56px;

  @media (max-width: 768px) { padding: 0 0 36px; }
}
.faq__marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: faq-marquee 48s linear infinite;
  gap: 28px;
  padding-right: 28px;
  align-items: center;
}
.faq__marquee-item {
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
.faq__marquee-dot { color: var(--accent); opacity: 0.6; font-size: 6px; }
@keyframes faq-marquee { to { transform: translateX(calc(-100% - 28px)); } }

.faq__cols {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.faq__col {
  display: flex;
  flex-direction: column;
}

.faq-row {
  border-top: 1px solid var(--border);

  .faq__col:last-child &:first-child {
    @media (max-width: 900px) { border-top: none; }
  }
}
.faq__col:first-child .faq-row:last-child,
.faq__col:last-child .faq-row:last-child {
  border-bottom: 1px solid var(--border);
}

.faq-row__head {
  width: 100%;
  display: grid;
  grid-template-columns: 32px 1fr 20px;
  gap: 16px;
  align-items: center;
  padding: 20px 4px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--fg);
  font-family: inherit;
  transition: opacity 0.25s ease;

  &:hover {
    .faq-row__q { color: var(--accent); }
    .faq-row__plus-h, .faq-row__plus-v { background: var(--accent); }
  }

  @media (max-width: 768px) {
    grid-template-columns: 28px 1fr 18px;
    gap: 12px;
    padding: 18px 4px;
  }
}

.faq-row__idx {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  opacity: 0.55;
}

.faq-row__q {
  font-family: var(--font-display);
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.35;
  transition: color 0.3s ease;
}
.faq-row.is-open .faq-row__q { color: var(--accent); }

.faq-row__plus {
  position: relative;
  width: 16px;
  height: 16px;
  justify-self: end;
}
.faq-row__plus-h, .faq-row__plus-v {
  position: absolute;
  top: 50%;
  left: 50%;
  background: var(--fg);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease;
}
.faq-row__plus-h {
  width: 11px;
  height: 1px;
  transform: translate(-50%, -50%);
}
.faq-row__plus-v {
  width: 1px;
  height: 11px;
  transform: translate(-50%, -50%);
}
.faq-row.is-open .faq-row__plus-h,
.faq-row.is-open .faq-row__plus-v { background: var(--accent); }
.faq-row.is-open .faq-row__plus-v {
  transform: translate(-50%, -50%) rotate(90deg);
}

.faq-row__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.faq-row.is-open .faq-row__body {
  grid-template-rows: 1fr;
}
.faq-row__clip {
  overflow: hidden;
  min-height: 0;
}
.faq-row__a {
  font-size: clamp(13.5px, 0.95vw, 14.5px);
  line-height: 1.6;
  color: var(--fg);
  opacity: 0.78;
  margin: 0 0 22px 48px;
  max-width: 56ch;
  will-change: transform, opacity;

  @media (max-width: 768px) {
    margin: 0 0 18px 40px;
  }
}
</style>
