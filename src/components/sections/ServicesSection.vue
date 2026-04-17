<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { animate as anime, stagger } from 'animejs'

const { t, tm } = useI18n()

interface Item {
  name: string
  desc: string
  duration: string
  price: string
  includes: string[]
}
const items = computed(() => tm('whatIBuild.items') as Item[])
const openIdx = ref<number | null>(0)
const sectionRef = ref<HTMLElement | null>(null)

function toggle(i: number) {
  if (openIdx.value === i) {
    openIdx.value = null
    return
  }
  openIdx.value = i
  nextTick(() => onExpand(i))
}

function onExpand(i: number) {
  const rows = document.querySelectorAll('.service')
  const service = rows[i] as HTMLElement | undefined
  if (!service) return
  const desc = service.querySelector('.service__desc')
  const incItems = service.querySelectorAll('.service__inc li')
  const meta = service.querySelector('.service__body-meta')

  if (desc) {
    anime(desc, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 420,
      ease: 'outQuint',
      delay: 80,
    })
  }
  if (meta) {
    anime(meta, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 420,
      ease: 'outQuint',
      delay: 120,
    })
  }
  if (incItems.length) {
    anime(incItems, {
      opacity: [0, 1],
      translateX: [14, 0],
      duration: 420,
      ease: 'outQuint',
      delay: stagger(28, { start: 160 }),
    })
  }
}

onMounted(() => {
  nextTick(() => {
    if (openIdx.value !== null) onExpand(openIdx.value)
  })
})

onUnmounted(() => {})
</script>

<template>
  <section ref="sectionRef" id="services" class="services">
    <div class="services__marquee" aria-hidden="true" data-parallax="28">
      <div v-for="g in 2" :key="g" class="services__marquee-track">
        <span v-for="n in 24" :key="n" class="services__marquee-item">
          <span>{{ t('whatIBuild.title') }}</span>
          <span class="services__marquee-dot">•</span>
        </span>
      </div>
    </div>

    <div class="services__list">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="service"
        :class="{ 'is-open': openIdx === i }"
        data-reveal="fade-up"
      >
        <button class="service__head" @click="toggle(i)" :aria-expanded="openIdx === i">
          <span class="service__idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="service__name">{{ item.name }}</span>
          <span class="service__info">
            <span class="service__duration">{{ item.duration }}</span>
            <span class="service__price">{{ item.price }}</span>
          </span>
          <span class="service__plus" aria-hidden="true">
            <span class="service__plus-h" />
            <span class="service__plus-v" />
          </span>
        </button>

        <div class="service__body">
          <div class="service__body-clip">
            <div class="service__body-inner">
              <div class="service__body-col service__body-col--l">
                <p class="service__desc">{{ item.desc }}</p>
                <div class="service__body-meta">
                  <span>{{ item.duration }}</span>
                  <span class="service__body-dot">·</span>
                  <span class="service__body-price">{{ item.price }}</span>
                </div>
              </div>
              <ul class="service__inc">
                <li v-for="(inc, j) in item.includes" :key="j">{{ inc }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.services {
  position: relative;
  padding: 60px 0 72px;
  min-height: 100vh;
  min-height: 100dvh;

  @media (max-width: 768px) { padding: 56px 0 56px; }
}

.services__marquee {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  padding: 0 0 56px;

  @media (max-width: 768px) { padding: 0 0 36px; }
}
.services__marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: svc-marquee 48s linear infinite;
  gap: 28px;
  padding-right: 28px;
  align-items: center;
}
.services__marquee-item {
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
.services__marquee-dot {
  color: var(--accent);
  opacity: 0.6;
  font-size: 6px;
}
@keyframes svc-marquee { to { transform: translateX(calc(-100% - 28px)); } }

.services__list {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) { padding: 0 16px; }
}

.service {
  border-top: 1px solid var(--border);

  &:last-child { border-bottom: 1px solid var(--border); }
}

.service__head {
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr auto 20px;
  gap: 24px;
  align-items: center;
  padding: 22px 4px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--fg);
  font-family: inherit;
  transition: opacity 0.25s ease, padding 0.3s ease;

  &:hover {
    .service__name { color: var(--accent); }
    .service__plus-h, .service__plus-v { background: var(--accent); }
  }

  @media (max-width: 768px) {
    grid-template-columns: 28px 1fr 18px;
    gap: 12px;
    padding: 18px 4px;
  }
}

.service__idx {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  opacity: 0.55;
}

.service__name {
  font-family: var(--font-display);
  font-size: clamp(18px, 1.9vw, 24px);
  font-weight: 500;
  letter-spacing: -0.005em;
  text-transform: lowercase;
  transition: color 0.3s ease;
}
.service.is-open .service__name { color: var(--accent); }

.service__info {
  display: inline-flex;
  gap: 22px;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.02em;

  @media (max-width: 768px) { display: none; }
}
.service__price { color: var(--accent); font-weight: 500; }

.service__plus {
  position: relative;
  width: 18px;
  height: 18px;
  justify-self: end;
}
.service__plus-h, .service__plus-v {
  position: absolute;
  top: 50%;
  left: 50%;
  background: var(--fg);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease;
}
.service__plus-h {
  width: 13px;
  height: 1px;
  transform: translate(-50%, -50%);
}
.service__plus-v {
  width: 1px;
  height: 13px;
  transform: translate(-50%, -50%);
}
.service.is-open .service__plus-h,
.service.is-open .service__plus-v { background: var(--accent); }
.service.is-open .service__plus-v {
  transform: translate(-50%, -50%) rotate(90deg);
}

.service__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.service.is-open .service__body {
  grid-template-rows: 1fr;
}

.service__body-clip {
  overflow: hidden;
  min-height: 0;
}
.service__body-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  padding: 0 4px 28px 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 4px 20px 40px;
  }
}

.service__body-col--l {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.service__desc {
  font-size: clamp(14px, 1.05vw, 16px);
  line-height: 1.6;
  color: var(--fg);
  opacity: 0.8;
  margin: 0;
  max-width: 48ch;
  will-change: transform, opacity;
}

.service__body-meta {
  display: none;
  font-family: var(--font-mono);
  font-size: 12px;
  gap: 8px;
  align-items: baseline;
  color: var(--muted);
  letter-spacing: 0.02em;
  will-change: transform, opacity;

  @media (max-width: 768px) { display: inline-flex; }
}
.service__body-dot { opacity: 0.5; }
.service__body-price { color: var(--accent); font-weight: 500; }

.service__inc {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;

  li {
    font-size: 14px;
    line-height: 1.55;
    color: var(--fg);
    opacity: 0.82;
    padding-left: 14px;
    position: relative;
    will-change: transform, opacity;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      width: 6px;
      height: 1px;
      background: var(--accent);
      opacity: 0.8;
    }
  }
}
</style>
