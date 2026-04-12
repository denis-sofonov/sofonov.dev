<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const tweens: gsap.core.Tween[] = []
const timelines: gsap.core.Timeline[] = []
const time = ref('')
let timeInterval: number | null = null

// Text scramble state — each line shows scrambled chars then resolves
const line1 = ref('')
const line2 = ref('')
const line3 = ref('')
const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function scrambleText(target: ReturnType<typeof ref<string>>, finalText: string, delay: number) {
  const length = finalText.length
  let frame = 0
  const totalFrames = 30 // ~1 second at 30fps
  const resolveSpeed = length / totalFrames

  // Start with random chars
  target.value = Array.from({ length }, () =>
    scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
  ).join('')

  setTimeout(() => {
    const interval = setInterval(() => {
      frame++
      const resolved = Math.floor(frame * resolveSpeed)

      target.value = finalText
        .split('')
        .map((char, i) => {
          if (i < resolved) return char // resolved
          if (char === ' ') return ' '
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        })
        .join('')

      if (frame >= totalFrames) {
        target.value = finalText
        clearInterval(interval)
      }
    }, 33) // ~30fps
  }, delay)
}

function updateTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  time.value = `${h}:${m}:${s}`
}

onMounted(async () => {
  await nextTick()
  if (!root.value) return

  updateTime()
  timeInterval = window.setInterval(updateTime, 1000)

  // Launch text scramble decode for each hero line
  const text1 = t('atelier.hero.line1')
  const text2 = t('atelier.hero.line2')
  const text3 = t('atelier.hero.line3')
  scrambleText(line1, text1, 300)
  scrambleText(line2, text2, 600)
  scrambleText(line3, text3, 900)

  const $ = (s: string) => root.value!.querySelectorAll(s)

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  timelines.push(tl)

  tl
    .fromTo($('.at-hero__eyebrow'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.2 })
    .fromTo($('.at-hero__line'),
      { opacity: 0 },
      { opacity: 1, duration: 0.6, stagger: 0.12 }, '-=0.4')
    .fromTo($('.at-hero__sub'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }, '-=0.3')
    .fromTo($('.at-hero__meta > *'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.6')
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  tweens.forEach((t) => t.kill())
  timelines.forEach((t) => t.kill())
})
</script>

<template>
  <section ref="root" class="at-hero">
    <div class="at-hero__inner">
      <div class="at-hero__eyebrow">{{ t('atelier.hero.eyebrow') }}</div>

      <h1 class="at-hero__title">
        <div class="at-hero__line-wrap">
          <span class="at-hero__line at-hero__line--scramble">{{ line1 || t('atelier.hero.line1') }}</span>
        </div>
        <div class="at-hero__line-wrap">
          <span class="at-hero__line at-hero__line--italic at-hero__line--scramble">{{ line2 || t('atelier.hero.line2') }}</span>
        </div>
        <div class="at-hero__line-wrap">
          <span class="at-hero__line at-hero__line--scramble">{{ line3 || t('atelier.hero.line3') }}</span>
        </div>
      </h1>

      <div class="at-hero__bottom">
        <p class="at-hero__sub">{{ t('atelier.hero.sub') }}</p>
        <div class="at-hero__meta">
          <div class="at-hero__meta-item">
            <div class="at-hero__meta-label">LOCATION</div>
            <div class="at-hero__meta-value">Brooklyn / Berlin · 40°42'N</div>
          </div>
          <div class="at-hero__meta-item">
            <div class="at-hero__meta-label">LOCAL TIME</div>
            <div class="at-hero__meta-value">{{ time }} EST</div>
          </div>
          <div class="at-hero__meta-item">
            <div class="at-hero__meta-label">OUTPUT</div>
            <div class="at-hero__meta-value">40+ projects · 6 humans</div>
          </div>
        </div>
      </div>
    </div>

    <div class="at-hero__scroll">
      <span>↓</span>
      <span>{{ t('atelier.hero.scroll') }}</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 140px 40px 60px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 100px 20px 40px;
  }
}

.at-hero__inner {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.at-hero__eyebrow {
  @include at-eyebrow;
  margin-bottom: 60px;
}

.at-hero__title {
  @include at-display;
  font-size: clamp(60px, 13vw, 220px);
  line-height: 0.86;
  letter-spacing: -0.05em;
  font-weight: 500;
  color: $at-fg;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
}

.at-hero__line-wrap {
  display: block;
  overflow: hidden;
}

.at-hero__line {
  display: inline-block;
}

.at-hero__line--italic {
  @include at-display-italic;
  position: relative;
  padding-right: 0.1em;

  &::after {
    content: '';
    display: inline-block;
    width: 0.4em;
    height: 0.4em;
    background: $at-accent;
    border-radius: 50%;
    margin-left: 0.15em;
    vertical-align: middle;
  }
}

.at-hero__bottom {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: end;
  padding-top: 40px;
  border-top: 1px solid $at-border-bright;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.at-hero__sub {
  @include at-sans;
  font-size: clamp(15px, 1.2vw, 18px);
  line-height: 1.6;
  color: $at-fg-muted;
  max-width: 480px;
  font-weight: 400;
}

.at-hero__meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.at-hero__meta-label {
  @include at-mono;
  font-size: 10px;
  font-weight: 500;
  color: $at-fg-subtle;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.at-hero__meta-value {
  @include at-mono;
  font-size: 13px;
  color: $at-fg;
}

.at-hero__scroll {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  @include at-mono;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $at-fg;
  writing-mode: vertical-rl;
  animation: atScrollPulse 2s ease-in-out infinite;

  @media (max-width: 1100px) { display: none; }
}

@keyframes atScrollPulse {
  0%, 100% { transform: translateY(-50%) translateY(0); }
  50% { transform: translateY(-50%) translateY(8px); }
}
</style>
