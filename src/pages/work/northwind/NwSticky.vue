<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Scene { tag: string; title: string; desc: string }

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const activeScene = ref(0)
const tweens: gsap.core.Tween[] = []

onMounted(async () => {
  await nextTick()
  if (!root.value) return

  // Create scroll trigger for each scene
  const scenes = root.value.querySelectorAll('.nw-sticky__scene')

  // Reveal section head
  const headEls = root.value.querySelectorAll('.nw-section__head > *')
  if (headEls.length) {
    tweens.push(
      gsap.fromTo(headEls,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: root.value, start: 'top 85%', toggleActions: 'play none none none' },
        },
      ),
    )
  }

  // Each scene activates its corresponding visual
  scenes.forEach((scene, i) => {
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => { activeScene.value = i },
      onEnterBack: () => { activeScene.value = i },
    })
  })
})

onUnmounted(() => {
  tweens.forEach((t) => t.kill())
  if (root.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger && root.value!.contains(st.trigger as Node)) st.kill()
    })
  }
})
</script>

<template>
  <section ref="root" class="nw-sticky">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.sticky.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.sticky.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.sticky.subtitle') }}</p>
    </div>

    <div class="nw-sticky__layout">
      <!-- Left: scrolling text scenes -->
      <div class="nw-sticky__scenes">
        <div
          v-for="(scene, i) in (tm('northwind.sticky.scenes') as Scene[])"
          :key="i"
          class="nw-sticky__scene"
          :class="{ 'nw-sticky__scene--active': activeScene === i }"
        >
          <span class="nw-sticky__scene-tag">{{ scene.tag }}</span>
          <h3 class="nw-sticky__scene-title">{{ scene.title }}</h3>
          <p class="nw-sticky__scene-desc">{{ scene.desc }}</p>
        </div>
      </div>

      <!-- Right: sticky visuals -->
      <div class="nw-sticky__sticky">
        <div class="nw-sticky__visuals">
          <!-- Visual 0 — Real-time event stream -->
          <div class="nw-sticky__visual" :class="{ 'nw-sticky__visual--active': activeScene === 0 }">
            <div class="nw-sticky__panel">
              <div class="nw-sticky__panel-head">
                <span class="nw-sticky__live-dot"></span>
                LIVE EVENT STREAM
              </div>
              <div class="nw-sticky__events">
                <div v-for="(e, i) in liveEvents" :key="i" class="nw-sticky__event">
                  <span class="nw-sticky__event-time">{{ e.time }}</span>
                  <span :class="`nw-sticky__event-type nw-sticky__event-type--${e.color}`">{{ e.type }}</span>
                  <span class="nw-sticky__event-data">{{ e.data }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Visual 1 — AI Query -->
          <div class="nw-sticky__visual" :class="{ 'nw-sticky__visual--active': activeScene === 1 }">
            <div class="nw-sticky__panel">
              <div class="nw-sticky__panel-head">
                <span class="nw-sticky__sparkle">✦</span>
                ASK NORTHWIND
              </div>
              <div class="nw-sticky__chat">
                <div class="nw-sticky__chat-q">› Show me signup conversion this week vs last week</div>
                <div class="nw-sticky__chat-a">
                  <div class="nw-sticky__chat-result">+18.4%</div>
                  <svg viewBox="0 0 200 60" class="nw-sticky__chat-svg">
                    <defs>
                      <linearGradient id="stickyG1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#00ffaa" stop-opacity="0.4"/>
                        <stop offset="100%" stop-color="#00ffaa" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,45 L20,40 L40,42 L60,30 L80,32 L100,25 L120,22 L140,15 L160,18 L180,10 L200,8 L200,60 L0,60 Z" fill="url(#stickyG1)"/>
                    <path d="M0,45 L20,40 L40,42 L60,30 L80,32 L100,25 L120,22 L140,15 L160,18 L180,10 L200,8" fill="none" stroke="#00ffaa" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Visual 2 — Funnel -->
          <div class="nw-sticky__visual" :class="{ 'nw-sticky__visual--active': activeScene === 2 }">
            <div class="nw-sticky__panel">
              <div class="nw-sticky__panel-head">
                <span class="nw-sticky__icon">▥</span>
                CONVERSION FUNNEL
              </div>
              <div class="nw-sticky__funnel">
                <div class="nw-sticky__funnel-step">
                  <div class="nw-sticky__funnel-bar" style="width: 100%"></div>
                  <div class="nw-sticky__funnel-meta"><span>Visit landing</span><span>48,291</span></div>
                </div>
                <div class="nw-sticky__funnel-step">
                  <div class="nw-sticky__funnel-bar" style="width: 64%"></div>
                  <div class="nw-sticky__funnel-meta"><span>Sign up</span><span>30,906 (64%)</span></div>
                </div>
                <div class="nw-sticky__funnel-step">
                  <div class="nw-sticky__funnel-bar" style="width: 41%"></div>
                  <div class="nw-sticky__funnel-meta"><span>Verify email</span><span>19,799 (41%)</span></div>
                </div>
                <div class="nw-sticky__funnel-step">
                  <div class="nw-sticky__funnel-bar" style="width: 28%"></div>
                  <div class="nw-sticky__funnel-meta"><span>Activate</span><span>13,521 (28%)</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Visual 3 — Alerts -->
          <div class="nw-sticky__visual" :class="{ 'nw-sticky__visual--active': activeScene === 3 }">
            <div class="nw-sticky__panel">
              <div class="nw-sticky__panel-head">
                <span class="nw-sticky__icon">◈</span>
                SMART ALERTS
              </div>
              <div class="nw-sticky__alerts">
                <div class="nw-sticky__alert nw-sticky__alert--red">
                  <div class="nw-sticky__alert-icon">⚠</div>
                  <div>
                    <div class="nw-sticky__alert-title">Conversion drop 12%</div>
                    <div class="nw-sticky__alert-desc">Sign-up funnel · 2 min ago</div>
                  </div>
                </div>
                <div class="nw-sticky__alert nw-sticky__alert--green">
                  <div class="nw-sticky__alert-icon">↑</div>
                  <div>
                    <div class="nw-sticky__alert-title">Traffic spike +240%</div>
                    <div class="nw-sticky__alert-desc">From product hunt · 14 min ago</div>
                  </div>
                </div>
                <div class="nw-sticky__alert nw-sticky__alert--blue">
                  <div class="nw-sticky__alert-icon">◐</div>
                  <div>
                    <div class="nw-sticky__alert-title">A/B test ready</div>
                    <div class="nw-sticky__alert-desc">Variant B winning · 1h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
const liveEvents = [
  { time: '14:32:17', type: 'page_view', data: '/pricing', color: 'cyan' },
  { time: '14:32:16', type: 'signup', data: 'user_a8f3', color: 'pink' },
  { time: '14:32:14', type: 'page_view', data: '/docs', color: 'cyan' },
  { time: '14:32:13', type: 'checkout', data: '$49.00', color: 'green' },
  { time: '14:32:11', type: 'page_view', data: '/', color: 'cyan' },
  { time: '14:32:09', type: 'signup', data: 'user_b2e1', color: 'pink' },
  { time: '14:32:07', type: 'click', data: 'cta_hero', color: 'purple' },
  { time: '14:32:05', type: 'page_view', data: '/features', color: 'cyan' },
]
export default { data: () => ({ liveEvents }) }
</script>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-sticky {
  padding: 80px 24px 200px;
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-sticky__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  // align-items default = stretch — important so right cell spans full row height
  // (allows sticky element inside it to stick across all 4 scenes)

  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 0; }
}

// LEFT — scrolling scenes
.nw-sticky__scenes {
  display: flex;
  flex-direction: column;
}

.nw-sticky__scene {
  padding: 80px 0;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  opacity: 0.4;
  transition: opacity 0.4s ease;

  &--active { opacity: 1; }

  @media (max-width: 900px) {
    min-height: auto;
    padding: 40px 0;
    opacity: 1;
  }
}

.nw-sticky__scene-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: $nw-accent;
  margin-bottom: 16px;
  width: fit-content;
}

.nw-sticky__scene-title {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 16px;
  color: $nw-fg;
}

.nw-sticky__scene-desc {
  font-size: 16px;
  line-height: 1.55;
  color: $nw-fg-muted;
  max-width: 460px;
}

// RIGHT — sticky visuals (sticks within layout container)
.nw-sticky__sticky {
  position: sticky;
  top: 100px;
  align-self: start;
  height: calc(100vh - 120px);
  max-height: 600px;
  display: flex;
  align-items: center;

  @media (max-width: 900px) { display: none; }
}

.nw-sticky__visuals {
  width: 100%;
  position: relative;
  height: 480px;
}

.nw-sticky__visual {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.96) translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;

  &--active {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }
}

.nw-sticky__panel {
  height: 100%;
  background: linear-gradient(180deg, $nw-bg-elevated 0%, $nw-bg-card 100%);
  border: 1px solid $nw-border-bright;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.05),
    0 40px 80px -20px rgba(0,0,0,0.6),
    0 0 60px rgba(0,212,255,0.15);
}

.nw-sticky__panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-accent-bright;
  padding-bottom: 16px;
  border-bottom: 1px solid $nw-border;
}

.nw-sticky__live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: $nw-green;
  box-shadow: 0 0 8px $nw-green;
  animation: nwStickyPulse 1.5s ease-in-out infinite;
}

@keyframes nwStickyPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.nw-sticky__sparkle { font-size: 14px; color: $nw-accent; }
.nw-sticky__icon { font-size: 14px; color: $nw-accent; }

// Events list
.nw-sticky__events {
  display: flex;
  flex-direction: column;
  gap: 10px;
  @include nw-mono;
  font-size: 12px;
  flex: 1;
  overflow: hidden;
}

.nw-sticky__event {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 8px;
}

.nw-sticky__event-time { color: $nw-fg-subtle; flex-shrink: 0; }

.nw-sticky__event-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.nw-sticky__event-type--cyan { background: rgba(0,212,255,0.1); color: $nw-accent; }
.nw-sticky__event-type--pink { background: rgba(255,51,102,0.1); color: $nw-pink; }
.nw-sticky__event-type--green { background: rgba(0,255,170,0.1); color: $nw-green; }
.nw-sticky__event-type--purple { background: rgba(167,139,250,0.1); color: $nw-purple; }

.nw-sticky__event-data { color: $nw-fg-muted; }

// AI chat
.nw-sticky__chat {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.nw-sticky__chat-q {
  background: rgba(255,255,255,0.04);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 14px;
  color: $nw-fg;
  font-style: italic;
}

.nw-sticky__chat-a {
  background: linear-gradient(135deg, rgba(0,255,170,0.08), transparent);
  border: 1px solid rgba(0,255,170,0.25);
  border-radius: 10px;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nw-sticky__chat-result {
  font-size: 64px;
  font-weight: 700;
  color: $nw-green;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 16px;
}

.nw-sticky__chat-svg {
  width: 100%;
  max-width: 280px;
  height: 80px;
}

// Funnel
.nw-sticky__funnel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  justify-content: center;
}

.nw-sticky__funnel-step { display: flex; flex-direction: column; gap: 6px; }

.nw-sticky__funnel-bar {
  height: 28px;
  background: linear-gradient(90deg, $nw-accent, $nw-purple);
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0,212,255,0.3);
}

.nw-sticky__funnel-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $nw-fg-muted;
  font-variant-numeric: tabular-nums;
}

// Alerts
.nw-sticky__alerts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.nw-sticky__alert {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 10px;
}

.nw-sticky__alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.nw-sticky__alert--red .nw-sticky__alert-icon { background: rgba(255,51,102,0.15); color: $nw-pink; }
.nw-sticky__alert--green .nw-sticky__alert-icon { background: rgba(0,255,170,0.15); color: $nw-green; }
.nw-sticky__alert--blue .nw-sticky__alert-icon { background: rgba(0,212,255,0.15); color: $nw-accent; }

.nw-sticky__alert-title { font-size: 14px; font-weight: 600; color: $nw-fg; }
.nw-sticky__alert-desc { font-size: 12px; color: $nw-fg-muted; margin-top: 2px; }
</style>
