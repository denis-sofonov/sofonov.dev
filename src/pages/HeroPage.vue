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

function initParticleText(canvas: HTMLCanvasElement, text: string): { cleanup: () => void; resample: (newText: string) => void } {
  const parent = canvas.parentElement!
  const ctx = canvas.getContext('2d')!
  const dpr = Math.min(window.devicePixelRatio, 2)
  let currentText = text

  let particles: { ox: number; oy: number; x: number; y: number; vx: number; vy: number; r: number }[] = []
  let mouseX = -9999
  let mouseY = -9999
  let globalMouseX = 0.5
  let globalMouseY = 0.5
  let tiltX = 0
  let tiltY = 0
  const TILT_MAX = 12
  const TILT_LERP = 0.06
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

    const lines = currentText.split(' ')
    const fontSize = Math.min(w * 0.17, 200)
    offCtx.font = `600 ${fontSize}px "Oswald", "Bebas Neue", Impact, sans-serif`
    offCtx.fillStyle = '#fff'
    offCtx.textBaseline = 'middle'
    offCtx.textAlign = 'center'

    const lineHeight = fontSize * 0.95
    const totalHeight = lines.length * lineHeight
    const startY = (h - totalHeight) / 2 + lineHeight / 2

    lines.forEach((line, i) => {
      offCtx.fillText(line.toUpperCase(), w / 2, startY + i * lineHeight)
    })

    const imageData = offCtx.getImageData(0, 0, w, h)
    const data = imageData.data
    const gap = 2
    const newParticles: typeof particles = []

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const idx = (y * w + x) * 4
        if (data[idx + 3] > 128) {
          const jx = (Math.random() - 0.5) * gap * 2.0
          const jy = (Math.random() - 0.5) * gap * 2.0
          if (data[idx + 3] < 180 && Math.random() < 0.3) continue
          if (Math.random() < 0.03) continue
          if (Math.random() < 0.3) {
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
    globalMouseX = e.clientX / window.innerWidth
    globalMouseY = e.clientY / window.innerHeight
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
  let assembleTime = 3.0 // seconds of stronger pull to assemble
  function animate() {
    animId = requestAnimationFrame(animate)
    const w = parent.clientWidth, h = parent.clientHeight
    ctx.clearRect(0, 0, w, h)
    if (assembleTime > 0) assembleTime -= 0.016
    const targetTiltY = (globalMouseX - 0.5) * TILT_MAX * 2
    const targetTiltX = -(globalMouseY - 0.5) * TILT_MAX
    tiltX += (targetTiltX - tiltX) * TILT_LERP
    tiltY += (targetTiltY - tiltY) * TILT_LERP
    canvas.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    const colorBase = getColor()
    const time = performance.now() * 0.001
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Idle drift — each particle gently floats around its home
      const seed = i * 1.618
      const driftX = Math.sin(time * 0.4 + seed * 2.3) * 1.2
      const driftY = Math.cos(time * 0.35 + seed * 3.1) * 1.2

      const targetX = p.ox + driftX
      const targetY = p.oy + driftY

      if (assembleTime > 0) {
        // Assembling — direct lerp to home, no velocity
        const t = 0.04
        p.x += (targetX - p.x) * t
        p.y += (targetY - p.y) * t
        p.vx = 0; p.vy = 0
      } else {
        // Normal — velocity-based with brush interaction
        p.vx *= 0.97; p.vy *= 0.97
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy)
        const homeX = targetX-p.x, homeY = targetY-p.y
        const homePull = speed < 2 ? 0.015 : 0.003
        p.vx += homeX*homePull; p.vy += homeY*homePull
        p.x += p.vx; p.y += p.vy
      }
      const distFromHome = Math.sqrt((p.x-p.ox)**2 + (p.y-p.oy)**2)
      const alpha = Math.max(0.15, 0.85 - distFromHome*0.003)
      ctx.fillStyle = colorBase + alpha + ')'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
      ctx.fill()
    }
  }

  sampleText()

  // Scatter particles — they'll assemble into text via lerp
  const w = parent.clientWidth, h = parent.clientHeight
  for (const p of particles) {
    p.x = Math.random() * w
    p.y = Math.random() * h
    p.vx = 0
    p.vy = 0
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
    assembleTime = 3.0
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
    // Skip preloader — init particles directly
    await nextTick()
    if (particleCanvas.value) {
      const result = initParticleText(particleCanvas.value, t('name'))
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

    <PageFrame v-if="preloaderDone" num="01" section="MAIN" subtitle="HERO" sheet="SHEET 01/08">
      <div class="hero-page">
        <canvas ref="particleCanvas" class="hero__canvas"></canvas>
        <div class="hero__bottom">
          <div class="hero__left">
            <span class="hero__label">[ {{ t('heroLabels.availableForHire') }} ]</span>
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
  font-size: 11px;
  letter-spacing: var(--ls-wide);
  text-transform: uppercase;
  color: var(--muted);
}
.hero__desc {
  font-family: var(--font-serif);
  font-size: clamp(18px, 2.5vw, 28px);
  font-style: italic;
  color: var(--fg);
  max-width: 320px;
  line-height: 1.3;
  em { font-style: italic; }
}
.hero__right {
  max-width: 380px;
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
