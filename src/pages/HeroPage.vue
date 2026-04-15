<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import PageFrame from '../components/PageFrame.vue'

const { t, locale } = useI18n()

const particleCanvas = ref<HTMLCanvasElement | null>(null)
let particleCleanup: (() => void) | null = null
let particleResample: ((text: string) => void) | null = null

const hasVisited = sessionStorage.getItem('visited') === '1'
const preloaderDone = ref(hasVisited)
const preloaderCount = ref(hasVisited ? 100 : 0)

function initParticleText(canvas: HTMLCanvasElement, text: string, scatter: boolean = true): { cleanup: () => void; resample: (newText: string) => void } {
  const parent = canvas.parentElement!
  const ctx = canvas.getContext('2d')!
  const dpr = Math.min(window.devicePixelRatio, 2)
  let currentText = text

  let particles: { ox: number; oy: number; x: number; y: number; vx: number; vy: number; r: number }[] = []
  let mouseX = -9999
  let mouseY = -9999
  const DOT_RADIUS = 1.0

  function getColor() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
    return isDark ? 'rgba(232,232,232,' : 'rgba(10,10,10,'
  }

  function sampleText() {
    const w = parent.clientWidth
    const h = parent.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const offCanvas = document.createElement('canvas')
    offCanvas.width = w
    offCanvas.height = h
    const offCtx = offCanvas.getContext('2d')!

    const lines = currentText.split('\n')
    const fontSize = Math.min(w * 0.14, 170)
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
    offCtx.font = `700 ${fontSize}px "Unbounded", "Onest", system-ui, sans-serif`
    offCtx.fillStyle = '#fff'
    offCtx.textBaseline = 'middle'
    offCtx.textAlign = 'center'
    void isDark

    const lineHeight = fontSize * 1.0
    const totalHeight = lines.length * lineHeight
    const opticalOffset = h * 0.04
    const startY = (h - totalHeight) / 2 + lineHeight / 2 - opticalOffset

    lines.forEach((line, i) => {
      offCtx.fillText(line, w / 2, startY + i * lineHeight)
    })

    const imageData = offCtx.getImageData(0, 0, w, h)
    const data = imageData.data
    const gap = 3
    const newParticles: typeof particles = []

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const idx = (y * w + x) * 4
        if (data[idx + 3] > 128) {
          const jx = (Math.random() - 0.5) * gap * 2.0
          const jy = (Math.random() - 0.5) * gap * 2.0
          if (data[idx + 3] < 180 && Math.random() < 0.3) continue
          if (Math.random() < 0.03) continue
          if (Math.random() < 0.18) {
            newParticles.push({ ox: x+jx+(Math.random()-0.5)*3, oy: y+jy+(Math.random()-0.5)*3, x: x+jx+(Math.random()-0.5)*3, y: y+jy+(Math.random()-0.5)*3, vx:0, vy:0, r: DOT_RADIUS*(0.4+Math.random()*0.6) })
          }
          newParticles.push({ ox: x+jx, oy: y+jy, x: x+jx, y: y+jy, vx:0, vy:0, r: DOT_RADIUS*(0.6+Math.random()*0.8) })
        }
      }
    }
    particles = newParticles
  }

  function onMouseMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const prevX = mouseX
    const prevY = mouseY
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
    if (assembleTime > 0) return
    if (prevX < -999) return
    const mvx = mouseX - prevX, mvy = mouseY - prevY
    const speed = Math.sqrt(mvx*mvx + mvy*mvy)
    if (speed < 1) return
    const nx = mvx/speed, ny = mvy/speed, force = Math.min(speed, 40)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dx = p.x - mouseX, dy = p.y - mouseY
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < 60) {
        const proximity = 1 - dist/60
        const spread = (Math.random()-0.5)*0.6
        p.vx += (nx + (-ny)*spread) * force * proximity * 0.5
        p.vy += (ny + nx*spread) * force * proximity * 0.5
      }
    }
  }

  function onMouseLeave() { mouseX = -9999; mouseY = -9999 }

  let animId = 0
  let assembleTime = 1.2 // seconds of stronger pull to assemble
  let lastT = performance.now()
  function animate() {
    animId = requestAnimationFrame(animate)
    const now = performance.now()
    const dt = Math.min((now - lastT) / 1000, 0.05)
    lastT = now
    const w = parent.clientWidth, h = parent.clientHeight
    ctx.clearRect(0, 0, w, h)
    if (assembleTime > 0) assembleTime -= dt
    const colorBase = getColor()
    const assembling = assembleTime > 0
    const time = assembling ? 0 : now * 0.001

    if (assembling) {
      // Fast path — simple lerp to home, constant alpha, no drift math
      const lerp = 0.05
      ctx.fillStyle = colorBase + '0.85)'
      ctx.beginPath()
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += (p.ox - p.x) * lerp
        p.y += (p.oy - p.y) * lerp
        ctx.moveTo(p.x + p.r, p.y)
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
      }
      ctx.fill()
      return
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Idle drift — each particle gently floats around its home
      const seed = i * 1.618
      const driftX = Math.sin(time * 0.4 + seed * 2.3) * 1.2
      const driftY = Math.cos(time * 0.35 + seed * 3.1) * 1.2

      const targetX = p.ox + driftX
      const targetY = p.oy + driftY

      // Velocity-based with brush interaction
      p.vx *= 0.97; p.vy *= 0.97
      const vmag2 = p.vx*p.vx + p.vy*p.vy
      const homeX = targetX-p.x, homeY = targetY-p.y
      const homePull = vmag2 < 4 ? 0.015 : 0.003
      p.vx += homeX*homePull; p.vy += homeY*homePull
      p.x += p.vx; p.y += p.vy

      const dhx = p.x-p.ox, dhy = p.y-p.oy
      const distSq = dhx*dhx + dhy*dhy
      const alpha = distSq > 48400 ? 0.15 : Math.max(0.15, 0.85 - Math.sqrt(distSq)*0.003)
      ctx.fillStyle = colorBase + alpha + ')'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
      ctx.fill()
    }
  }

  sampleText()

  if (scatter) {
    // Scatter particles — they'll assemble into text via lerp
    const w = parent.clientWidth, h = parent.clientHeight
    for (const p of particles) {
      p.x = Math.random() * w
      p.y = Math.random() * h
      p.vx = 0
      p.vy = 0
    }
  } else {
    assembleTime = 0
  }

  animId = requestAnimationFrame(animate)
  canvas.addEventListener('mousemove', onMouseMove, { passive: true })
  canvas.addEventListener('mouseleave', onMouseLeave)
  function onResize() { sampleText() }
  window.addEventListener('resize', onResize)
  const observer = new MutationObserver(() => {})
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  function resample(newText: string) {
    // Save old particle positions
    const oldPositions = particles.map(p => ({ x: p.x, y: p.y }))
    currentText = newText
    sampleText()
    // Assign old positions to new particles so they fly from old text to new text
    const w = parent.clientWidth, h = parent.clientHeight
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      if (i < oldPositions.length) {
        p.x = oldPositions[i].x
        p.y = oldPositions[i].y
      } else {
        p.x = Math.random() * w
        p.y = Math.random() * h
      }
      p.vx = 0
      p.vy = 0
    }
    assembleTime = 1.2
  }

  return {
    cleanup: () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    },
    resample,
  }
}

onMounted(async () => {
  if (hasVisited) {
    // Skip preloader — init particles directly, no scatter (instant)
    await nextTick()
    if (particleCanvas.value) {
      const result = initParticleText(particleCanvas.value, t('name'), false)
      particleCleanup = result.cleanup
      particleResample = result.resample
    }
    return
  }

  // First visit — show preloader
  const header = document.querySelector('.header') as HTMLElement
  if (header) header.style.opacity = '0'

  const tl = gsap.timeline({
    onComplete: () => {
      preloaderDone.value = true
      sessionStorage.setItem('visited', '1')
      nextTick(() => {
        if (particleCanvas.value) {
          const result = initParticleText(particleCanvas.value, t('name'))
          particleCleanup = result.cleanup
          particleResample = result.resample
        }
        if (header) gsap.to(header, { opacity: 1, duration: 0.5, delay: 0.3 })
      })
    }
  })
  tl.to(preloaderCount, { value: 100, duration: 1.8, ease: 'power2.inOut', snap: { value: 1 } })
})

watch(locale, () => {
  if (particleResample) {
    particleResample(t('name'))
  }
})

onUnmounted(() => { particleCleanup?.() })
</script>

<template>
  <div class="hero-page-wrapper">
    <transition name="preloader-fade">
      <div v-if="!preloaderDone" class="preloader">
        <span class="preloader__count">{{ Math.round(preloaderCount) }}</span>
        <div class="preloader__bar">
          <div class="preloader__fill" :style="{ transform: `scaleX(${preloaderCount / 100})` }"></div>
        </div>
      </div>
    </transition>

    <PageFrame v-if="preloaderDone" :section="t('nav.main')">
      <div class="hero-page">
        <canvas ref="particleCanvas" class="hero__canvas"></canvas>
        <div class="hero__bottom">
          <div class="hero__left">
            <span class="hero__label">
              <span class="hero__dot"></span>
              {{ t('heroLabels.availableForHire') }}
            </span>
            <p class="hero__desc"><em>{{ t('role') }}</em></p>
          </div>
          <div class="hero__right">
            <p class="hero__bio">{{ t('heroPitch') }}</p>
          </div>
        </div>
      </div>
    </PageFrame>
  </div>
</template>

<style lang="scss" scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.preloader__count {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(64px, 14vw, 180px);
  color: var(--fg);
  letter-spacing: var(--ls-display);
}

.preloader__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255,255,255,0.06);
}

.preloader__fill {
  height: 100%;
  background: var(--fg);
  transform-origin: left center;
  transform: scaleX(0);
}
.preloader-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.preloader-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.hero-page-wrapper {
  position: relative;
}

.hero-page {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero__bottom {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  pointer-events: none;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    left: 10px;
    right: 10px;
    bottom: 12px;
  }
}

.hero__left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hero__label {
  font-size: 13px;
  letter-spacing: 0;
  color: var(--fg);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.hero__dot {
  width: 10px;
  height: 10px;
  background: var(--accent);
  flex-shrink: 0;
}
.hero__desc {
  font-family: var(--font-sans);
  font-size: clamp(15px, 1.6vw, 20px);
  font-weight: 500;
  color: var(--fg);
  max-width: 320px;
  line-height: 1.35;
  em { font-style: normal; }
}
.hero__right {
  max-width: 400px;
  text-align: right;
  @media (max-width: 768px) {
    text-align: left;
    max-width: 100%;
  }
}
.hero__bio {
  font-size: 13px;
  line-height: 1.7;
  color: var(--muted);
}
</style>
