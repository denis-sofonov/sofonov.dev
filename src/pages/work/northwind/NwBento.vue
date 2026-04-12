<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useReveal } from './useReveal'

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)
const tweens: gsap.core.Tween[] = []

// Spotlight cursor follower
function spotlightMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  target.style.setProperty('--mx', x + '%')
  target.style.setProperty('--my', y + '%')
}

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-bento__card', { y: 60, stagger: 0.1, duration: 0.9, start: 'top 80%' })

  // Pulsing live dot
  if (root.value) {
    const dots = root.value.querySelectorAll('.nw-bento__live-dot')
    if (dots.length) {
      tweens.push(
        gsap.to(dots, { scale: 1.3, opacity: 0.4, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }),
      )
    }
  }
})

onUnmounted(() => {
  tweens.forEach((t) => t.kill())
})
</script>

<template>
  <section ref="root" id="bento" class="nw-bento">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.bento.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.bento.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.bento.subtitle') }}</p>
    </div>
    <div class="nw-bento__grid">
      <!-- BIG: Live events -->
      <div class="nw-bento__card nw-bento__card--lg" @mousemove="spotlightMove">
        <div class="nw-bento__head">
          <span class="nw-bento__tag">{{ t('northwind.bento.cards.live.tag') }}</span>
          <span class="nw-bento__live"><span class="nw-bento__live-dot"></span>STREAMING</span>
        </div>
        <h3 class="nw-bento__title">{{ t('northwind.bento.cards.live.title') }}</h3>
        <p class="nw-bento__desc">{{ t('northwind.bento.cards.live.desc') }}</p>
        <div class="nw-bento__live-feed">
          <div class="nw-bento__event"><span class="nw-bento__time">14:32:17</span> <span class="nw-bento__type nw-bento__type--green">page_view</span> /pricing</div>
          <div class="nw-bento__event"><span class="nw-bento__time">14:32:16</span> <span class="nw-bento__type nw-bento__type--blue">signup</span> user_a8f3</div>
          <div class="nw-bento__event"><span class="nw-bento__time">14:32:14</span> <span class="nw-bento__type nw-bento__type--green">page_view</span> /docs</div>
          <div class="nw-bento__event"><span class="nw-bento__time">14:32:13</span> <span class="nw-bento__type nw-bento__type--purple">checkout</span> $49.00</div>
          <div class="nw-bento__event"><span class="nw-bento__time">14:32:11</span> <span class="nw-bento__type nw-bento__type--green">page_view</span> /</div>
          <div class="nw-bento__event"><span class="nw-bento__time">14:32:09</span> <span class="nw-bento__type nw-bento__type--blue">signup</span> user_b2e1</div>
        </div>
      </div>

      <div class="nw-bento__card" @mousemove="spotlightMove">
        <div class="nw-bento__head"><span class="nw-bento__tag">{{ t('northwind.bento.cards.ai.tag') }}</span></div>
        <h3 class="nw-bento__title">{{ t('northwind.bento.cards.ai.title') }}</h3>
        <p class="nw-bento__desc">{{ t('northwind.bento.cards.ai.desc') }}</p>
        <div class="nw-bento__chat">
          <div class="nw-bento__chat-q">"Show me signup conversion this week vs last week"</div>
          <div class="nw-bento__chat-a">
            <div class="nw-bento__chat-big">+18.4%</div>
            <div class="nw-bento__chat-small">vs. previous 7 days</div>
          </div>
        </div>
      </div>

      <div class="nw-bento__card" @mousemove="spotlightMove">
        <div class="nw-bento__head"><span class="nw-bento__tag">{{ t('northwind.bento.cards.funnels.tag') }}</span></div>
        <h3 class="nw-bento__title">{{ t('northwind.bento.cards.funnels.title') }}</h3>
        <p class="nw-bento__desc">{{ t('northwind.bento.cards.funnels.desc') }}</p>
        <div class="nw-bento__funnel">
          <div class="nw-bento__funnel-step">
            <div class="nw-bento__funnel-bar" style="width: 100%"></div>
            <div class="nw-bento__funnel-meta"><span>Visit</span><span>48,291</span></div>
          </div>
          <div class="nw-bento__funnel-step">
            <div class="nw-bento__funnel-bar" style="width: 64%"></div>
            <div class="nw-bento__funnel-meta"><span>Sign up</span><span>30,906</span></div>
          </div>
          <div class="nw-bento__funnel-step">
            <div class="nw-bento__funnel-bar" style="width: 28%"></div>
            <div class="nw-bento__funnel-meta"><span>Activate</span><span>13,521</span></div>
          </div>
        </div>
      </div>

      <div class="nw-bento__card" @mousemove="spotlightMove">
        <div class="nw-bento__head"><span class="nw-bento__tag">{{ t('northwind.bento.cards.alerts.tag') }}</span></div>
        <h3 class="nw-bento__title">{{ t('northwind.bento.cards.alerts.title') }}</h3>
        <p class="nw-bento__desc">{{ t('northwind.bento.cards.alerts.desc') }}</p>
        <div class="nw-bento__alerts">
          <div class="nw-bento__alert">
            <span class="nw-bento__alert-dot nw-bento__alert-dot--red"></span>
            <div>
              <div class="nw-bento__alert-title">Conversion drop</div>
              <div class="nw-bento__alert-time">2 min ago</div>
            </div>
          </div>
          <div class="nw-bento__alert">
            <span class="nw-bento__alert-dot nw-bento__alert-dot--green"></span>
            <div>
              <div class="nw-bento__alert-title">Traffic spike +240%</div>
              <div class="nw-bento__alert-time">14 min ago</div>
            </div>
          </div>
        </div>
      </div>

      <div class="nw-bento__card" @mousemove="spotlightMove">
        <div class="nw-bento__head"><span class="nw-bento__tag">{{ t('northwind.bento.cards.privacy.tag') }}</span></div>
        <h3 class="nw-bento__title">{{ t('northwind.bento.cards.privacy.title') }}</h3>
        <p class="nw-bento__desc">{{ t('northwind.bento.cards.privacy.desc') }}</p>
        <div class="nw-bento__badges">
          <div class="nw-bento__cert">SOC 2</div>
          <div class="nw-bento__cert">GDPR</div>
          <div class="nw-bento__cert">HIPAA</div>
          <div class="nw-bento__cert">ISO 27001</div>
        </div>
      </div>

      <div class="nw-bento__card" @mousemove="spotlightMove">
        <div class="nw-bento__head"><span class="nw-bento__tag">{{ t('northwind.bento.cards.sdk.tag') }}</span></div>
        <h3 class="nw-bento__title">{{ t('northwind.bento.cards.sdk.title') }}</h3>
        <p class="nw-bento__desc">{{ t('northwind.bento.cards.sdk.desc') }}</p>
        <div class="nw-bento__sdks">
          <span>JS</span><span>TS</span><span>Python</span><span>Go</span><span>Swift</span><span>Kotlin</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-bento {
  padding: 80px 24px 160px;
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

.nw-bento__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.nw-bento__card {
  background: $nw-bg-card;
  border: 1px solid $nw-border;
  border-radius: 18px;
  padding: 28px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  text-align: left;
  --mx: 50%;
  --my: 50%;

  // Spotlight cursor follower — Linear/Vercel style
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      450px circle at var(--mx) var(--my),
      rgba(0, 212, 255, 0.12),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 0;
  }

  // Border glow that follows cursor
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    padding: 1px;
    background: radial-gradient(
      400px circle at var(--mx) var(--my),
      rgba(0, 212, 255, 0.5),
      transparent 40%
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 0;
  }

  // Move card content above pseudos
  & > * { position: relative; z-index: 1; }

  &:hover {
    border-color: $nw-border-bright;
    transform: translateY(-3px);

    &::before, &::after { opacity: 1; }
  }
}

.nw-bento__card--lg {
  grid-column: span 2;
  @media (max-width: 900px) { grid-column: 1; }
}

.nw-bento__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.nw-bento__tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: $nw-accent-bright;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  padding: 4px 10px;
  border-radius: 6px;
}

.nw-bento__live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: $nw-green;
}

.nw-bento__live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: $nw-green; box-shadow: 0 0 6px $nw-green;
}

.nw-bento__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 10px;
  color: $nw-fg;
}

.nw-bento__desc {
  font-size: 14px;
  line-height: 1.5;
  color: $nw-fg-muted;
  margin-bottom: 20px;
  flex: 1;
}

.nw-bento__live-feed {
  background: rgba(0,0,0,0.3);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 14px 16px;
  @include nw-mono;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nw-bento__event {
  display: flex;
  gap: 12px;
  align-items: center;
  color: $nw-fg-muted;
}

.nw-bento__time { color: $nw-fg-subtle; }
.nw-bento__type {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}
.nw-bento__type--green { background: rgba(0,255,170,0.1); color: $nw-green; }
.nw-bento__type--blue { background: rgba(0,212,255,0.1); color: $nw-accent; }
.nw-bento__type--purple { background: rgba(167,139,250,0.1); color: $nw-purple; }

.nw-bento__chat {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nw-bento__chat-q {
  background: rgba(255,255,255,0.04);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  font-style: italic;
  color: $nw-fg;
}

.nw-bento__chat-a {
  background: linear-gradient(135deg, rgba(0,212,255,0.1), transparent);
  border: 1px solid rgba(0,212,255,0.2);
  border-radius: 10px;
  padding: 18px;
  text-align: center;
}

.nw-bento__chat-big {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: $nw-green;
  line-height: 1;
}

.nw-bento__chat-small {
  font-size: 11px;
  color: $nw-fg-muted;
  margin-top: 4px;
}

.nw-bento__funnel { display: flex; flex-direction: column; gap: 10px; }
.nw-bento__funnel-step { display: flex; flex-direction: column; gap: 4px; }

.nw-bento__funnel-bar {
  height: 18px;
  background: linear-gradient(90deg, $nw-accent, $nw-purple);
  border-radius: 4px;
}

.nw-bento__funnel-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: $nw-fg-muted;
  font-variant-numeric: tabular-nums;
}

.nw-bento__alerts { display: flex; flex-direction: column; gap: 10px; }

.nw-bento__alert {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 10px;
  padding: 12px 14px;
}

.nw-bento__alert-dot {
  width: 8px; height: 8px; border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}
.nw-bento__alert-dot--red { background: $nw-pink; box-shadow: 0 0 8px $nw-pink; }
.nw-bento__alert-dot--green { background: $nw-green; box-shadow: 0 0 8px $nw-green; }

.nw-bento__alert-title { font-size: 13px; font-weight: 600; color: $nw-fg; }
.nw-bento__alert-time { font-size: 11px; color: $nw-fg-subtle; margin-top: 2px; }

.nw-bento__badges {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.nw-bento__cert {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-align: center;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid $nw-border;
  border-radius: 8px;
  color: $nw-fg-muted;
}

.nw-bento__sdks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    font-size: 11px;
    font-weight: 600;
    padding: 6px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid $nw-border;
    border-radius: 6px;
    color: $nw-fg-muted;
    @include nw-mono;
  }
}
</style>
