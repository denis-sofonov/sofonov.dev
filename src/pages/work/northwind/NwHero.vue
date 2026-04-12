<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import NwLogoMarquee from './NwLogoMarquee.vue'

const { t } = useI18n()

const root = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const liveCount = ref(0)
const targetCount = 2847391
let liveInterval: number | null = null
const tweens: gsap.core.Tween[] = []
const timelines: gsap.core.Timeline[] = []

function magneticHover(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  gsap.to(target, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' })
}

function magneticLeave(e: MouseEvent) {
  gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
}

// Split title into character spans
function splitText(el: HTMLElement) {
  const text = el.textContent || ''
  el.innerHTML = ''
  const words = text.split(' ')
  words.forEach((word, wi) => {
    const wordSpan = document.createElement('span')
    wordSpan.classList.add('split-word')
    word.split('').forEach((char) => {
      const charSpan = document.createElement('span')
      charSpan.textContent = char
      charSpan.classList.add('split-char')
      wordSpan.appendChild(charSpan)
    })
    el.appendChild(wordSpan)
    if (wi < words.length - 1) {
      el.appendChild(document.createTextNode('\u00A0'))
    }
  })
}

onMounted(async () => {
  await nextTick()
  if (!root.value) return

  // Live counter
  setTimeout(() => {
    const counter = { value: 0 }
    const t = gsap.to(counter, {
      value: targetCount,
      duration: 2.4,
      ease: 'power2.out',
      onUpdate: () => { liveCount.value = Math.floor(counter.value) },
      onComplete: () => {
        liveInterval = window.setInterval(() => {
          liveCount.value += Math.floor(Math.random() * 47) + 3
        }, 700)
      },
    })
    tweens.push(t)
  }, 600)

  // Split title
  if (titleEl.value) splitText(titleEl.value)

  // Hero entrance — using fromTo so elements always end visible
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  timelines.push(tl)

  const $ = (sel: string) => root.value!.querySelectorAll(sel)

  tl
    .fromTo($('.nw-badge'),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.15 })
    .fromTo($('.split-char'),
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.9, stagger: 0.018, ease: 'power4.out' },
      '-=0.3')
    .fromTo($('.nw-hero__sub'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }, '-=0.6')
    .fromTo($('.nw-hero__ctas > *'),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.5')
    .fromTo($('.nw-hero__nocard'),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
    .fromTo($('.nw-hero__mockup'),
      { y: 100, opacity: 0, scale: 0.94, rotateX: 12 },
      { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.4, ease: 'power4.out' },
      '-=0.7')
    .fromTo($('.nw-trust'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')

  // Floating glows
  tweens.push(
    gsap.to($('.nw-hero__glow--1'), { x: 80, y: 40, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
    gsap.to($('.nw-hero__glow--2'), { x: -60, y: 60, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
    gsap.to($('.nw-hero__glow--3'), { x: 40, y: -40, duration: 13, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
  )

  // Floating UI cards — entrance + sine drift
  const floats = $('.nw-float')
  if (floats.length) {
    gsap.fromTo(floats,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.12, delay: 1.4, ease: 'power3.out' })

    floats.forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1
      tweens.push(
        gsap.to(el, {
          y: 12 * dir,
          duration: 4 + i * 0.7,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        }),
      )
    })
  }
})

onUnmounted(() => {
  if (liveInterval) clearInterval(liveInterval)
  tweens.forEach((t) => t.kill())
  timelines.forEach((t) => t.kill())
})
</script>

<template>
  <section ref="root" class="nw-hero">
    <div class="nw-hero__bg">
      <div class="nw-hero__glow nw-hero__glow--1"></div>
      <div class="nw-hero__glow nw-hero__glow--2"></div>
      <div class="nw-hero__glow nw-hero__glow--3"></div>
      <div class="nw-hero__grid"></div>
    </div>

    <!-- Floating UI elements around hero -->
    <div class="nw-hero__floats" aria-hidden="true">
      <div class="nw-float nw-float--1">
        <div class="nw-float__head">
          <span class="nw-float__dot nw-float__dot--green"></span>
          NEW SIGNUP
        </div>
        <div class="nw-float__big">user_8a3f</div>
        <div class="nw-float__small">2s ago · /pricing</div>
      </div>

      <div class="nw-float nw-float--2">
        <div class="nw-float__head">
          <span class="nw-float__dot nw-float__dot--cyan"></span>
          REVENUE
        </div>
        <div class="nw-float__big">$48,291</div>
        <div class="nw-float__delta">↑ 12.4% today</div>
      </div>

      <div class="nw-float nw-float--3">
        <div class="nw-float__code">
          <span class="nw-float__kw">nw</span>.<span class="nw-float__fn">track</span>(<span class="nw-float__str">'click'</span>)
        </div>
      </div>

      <div class="nw-float nw-float--4">
        <div class="nw-float__head">
          <span class="nw-float__dot nw-float__dot--pink"></span>
          ALERT
        </div>
        <div class="nw-float__big">+240%</div>
        <div class="nw-float__small">Traffic spike</div>
      </div>
    </div>

    <div class="nw-hero__inner">
      <a href="#" class="nw-badge">
        <span class="nw-badge__pill">NEW</span>
        {{ t('northwind.hero.badge') }}
        <span class="nw-badge__arrow">→</span>
      </a>

      <h1 ref="titleEl" class="nw-hero__title">{{ t('northwind.hero.title') }}</h1>

      <p class="nw-hero__sub">{{ t('northwind.hero.subtitle') }}</p>

      <div class="nw-hero__ctas">
        <a
          href="#"
          class="nw-btn nw-btn--primary nw-btn--lg"
          @mousemove="magneticHover"
          @mouseleave="magneticLeave"
        >
          {{ t('northwind.hero.ctaPrimary') }}
          <span>→</span>
        </a>
        <a href="#" class="nw-btn nw-btn--ghost nw-btn--lg">
          <span class="nw-btn__play">▶</span>
          {{ t('northwind.hero.ctaSecondary') }}
        </a>
      </div>

      <div class="nw-hero__nocard">{{ t('northwind.hero.noCard') }}</div>
    </div>

    <!-- Mockup -->
    <div class="nw-hero__mockup">
      <div class="nw-mockup">
        <div class="nw-mockup__bar">
          <div class="nw-mockup__dots">
            <span></span><span></span><span></span>
          </div>
          <div class="nw-mockup__url">
            <span class="nw-mockup__url-icon">⚲</span>
            app.northwind.io / dashboard / overview
          </div>
          <div class="nw-mockup__live">
            <span class="nw-mockup__live-dot"></span>
            LIVE
          </div>
        </div>
        <div class="nw-mockup__body">
          <aside class="nw-mockup__side">
            <div class="nw-mockup__side-section">
              <div class="nw-mockup__side-label">PROJECT</div>
              <div class="nw-mockup__project">
                <span class="nw-mockup__project-mark">◆</span>
                Acme Production
                <span class="nw-mockup__chevron">⌄</span>
              </div>
            </div>
            <div class="nw-mockup__side-section">
              <div class="nw-mockup__side-label">WORKSPACE</div>
              <div class="nw-mockup__side-item nw-mockup__side-item--active">
                <span class="nw-mockup__side-icon">◐</span> Overview
              </div>
              <div class="nw-mockup__side-item"><span class="nw-mockup__side-icon">▤</span> Events</div>
              <div class="nw-mockup__side-item"><span class="nw-mockup__side-icon">▥</span> Funnels</div>
              <div class="nw-mockup__side-item"><span class="nw-mockup__side-icon">◫</span> Cohorts</div>
              <div class="nw-mockup__side-item"><span class="nw-mockup__side-icon">⊙</span> Sessions</div>
              <div class="nw-mockup__side-item">
                <span class="nw-mockup__side-icon">◈</span> Alerts
                <span class="nw-mockup__badge">3</span>
              </div>
            </div>
            <div class="nw-mockup__side-section">
              <div class="nw-mockup__side-label">TEAM</div>
              <div class="nw-mockup__avatars">
                <span class="nw-mockup__avatar" style="background: linear-gradient(135deg, #00d4ff, #0099ff)">SC</span>
                <span class="nw-mockup__avatar" style="background: linear-gradient(135deg, #ff3366, #ff6699)">MW</span>
                <span class="nw-mockup__avatar" style="background: linear-gradient(135deg, #00ffaa, #00cc99)">PS</span>
                <span class="nw-mockup__avatar nw-mockup__avatar--more">+5</span>
              </div>
            </div>
          </aside>
          <main class="nw-mockup__main">
            <div class="nw-mockup__main-head">
              <div>
                <div class="nw-mockup__breadcrumb">Acme Production / Overview</div>
                <h3 class="nw-mockup__page-title">Last 24 hours</h3>
              </div>
              <div class="nw-mockup__filters">
                <span class="nw-mockup__filter nw-mockup__filter--active">24H</span>
                <span class="nw-mockup__filter">7D</span>
                <span class="nw-mockup__filter">30D</span>
                <span class="nw-mockup__filter">90D</span>
              </div>
            </div>
            <div class="nw-mockup__stats">
              <div class="nw-mock-stat">
                <div class="nw-mock-stat__label">EVENTS / 24H</div>
                <div class="nw-mock-stat__value">{{ liveCount.toLocaleString('en-US') }}</div>
                <div class="nw-mock-stat__delta nw-mock-stat__delta--up">↑ 12.4% vs yesterday</div>
                <div class="nw-mock-stat__sparkline">
                  <svg viewBox="0 0 80 24"><polyline points="0,18 10,15 20,16 30,12 40,14 50,8 60,10 70,5 80,6" fill="none" stroke="#00d4ff" stroke-width="1.5" /></svg>
                </div>
              </div>
              <div class="nw-mock-stat">
                <div class="nw-mock-stat__label">ACTIVE USERS</div>
                <div class="nw-mock-stat__value">48,291</div>
                <div class="nw-mock-stat__delta nw-mock-stat__delta--up">↑ 8.2% vs yesterday</div>
                <div class="nw-mock-stat__sparkline">
                  <svg viewBox="0 0 80 24"><polyline points="0,16 10,18 20,14 30,15 40,11 50,12 60,8 70,9 80,5" fill="none" stroke="#00d4ff" stroke-width="1.5" /></svg>
                </div>
              </div>
              <div class="nw-mock-stat">
                <div class="nw-mock-stat__label">CONVERSION</div>
                <div class="nw-mock-stat__value">3.84%</div>
                <div class="nw-mock-stat__delta nw-mock-stat__delta--down">↓ 0.4% vs yesterday</div>
                <div class="nw-mock-stat__sparkline">
                  <svg viewBox="0 0 80 24"><polyline points="0,8 10,10 20,7 30,9 40,12 50,11 60,14 70,13 80,15" fill="none" stroke="#ff6b9d" stroke-width="1.5" /></svg>
                </div>
              </div>
            </div>
            <div class="nw-mockup__chart">
              <div class="nw-mockup__chart-head">
                <span class="nw-mockup__chart-title">Events over time</span>
                <div class="nw-mockup__chart-legend">
                  <span><i style="background: #00d4ff"></i>Pageviews</span>
                  <span><i style="background: #ff3366"></i>Signups</span>
                </div>
              </div>
              <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="nwGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.5" />
                    <stop offset="100%" stop-color="#00d4ff" stop-opacity="0" />
                  </linearGradient>
                  <linearGradient id="nwGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ff3366" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#ff3366" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
                  <line x1="0" y1="40" x2="600" y2="40" />
                  <line x1="0" y1="80" x2="600" y2="80" />
                  <line x1="0" y1="120" x2="600" y2="120" />
                </g>
                <path d="M0,140 L40,125 L80,135 L120,95 L160,105 L200,70 L240,85 L280,50 L320,65 L360,30 L400,45 L440,25 L480,40 L520,18 L560,28 L600,12 L600,180 L0,180 Z" fill="url(#nwGrad1)" />
                <path d="M0,140 L40,125 L80,135 L120,95 L160,105 L200,70 L240,85 L280,50 L320,65 L360,30 L400,45 L440,25 L480,40 L520,18 L560,28 L600,12" fill="none" stroke="#00d4ff" stroke-width="2" />
                <path d="M0,160 L40,155 L80,150 L120,148 L160,140 L200,135 L240,130 L280,128 L320,120 L360,118 L400,115 L440,108 L480,105 L520,98 L560,95 L600,88 L600,180 L0,180 Z" fill="url(#nwGrad2)" />
                <path d="M0,160 L40,155 L80,150 L120,148 L160,140 L200,135 L240,130 L280,128 L320,120 L360,118 L400,115 L440,108 L480,105 L520,98 L560,95 L600,88" fill="none" stroke="#ff3366" stroke-width="2" />
              </svg>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Trust marquee -->
    <div class="nw-trust">
      <div class="nw-trust__label">{{ t('northwind.hero.usedBy') }}</div>
      <NwLogoMarquee />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-hero {
  position: relative;
  padding: 80px 24px 0;
  text-align: center;
  overflow: hidden;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 0; }
}

.nw-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.nw-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.nw-hero__glow--1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(0,212,255,0.45) 0%, transparent 70%);
  top: -250px; left: 50%; transform: translateX(-50%);
}
.nw-hero__glow--2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(255,51,102,0.3) 0%, transparent 70%);
  top: 100px; right: 5%;
}
.nw-hero__glow--3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%);
  top: 200px; left: 5%;
}

.nw-hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at center top, black 20%, transparent 65%);
}

// ============================================
// FLOATING UI ELEMENTS — depth around hero
// ============================================
.nw-hero__floats {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;

  @media (max-width: 1100px) { display: none; }
}

.nw-float {
  position: absolute;
  background: rgba(14, 14, 22, 0.7);
  border: 1px solid $nw-border-bright;
  border-radius: 12px;
  padding: 14px 18px;
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 20px 50px -10px rgba(0,0,0,0.6),
    0 0 30px rgba(0,212,255,0.1);
  text-align: left;
  min-width: 180px;
}

.nw-float--1 { top: 200px; left: 6%; }
.nw-float--2 { top: 380px; left: 4%; }
.nw-float--3 { top: 220px; right: 5%; }
.nw-float--4 { top: 400px; right: 7%; }

.nw-float__head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-fg-subtle;
  margin-bottom: 6px;
}

.nw-float__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.nw-float__dot--green { background: $nw-green; box-shadow: 0 0 6px $nw-green; }
.nw-float__dot--cyan { background: $nw-accent; box-shadow: 0 0 6px $nw-accent; }
.nw-float__dot--pink { background: $nw-pink; box-shadow: 0 0 6px $nw-pink; }

.nw-float__big {
  font-size: 18px;
  font-weight: 700;
  color: $nw-fg;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.nw-float__small {
  font-size: 11px;
  color: $nw-fg-muted;
  margin-top: 2px;
}

.nw-float__delta {
  font-size: 11px;
  color: $nw-green;
  font-weight: 600;
  margin-top: 2px;
}

.nw-float__code {
  @include nw-mono;
  font-size: 12px;
  color: $nw-fg;
  white-space: nowrap;
}

.nw-float__kw { color: $nw-purple; }
.nw-float__fn { color: $nw-accent-bright; }
.nw-float__str { color: $nw-green; }

.nw-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 920px;
  margin: 0 auto;
  padding-top: 60px;
}

.nw-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 14px 6px 6px;
  background: rgba(255,255,255,0.04);
  border: 1px solid $nw-border-bright;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: $nw-fg;
  text-decoration: none;
  margin-bottom: 36px;
  backdrop-filter: blur(10px);
  opacity: 0; // hidden until GSAP animates

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: $nw-accent;
  }
}

.nw-badge__pill {
  background: linear-gradient(135deg, $nw-accent, $nw-pink);
  color: #050507;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 100px;
}

.nw-badge__arrow { font-size: 11px; opacity: 0.6; }

.nw-hero__title {
  font-size: clamp(40px, 6.5vw, 88px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 28px;
  color: #ffffff;
  max-width: 920px;
  margin-left: auto;
  margin-right: auto;
}

// Split-text spans created by splitText() at runtime
:deep(.split-word) {
  display: inline-block;
  color: #ffffff;
}

:deep(.split-char) {
  display: inline-block;
  color: #ffffff;
  opacity: 0; // hidden until GSAP split-text reveal
}

.nw-hero__sub {
  font-size: clamp(16px, 1.7vw, 21px);
  color: $nw-fg-muted;
  line-height: 1.55;
  max-width: 680px;
  margin: 0 auto 44px;
  font-weight: 400;
  text-wrap: balance;
  opacity: 0;
}

.nw-hero__ctas {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;

  & > * { opacity: 0; }
}

.nw-hero__nocard {
  font-size: 13px;
  color: $nw-fg-subtle;
  margin-bottom: 80px;
  opacity: 0;
}

// Buttons (local to hero — primary + ghost)
.nw-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  text-decoration: none;
  letter-spacing: -0.01em;

  span:not([class]) { transition: transform 0.2s ease; }
  &:hover span:not([class]) { transform: translateX(4px); }
}

.nw-btn--lg { padding: 16px 28px; font-size: 15px; border-radius: 12px; }

.nw-btn--primary {
  background: linear-gradient(180deg, #ffffff 0%, #d8d8e0 100%);
  color: #050507;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.6),
    0 0 0 1px rgba(255,255,255,0.1),
    0 8px 24px rgba(0,212,255,0.15);

  &:hover {
    background: linear-gradient(180deg, $nw-accent-bright 0%, $nw-accent 100%);
    color: #050507;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.4),
      0 0 0 1px rgba(0,212,255,0.4),
      0 12px 40px $nw-accent-glow;
  }
}

.nw-btn--ghost {
  background: rgba(255,255,255,0.04);
  color: $nw-fg;
  border-color: $nw-border-bright;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: $nw-accent;
  }
}

.nw-btn__play { font-size: 9px; color: $nw-accent; }

// Trust
.nw-trust {
  margin-top: 100px;
  padding-bottom: 60px;
  position: relative;
  z-index: 2;
  opacity: 0;
}

.nw-trust__label {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: $nw-fg-subtle;
  margin-bottom: 32px;
}

// Mockup
.nw-hero__mockup {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  perspective: 2000px;
  opacity: 0;
}

.nw-mockup {
  background: linear-gradient(180deg, $nw-bg-elevated 0%, $nw-bg-alt 100%);
  border: 1px solid $nw-border-bright;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.05),
    0 0 0 1px rgba(255,255,255,0.04),
    0 60px 120px -30px rgba(0,0,0,0.9),
    0 0 100px rgba(0,212,255,0.2);
}

.nw-mockup__bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid $nw-border;
}

.nw-mockup__dots {
  display: flex; gap: 7px;
  span { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.12); }
}

.nw-mockup__url {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: $nw-fg-muted;
  background: rgba(255,255,255,0.04);
  border: 1px solid $nw-border;
  border-radius: 8px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  @include nw-mono;
}

.nw-mockup__url-icon { color: $nw-green; font-size: 10px; }

.nw-mockup__live {
  display: flex; align-items: center; gap: 6px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
  color: $nw-green;
}

.nw-mockup__live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: $nw-green;
  box-shadow: 0 0 8px $nw-green;
  animation: nwPulse 1.5s ease-in-out infinite;
}

@keyframes nwPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.nw-mockup__body { display: flex; min-height: 460px; }

.nw-mockup__side {
  width: 220px;
  border-right: 1px solid $nw-border;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(0,0,0,0.2);
  text-align: left;

  @media (max-width: 700px) { display: none; }
}

.nw-mockup__side-section { display: flex; flex-direction: column; gap: 6px; }

.nw-mockup__side-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-fg-subtle;
  padding: 0 8px;
  margin-bottom: 4px;
}

.nw-mockup__project {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 6px;
  color: $nw-fg;
}

.nw-mockup__project-mark { color: $nw-accent; font-size: 11px; }
.nw-mockup__chevron { margin-left: auto; opacity: 0.5; font-size: 10px; }

.nw-mockup__side-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: $nw-fg-muted;
  padding: 7px 10px;
  border-radius: 6px;
}

.nw-mockup__side-item--active {
  background: rgba(0,212,255,0.1);
  color: $nw-accent-bright;
}

.nw-mockup__side-icon { font-size: 12px; opacity: 0.8; }

.nw-mockup__badge {
  margin-left: auto;
  font-size: 10px;
  background: $nw-pink;
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
}

.nw-mockup__avatars {
  display: flex;
  padding: 0 8px;
  & > * + * { margin-left: -6px; }
}

.nw-mockup__avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  border: 2px solid $nw-bg-alt;
}

.nw-mockup__avatar--more {
  background: $nw-bg-elevated;
  color: $nw-fg-muted;
  font-size: 9px;
}

.nw-mockup__main {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  text-align: left;
}

.nw-mockup__main-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.nw-mockup__breadcrumb {
  font-size: 11px;
  color: $nw-fg-subtle;
  margin-bottom: 4px;
}

.nw-mockup__page-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: $nw-fg;
}

.nw-mockup__filters { display: flex; gap: 4px; }

.nw-mockup__filter {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  color: $nw-fg-muted;
  background: rgba(255,255,255,0.03);
  border: 1px solid $nw-border;
}

.nw-mockup__filter--active {
  background: rgba(0,212,255,0.1);
  color: $nw-accent-bright;
  border-color: rgba(0,212,255,0.3);
}

.nw-mockup__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
}

.nw-mock-stat {
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.nw-mock-stat__label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-fg-subtle;
  margin-bottom: 8px;
}

.nw-mock-stat__value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
  color: $nw-fg;
}

.nw-mock-stat__delta {
  font-size: 11px;
  font-weight: 600;
}
.nw-mock-stat__delta--up { color: $nw-green; }
.nw-mock-stat__delta--down { color: $nw-pink; }

.nw-mock-stat__sparkline {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 70px;
  height: 22px;
  opacity: 0.6;

  svg { width: 100%; height: 100%; }
}

.nw-mockup__chart {
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 18px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nw-mockup__chart-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nw-mockup__chart-title {
  font-size: 13px;
  font-weight: 600;
  color: $nw-fg;
}

.nw-mockup__chart-legend {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: $nw-fg-muted;

  span { display: flex; align-items: center; gap: 6px; }
  i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
}

.nw-mockup__chart svg {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
