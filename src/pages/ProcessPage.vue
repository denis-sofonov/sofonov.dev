<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'

const { t, tm } = useI18n()
interface Stage { name: string; desc: string; eta: string; out: string }

const stages = computed(() => tm('process.stages') as Stage[])
const active = ref(0)

const descEl = ref<HTMLElement | null>(null)

const pad = (n: number) => String(n).padStart(2, '0')

const time = ref('')
let timeTimer: ReturnType<typeof setInterval> | null = null
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
})
function updateTime() {
  time.value = timeFormatter.format(new Date())
}

let autoTimer: ReturnType<typeof setInterval> | null = null
const userInteracted = ref(false)

function setActive(i: number) { active.value = i }

function startAuto() {
  stopAuto()
  autoTimer = setInterval(() => {
    if (userInteracted.value) return
    active.value = (active.value + 1) % stages.value.length
  }, 9000)
}
function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null } }

function animateDesc() {
  if (!descEl.value) return
  const text = stages.value[active.value]?.desc ?? ''
  descEl.value.innerHTML = ''
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const s = document.createElement('span')
    s.className = 'bp-char'
    s.textContent = ch === ' ' ? '\u00A0' : ch
    descEl.value.appendChild(s)
    chars.push(s)
  }
  gsap.from(chars, { opacity: 0, duration: 0.01, stagger: 0.006, delay: 0.1 })
}

function onKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  const len = stages.value.length
  if (!len) return
  e.preventDefault()
  userInteracted.value = true
  const step = e.key === 'ArrowDown' ? 1 : -1
  active.value = (active.value + step + len) % len
}

watch(active, async () => {
  await nextTick()
  animateDesc()
})

onMounted(() => {
  updateTime()
  const msToNextMinute = 60000 - (Date.now() % 60000)
  setTimeout(() => {
    updateTime()
    timeTimer = setInterval(updateTime, 60000)
  }, msToNextMinute)
  nextTick(() => animateDesc())
  startAuto()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  stopAuto()
  if (timeTimer) clearInterval(timeTimer)
  window.removeEventListener('keydown', onKey)
})

const currentStage = computed(() => stages.value[active.value])

function onLeave() { userInteracted.value = false }
function onEnter() { userInteracted.value = true }
</script>

<template>
  <div class="bp-page" @mouseenter="onEnter" @mouseleave="onLeave">
    <div class="bp-frame">
      <span class="bp-mark bp-mark--tl"></span>
      <span class="bp-mark bp-mark--tr"></span>
      <span class="bp-mark bp-mark--bl"></span>
      <span class="bp-mark bp-mark--br"></span>

      <header class="bp-top">
        <span class="bp-top__label">[ 04 · {{ t('nav.process') }} — {{ t('sections.process') }} ]</span>
        <div class="bp-top__meta">
          <span>SHEET {{ pad(active + 1) }} / {{ pad(stages.length) }}</span>
          <span class="bp-top__sep">·</span>
          <span>REV A · 2026</span>
          <span class="bp-top__sep">·</span>
          <span class="bp-top__time">{{ time }}</span>
        </div>
      </header>

      <div class="bp-body">
        <!-- LEFT: SVG blueprint diagram -->
        <div class="bp-canvas-wrap">
          <div class="bp-diagram">
            <!-- Blueprint grid backdrop -->
            <svg class="bp-grid" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <pattern id="bp-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.12" />
                </pattern>
                <pattern id="bp-grid-pattern-major" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.22" />
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#bp-grid-pattern)" />
              <rect width="600" height="400" fill="url(#bp-grid-pattern-major)" />
            </svg>

            <!-- 01 BRIEF — two nodes connected, clock indicator -->
            <svg v-show="active === 0" class="bp-fig" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
                <!-- YOU node -->
                <circle class="bp-node" cx="140" cy="200" r="46" />
                <text x="140" y="205" text-anchor="middle" font-family="var(--font-mono)" font-size="11" letter-spacing="2" fill="currentColor" stroke="none">YOU</text>
                <text x="140" y="280" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">NODE.A · CLIENT</text>

                <!-- ME node -->
                <circle class="bp-node" cx="460" cy="200" r="46" />
                <text x="460" y="205" text-anchor="middle" font-family="var(--font-mono)" font-size="11" letter-spacing="2" fill="currentColor" stroke="none">DS</text>
                <text x="460" y="280" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">NODE.B · ENGINEER</text>

                <!-- Bidirectional signal -->
                <line class="bp-flow" x1="196" y1="192" x2="404" y2="192" stroke-dasharray="4 3" />
                <polygon points="196,192 204,188 204,196" fill="currentColor" stroke="none" />
                <line class="bp-flow bp-flow--rev" x1="196" y1="208" x2="404" y2="208" stroke-dasharray="4 3" />
                <polygon points="404,208 396,204 396,212" fill="currentColor" stroke="none" />
                <!-- Travelling packets -->
                <circle class="bp-packet bp-packet--a" cx="200" cy="192" r="3" fill="currentColor" stroke="none" />
                <circle class="bp-packet bp-packet--b" cx="400" cy="208" r="3" fill="currentColor" stroke="none" />
                <!-- Node outer rings (rotating) -->
                <circle class="bp-ring" cx="140" cy="200" r="56" stroke-dasharray="2 4" opacity="0.4" fill="none" stroke="currentColor" />
                <circle class="bp-ring bp-ring--rev" cx="460" cy="200" r="56" stroke-dasharray="2 4" opacity="0.4" fill="none" stroke="currentColor" />

                <!-- Measurement: 30 MIN -->
                <line x1="196" y1="150" x2="404" y2="150" opacity="0.5" />
                <line x1="196" y1="145" x2="196" y2="155" opacity="0.5" />
                <line x1="404" y1="145" x2="404" y2="155" opacity="0.5" />
                <rect x="270" y="140" width="60" height="20" fill="var(--bg)" stroke="none" />
                <text x="300" y="154" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">30 MIN</text>

                <!-- Corner labels -->
                <text x="30" y="40" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">FIG.01 / BRIEF</text>
                <text x="570" y="40" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">SIGNAL · BIDIRECTIONAL</text>
                <text x="30" y="375" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">OUT — ALIGNED BRIEF</text>
                <text x="570" y="375" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">ETA — 1 DAY</text>
              </g>
            </svg>

            <!-- 02 SCOPE — timeline with milestones + price -->
            <svg v-show="active === 1" class="bp-fig" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
                <!-- Main axis -->
                <line x1="60" y1="220" x2="540" y2="220" />
                <!-- End caps -->
                <line x1="60" y1="210" x2="60" y2="230" />
                <line x1="540" y1="210" x2="540" y2="230" />

                <!-- Milestone ticks -->
                <g v-for="(x, i) in [60, 180, 300, 420, 540]" :key="i">
                  <line :x1="x" y1="200" :x2="x" y2="240" />
                  <circle :cx="x" cy="220" r="4" fill="var(--bg)" />
                  <circle class="bp-mstone" :style="{ animationDelay: `${i * 0.8}s` }" :cx="x" cy="220" r="4" fill="currentColor" stroke="none" />
                </g>

                <!-- Milestone labels -->
                <text x="60" y="265" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none">M1 · INTAKE</text>
                <text x="180" y="265" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none">M2 · BREAK</text>
                <text x="300" y="265" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none">M3 · EST</text>
                <text x="420" y="265" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none">M4 · TERMS</text>
                <text x="540" y="265" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none">M5 · SIGN</text>

                <!-- Span bracket above -->
                <line x1="60" y1="160" x2="540" y2="160" opacity="0.5" />
                <line x1="60" y1="155" x2="60" y2="165" opacity="0.5" />
                <line x1="540" y1="155" x2="540" y2="165" opacity="0.5" />
                <rect x="260" y="150" width="80" height="20" fill="var(--bg)" stroke="none" />
                <text x="300" y="164" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">2–3 DAYS</text>

                <!-- Budget ledger -->
                <g class="bp-ledger" opacity="0.85">
                  <rect x="180" y="100" width="240" height="30" stroke-dasharray="3 3" />
                  <text x="300" y="120" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">FIXED · HOURLY · HYBRID</text>
                </g>

                <!-- Corners -->
                <text x="30" y="40" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">FIG.02 / SCOPE</text>
                <text x="570" y="40" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">TIMELINE · 5 MILESTONES</text>
                <text x="30" y="375" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">OUT — PROPOSAL + TIMELINE</text>
                <text x="570" y="375" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">ETA — 2-3 D</text>
              </g>
            </svg>

            <!-- 03 PROTOTYPE — wireframe -->
            <svg v-show="active === 2" class="bp-fig" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <g fill="none" stroke="currentColor" stroke-width="1">
                <!-- Frame -->
                <rect x="100" y="80" width="400" height="260" />
                <!-- Header bar -->
                <line x1="100" y1="110" x2="500" y2="110" />
                <circle cx="114" cy="95" r="3" />
                <circle cx="126" cy="95" r="3" />
                <circle cx="138" cy="95" r="3" />
                <line x1="420" y1="92" x2="480" y2="92" opacity="0.5" />
                <line x1="420" y1="98" x2="480" y2="98" opacity="0.5" />

                <!-- Sidebar -->
                <line x1="180" y1="110" x2="180" y2="340" />
                <g stroke-dasharray="3 4" opacity="0.55">
                  <line x1="115" y1="130" x2="165" y2="130" />
                  <line x1="115" y1="150" x2="165" y2="150" />
                  <line x1="115" y1="170" x2="165" y2="170" />
                  <line x1="115" y1="190" x2="150" y2="190" />
                </g>

                <!-- Main content blocks -->
                <rect class="bp-hero" x="200" y="130" width="280" height="60" stroke-dasharray="4 3" />
                <text x="340" y="165" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">HERO</text>

                <!-- Left group (block A + its lines + inserted block C) -->
                <g class="bp-g bp-g--left">
                  <rect class="bp-block bp-block--a" x="200" y="210" width="130" height="110" stroke-dasharray="4 3" />
                  <line class="bp-text-line bp-text-line--a1" x1="220" y1="240" x2="310" y2="240" opacity="0.5" />
                  <line class="bp-text-line bp-text-line--a2" x1="220" y1="258" x2="300" y2="258" opacity="0.5" />
                  <line class="bp-text-line bp-text-line--a3" x1="220" y1="276" x2="290" y2="276" opacity="0.5" />
                  <!-- Inserted block C (appears below A when A shrinks) -->
                  <g class="bp-g--c">
                    <rect class="bp-block bp-block--c" x="200" y="272" width="130" height="48" stroke-dasharray="4 3" />
                    <line class="bp-text-line bp-text-line--c1" x1="220" y1="290" x2="300" y2="290" opacity="0.5" />
                    <line class="bp-text-line bp-text-line--c2" x1="220" y1="306" x2="280" y2="306" opacity="0.5" />
                  </g>
                </g>

                <!-- Right group (block B + its lines) -->
                <g class="bp-g bp-g--right">
                  <rect class="bp-block bp-block--b" x="350" y="210" width="130" height="110" stroke-dasharray="4 3" />
                  <line class="bp-text-line bp-text-line--b1" x1="370" y1="240" x2="460" y2="240" opacity="0.5" />
                  <line class="bp-text-line bp-text-line--b2" x1="370" y1="258" x2="450" y2="258" opacity="0.5" />
                  <line class="bp-text-line bp-text-line--b3" x1="370" y1="276" x2="440" y2="276" opacity="0.5" />
                </g>

                <!-- Annotation leader + label -->
                <line x1="500" y1="160" x2="540" y2="160" opacity="0.5" />
                <polygon points="500,160 508,156 508,164" fill="currentColor" stroke="none" opacity="0.5" />
                <text x="545" y="163" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">BLOCK A</text>

                <!-- Corners -->
                <text x="30" y="40" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">FIG.03 / PROTOTYPE</text>
                <text x="570" y="40" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">WIREFRAME · FIGMA</text>
                <text x="30" y="375" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">OUT — CLICKABLE PROTOTYPE</text>
                <text x="570" y="375" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">ETA — 1-2 W</text>
              </g>
            </svg>

            <!-- 04 BUILD — git-style branch timeline -->
            <svg v-show="active === 3" class="bp-fig" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
                <!-- main branch -->
                <line x1="60" y1="210" x2="540" y2="210" />
                <text x="60" y="200" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">main</text>

                <!-- main commits -->
                <g>
                  <circle cx="60" cy="210" r="5" fill="var(--bg)" />
                  <circle cx="180" cy="210" r="5" fill="var(--bg)" />
                  <circle cx="300" cy="210" r="5" fill="var(--bg)" />
                  <circle cx="420" cy="210" r="5" fill="var(--bg)" />
                  <circle class="bp-head" cx="540" cy="210" r="5" fill="currentColor" />
                  <circle class="bp-head-ring" cx="540" cy="210" r="5" fill="none" stroke="currentColor" />
                </g>

                <!-- feature branch (up) — feat/ui -->
                <path d="M 120 210 C 150 210, 120 130, 150 130 L 270 130 C 300 130, 270 210, 300 210" />
                <g>
                  <circle cx="180" cy="130" r="4" fill="var(--bg)" />
                  <circle cx="210" cy="130" r="4" fill="var(--bg)" />
                  <circle cx="240" cy="130" r="4" fill="var(--bg)" />
                </g>
                <text x="150" y="118" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.7">feat/ui</text>

                <!-- feature branch (down) — feat/api -->
                <path d="M 240 210 C 270 210, 240 290, 270 290 L 390 290 C 420 290, 390 210, 420 210" />
                <g>
                  <circle cx="310" cy="290" r="4" fill="var(--bg)" />
                  <circle cx="350" cy="290" r="4" fill="var(--bg)" />
                </g>
                <text x="270" y="308" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.7">feat/api</text>

                <!-- tiny hotfix branch up -->
                <path class="bp-flow" d="M 360 210 C 380 210, 360 170, 380 170 L 410 170 C 430 170, 410 210, 430 210" opacity="0.7" stroke-dasharray="3 3" />
                <circle cx="395" cy="170" r="3" fill="var(--bg)" />
                <text x="380" y="160" font-family="var(--font-mono)" font-size="8" letter-spacing="1.2" fill="currentColor" stroke="none" opacity="0.55">fix</text>

                <!-- Timeline axis (weeks) -->
                <line x1="60" y1="355" x2="540" y2="355" opacity="0.35" />
                <g opacity="0.55">
                  <line x1="60" y1="350" x2="60" y2="360" />
                  <line x1="180" y1="350" x2="180" y2="360" />
                  <line x1="300" y1="350" x2="300" y2="360" />
                  <line x1="420" y1="350" x2="420" y2="360" />
                  <line x1="540" y1="350" x2="540" y2="360" />
                </g>
                <text x="60" y="345" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">W1</text>
                <text x="180" y="345" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">W2</text>
                <text x="300" y="345" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">W3</text>
                <text x="420" y="345" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">W4</text>
                <text x="540" y="345" text-anchor="end" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">Wn</text>

                <!-- Demo markers -->
                <g class="bp-demos" opacity="0.7">
                  <g class="bp-demo" style="--d: 0s">
                    <line x1="180" y1="210" x2="180" y2="240" stroke-dasharray="2 3" />
                    <text x="180" y="252" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none">demo</text>
                  </g>
                  <g class="bp-demo" style="--d: 1s">
                    <line x1="300" y1="210" x2="300" y2="240" stroke-dasharray="2 3" />
                    <text x="300" y="252" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none">demo</text>
                  </g>
                  <g class="bp-demo" style="--d: 2s">
                    <line x1="420" y1="210" x2="420" y2="240" stroke-dasharray="2 3" />
                    <text x="420" y="252" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none">demo</text>
                  </g>
                </g>

                <!-- HEAD indicator -->
                <text x="540" y="198" text-anchor="end" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none">HEAD</text>

                <!-- Corners -->
                <text x="30" y="40" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">FIG.04 / BUILD</text>
                <text x="570" y="40" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">BRANCHES · COMMITS · DEMOS</text>
                <text x="30" y="375" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">OUT — WORKING PRODUCT</text>
                <text x="570" y="375" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">ETA — 4-12 W</text>
              </g>
            </svg>

            <!-- 05 LAUNCH — deploy flow -->
            <svg v-show="active === 4" class="bp-fig" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
                <!-- Source -->
                <rect x="50" y="170" width="120" height="80" />
                <line x1="50" y1="195" x2="170" y2="195" />
                <circle cx="63" cy="183" r="2.5" />
                <circle cx="72" cy="183" r="2.5" />
                <circle cx="81" cy="183" r="2.5" />
                <text x="110" y="225" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">SOURCE</text>
                <text x="110" y="270" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">GIT · MAIN</text>

                <!-- Server -->
                <g transform="translate(240,155)">
                  <rect x="0" y="0" width="120" height="30" />
                  <rect x="0" y="35" width="120" height="30" />
                  <rect x="0" y="70" width="120" height="30" />
                  <circle class="bp-led" style="--d: 0s" cx="15" cy="15" r="3" fill="currentColor" stroke="none" />
                  <circle class="bp-led" style="--d: 0.4s" cx="15" cy="50" r="3" fill="currentColor" stroke="none" />
                  <circle class="bp-led" style="--d: 0.8s" cx="15" cy="85" r="3" fill="currentColor" stroke="none" />
                </g>
                <text x="300" y="142" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">BUILD · DEPLOY</text>
                <text x="300" y="270" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">CI · YOUR INFRA</text>

                <!-- User (live) -->
                <rect x="430" y="170" width="120" height="80" />
                <line x1="430" y1="225" x2="550" y2="225" />
                <circle cx="443" cy="238" r="2.5" fill="currentColor" />
                <circle cx="453" cy="238" r="2.5" fill="currentColor" opacity="0.5" />
                <circle cx="463" cy="238" r="2.5" fill="currentColor" opacity="0.25" />
                <text x="490" y="205" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">LIVE</text>
                <text x="490" y="270" text-anchor="middle" font-family="var(--font-mono)" font-size="8" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.55">USER · PROD</text>

                <!-- Arrows -->
                <line class="bp-flow" x1="170" y1="210" x2="240" y2="210" stroke-dasharray="4 3" />
                <polygon points="240,210 230,205 230,215" fill="currentColor" stroke="none" />
                <line class="bp-flow" x1="360" y1="210" x2="430" y2="210" stroke-dasharray="4 3" />
                <polygon points="430,210 420,205 420,215" fill="currentColor" stroke="none" />

                <!-- Travelling packet SOURCE → SERVER → LIVE -->
                <circle class="bp-launch-packet" cx="170" cy="210" r="3" fill="currentColor" stroke="none" />

                <!-- Warranty bracket -->
                <g opacity="0.8">
                  <path d="M 240 310 L 240 320 L 360 320 L 360 310" />
                  <rect x="260" y="312" width="80" height="18" fill="var(--bg)" stroke="none" />
                  <text x="300" y="325" text-anchor="middle" font-family="var(--font-mono)" font-size="10" letter-spacing="2" fill="currentColor" stroke="none">+2W WARRANTY</text>
                </g>

                <!-- Corners -->
                <text x="30" y="40" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">FIG.05 / LAUNCH</text>
                <text x="570" y="40" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">SOURCE → LIVE</text>
                <text x="30" y="375" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">OUT — LIVE PRODUCT + DOCS</text>
                <text x="570" y="375" text-anchor="end" font-family="var(--font-mono)" font-size="9" letter-spacing="1.5" fill="currentColor" stroke="none" opacity="0.5">ETA — 1 W</text>
              </g>
            </svg>

            <!-- Scan line -->
            <div class="bp-scan"></div>
          </div>
          <div class="bp-canvas-caption">
            <span>FIG. {{ pad(active + 1) }}</span>
            <span class="bp-top__sep">·</span>
            <span>{{ currentStage?.name }}</span>
            <span class="bp-top__sep">·</span>
            <span ref="descEl" class="bp-caption__desc"></span>
          </div>
        </div>

        <!-- RIGHT: stage list as editorial text -->
        <nav class="bp-stages">
          <button
            v-for="(s, i) in stages"
            :key="i"
            class="bp-stage"
            :class="{ 'bp-stage--active': active === i }"
            @mouseenter="setActive(i); userInteracted = true"
            @click="setActive(i); userInteracted = true"
            @focus="setActive(i)"
          >
            <span class="bp-stage__num">{{ pad(i + 1) }}</span>
            <span class="bp-stage__body">
              <span class="bp-stage__name">{{ s.name }}</span>
              <span class="bp-stage__meta">
                <em>ETA</em> {{ s.eta }}
                <span class="bp-stage__dot">·</span>
                <em>OUT</em> {{ s.out }}
              </span>
              <span v-if="active === i" class="bp-stage__desc">{{ s.desc }}</span>
            </span>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bp-page {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  padding: 56px 20px 12px;
  overflow: hidden;
  display: flex;

  @media (max-width: 768px) {
    padding: 52px 10px 10px;
    overflow: visible;
  }
}

.bp-frame {
  position: relative;
  flex: 1;
  border: 1px solid var(--border);
  padding: 16px 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;

  @media (max-width: 768px) { padding: 14px 14px 16px; }
}

.bp-mark {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;

  &::before, &::after {
    content: '';
    position: absolute;
    background: var(--fg);
  }

  &--tl { top: -1px; left: -1px;
    &::before { top: 0; left: 0; width: 1px; height: 100%; }
    &::after  { top: 0; left: 0; width: 100%; height: 1px; }
  }
  &--tr { top: -1px; right: -1px;
    &::before { top: 0; right: 0; width: 1px; height: 100%; }
    &::after  { top: 0; right: 0; width: 100%; height: 1px; }
  }
  &--bl { bottom: -1px; left: -1px;
    &::before { bottom: 0; left: 0; width: 1px; height: 100%; }
    &::after  { bottom: 0; left: 0; width: 100%; height: 1px; }
  }
  &--br { bottom: -1px; right: -1px;
    &::before { bottom: 0; right: 0; width: 1px; height: 100%; }
    &::after  { bottom: 0; right: 0; width: 100%; height: 1px; }
  }
}

.bp-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--ls-chrome);
  text-transform: uppercase;
  color: var(--muted);
  flex-shrink: 0;
  z-index: 2;
}

.bp-top__label {
  color: var(--fg);
  white-space: nowrap;
}

.bp-top__meta {
  display: flex;
  gap: 10px;
  align-items: baseline;
  color: var(--muted);
  white-space: nowrap;
}

.bp-top__sep { opacity: 0.4; }

.bp-top__time {
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}

.bp-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.4fr minmax(320px, 1fr);
  gap: 32px;
  z-index: 2;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

// LEFT — blueprint diagram
.bp-canvas-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  min-width: 0;
}

.bp-diagram {
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  border: 1px solid var(--border);
  color: var(--fg);
  overflow: hidden;

  @media (max-width: 960px) {
    aspect-ratio: 3 / 2;
    flex: none;
  }
}

.bp-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--fg);
  pointer-events: none;
}

.bp-fig {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--fg);
}

.bp-scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--fg), transparent);
  opacity: 0.05;
  animation: bp-scan 4.8s linear infinite;
  pointer-events: none;
}

@keyframes bp-scan {
  0% { top: -2%; }
  100% { top: 102%; }
}

// === Diagram animations ===

// Shared: flowing dashed lines
.bp-flow {
  stroke-dasharray: 4 3;
  animation: bp-flow-dash 1.2s linear infinite;
}
.bp-flow--rev { animation-direction: reverse; }
@keyframes bp-flow-dash {
  to { stroke-dashoffset: -14; }
}

// BRIEF
.bp-node {
  transform-origin: center;
  transform-box: fill-box;
  animation: bp-pulse 3.2s ease-in-out infinite;
}
.bp-node:nth-of-type(2) { animation-delay: 1.6s; }
@keyframes bp-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}

.bp-ring {
  transform-origin: center;
  transform-box: fill-box;
  animation: bp-rot 22s linear infinite;
}
.bp-ring--rev { animation-direction: reverse; }
@keyframes bp-rot {
  to { transform: rotate(360deg); }
}

.bp-packet--a {
  animation: bp-packet-a 2.6s ease-in-out infinite;
}
.bp-packet--b {
  animation: bp-packet-b 2.6s ease-in-out infinite;
  animation-delay: 1.3s;
}
@keyframes bp-packet-a {
  0% { transform: translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(200px); opacity: 0; }
}
@keyframes bp-packet-b {
  0% { transform: translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(-200px); opacity: 0; }
}

// SCOPE — milestones light up in sequence
.bp-mstone {
  opacity: 0;
  animation: bp-mstone 4.5s ease-in-out infinite;
}
@keyframes bp-mstone {
  0%, 10% { opacity: 0; }
  16%, 82% { opacity: 1; }
  92%, 100% { opacity: 0; }
}

.bp-ledger {
  animation: bp-ledger-pulse 4s ease-in-out infinite;
}
@keyframes bp-ledger-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.5; }
}

// PROTOTYPE — wireframe editing (narrative cycle ~12s)
// Timeline:
//  0–15%   draw HERO + A + B via dashoffset
//  20–30%  A shrinks (h: 110 → 52)
//  28–40%  C fades in below A (as if inserted)
//  48–62%  left/right groups swap horizontally
//  72–85%  swap back, C fades out, A restores
//  85–100% rest at base state

.bp-hero {
  stroke-dasharray: 680;
  animation: bp-hero-draw 12s ease-in-out infinite;
}
@keyframes bp-hero-draw {
  0% { stroke-dashoffset: 680; }
  15%, 100% { stroke-dashoffset: 0; }
}

.bp-block--a {
  stroke-dasharray: 480;
  animation: bp-block-a-draw 12s linear infinite, bp-block-a-size 12s ease-in-out infinite;
}
@keyframes bp-block-a-draw {
  0% { stroke-dashoffset: 480; }
  15%, 100% { stroke-dashoffset: 0; }
}
@keyframes bp-block-a-size {
  0%, 20%, 85%, 100% { height: 110px; }
  30%, 80% { height: 52px; }
}

.bp-block--b {
  stroke-dasharray: 480;
  animation: bp-block-b-draw 12s linear infinite;
}
@keyframes bp-block-b-draw {
  0% { stroke-dashoffset: 480; }
  15%, 100% { stroke-dashoffset: 0; }
}

// Inserted block C appears below A
.bp-g--c {
  opacity: 0;
  animation: bp-c-appear 12s ease-in-out infinite;
}
.bp-block--c {
  stroke-dasharray: 360;
  animation: bp-c-draw 12s ease-in-out infinite;
}
@keyframes bp-c-appear {
  0%, 25% { opacity: 0; }
  32%, 78% { opacity: 1; }
  85%, 100% { opacity: 0; }
}
@keyframes bp-c-draw {
  0%, 28% { stroke-dashoffset: 360; }
  38%, 100% { stroke-dashoffset: 0; }
}

// Group swap — left moves right, right moves left
.bp-g--left {
  animation: bp-swap-left 12s ease-in-out infinite;
}
.bp-g--right {
  animation: bp-swap-right 12s ease-in-out infinite;
}
@keyframes bp-swap-left {
  0%, 45%, 85%, 100% { transform: translateX(0); }
  58%, 72% { transform: translateX(150px); }
}
@keyframes bp-swap-right {
  0%, 45%, 85%, 100% { transform: translateX(0); }
  58%, 72% { transform: translateX(-150px); }
}

.bp-text-line {
  animation: bp-text-type 3.2s ease-in-out infinite;
}
.bp-text-line--a1 { animation-delay: 0s; }
.bp-text-line--a2 { animation-delay: 0.3s; }
.bp-text-line--a3 { animation-delay: 0.6s; }
.bp-text-line--b1 { animation-delay: 0.2s; }
.bp-text-line--b2 { animation-delay: 0.5s; }
.bp-text-line--b3 { animation-delay: 0.8s; }
.bp-text-line--c1 { animation-delay: 0.1s; }
.bp-text-line--c2 { animation-delay: 0.4s; }
@keyframes bp-text-type {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.2; }
}

// Text lines inside A should hide when A is shrunken (lines a2 and a3 are below the shortened block)
.bp-text-line--a2, .bp-text-line--a3 {
  animation: bp-text-type 3.2s ease-in-out infinite, bp-a-lines-hide 12s ease-in-out infinite;
}
@keyframes bp-a-lines-hide {
  0%, 20%, 85%, 100% { visibility: visible; }
  25%, 82% { visibility: hidden; }
}

// BUILD — HEAD pulse + demo markers + flowing branches
.bp-head {
  transform-origin: center;
  transform-box: fill-box;
  animation: bp-head-pulse 1.8s ease-in-out infinite;
}
@keyframes bp-head-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.bp-head-ring {
  transform-origin: center;
  transform-box: fill-box;
  animation: bp-head-ring 1.8s ease-out infinite;
  opacity: 0;
}
@keyframes bp-head-ring {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(3.2); opacity: 0; }
}

.bp-demo {
  transform-origin: center;
  animation: bp-demo-blink 3s ease-in-out infinite;
  animation-delay: var(--d, 0s);
}
@keyframes bp-demo-blink {
  0%, 100% { opacity: 0.35; }
  20%, 60% { opacity: 1; }
}

// LAUNCH
.bp-launch-packet {
  animation: bp-launch-travel 3.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
@keyframes bp-launch-travel {
  0% { transform: translateX(0); opacity: 0; }
  8% { opacity: 1; }
  30% { transform: translateX(70px); opacity: 1; }
  35% { transform: translateX(70px); opacity: 0.25; }
  55% { transform: translateX(190px); opacity: 0.25; }
  60% { transform: translateX(190px); opacity: 1; }
  90% { transform: translateX(260px); opacity: 1; }
  100% { transform: translateX(260px); opacity: 0; }
}

.bp-led {
  opacity: 0.4;
  animation: bp-led-blink 1.4s ease-in-out infinite;
  animation-delay: var(--d, 0s);
}
@keyframes bp-led-blink {
  0%, 100% { opacity: 0.3; }
  40%, 60% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bp-flow, .bp-node, .bp-ring, .bp-packet--a, .bp-packet--b,
  .bp-mstone, .bp-ledger, .bp-hero, .bp-block--a, .bp-block--b,
  .bp-text-line, .bp-ghost, .bp-head, .bp-head-ring, .bp-demo,
  .bp-launch-packet, .bp-led {
    animation: none;
  }
  .bp-mstone { opacity: 1; }
}

.bp-canvas-caption {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--ls-meta);
  text-transform: uppercase;
  color: var(--muted);
  border-top: 1px solid var(--border);
  padding-top: 8px;
  min-height: 26px;
}

.bp-caption__desc {
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--muted);
  font-style: italic;
  font-family: var(--font-serif);
  font-size: 12px;
  flex: 1;
  min-width: 200px;
}

// RIGHT — stage list
.bp-stages {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar { width: 0; }
}

.bp-stage {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  padding: 14px 12px 14px 0;
  border-bottom: 1px solid var(--border);
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  color: var(--fg);
  font-family: inherit;
  text-align: left;
  cursor: none;
  opacity: 0.58;
  transition: opacity 0.3s ease, padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover { opacity: 0.9; }

  &--active {
    opacity: 1;
    padding-left: 12px;
  }

  &__num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: var(--ls-meta);
    color: var(--muted);
    padding-top: 6px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__name {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: var(--fs-h4);
    letter-spacing: var(--ls-display);
    text-transform: uppercase;
    line-height: 1.05;
    color: var(--fg);
  }

  &__meta {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: var(--ls-meta);
    text-transform: uppercase;
    color: var(--muted);

    em {
      font-style: normal;
      opacity: 0.55;
      margin-right: 4px;
    }
  }

  &__dot {
    opacity: 0.35;
    margin: 0 6px;
  }

  &__desc {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: clamp(13px, 1vw, 15px);
    line-height: 1.5;
    color: var(--muted);
    margin-top: 4px;
    max-width: 60ch;
  }

  @media (max-width: 768px) {
    &__name { font-size: 20px; }
  }
}
</style>
