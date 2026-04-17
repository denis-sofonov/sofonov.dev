<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const active = ref(false)

let drawing = false
let lastX = 0
let lastY = 0
let prevMidX = 0
let prevMidY = 0
let dpr = 1
let ro: ResizeObserver | null = null

function getCtx(): CanvasRenderingContext2D | null {
  const canvas = canvasRef.value
  if (!canvas) return null
  return canvas.getContext('2d')
}

function getPageEl(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.page')
}

function resize() {
  const canvas = canvasRef.value
  const page = getPageEl()
  if (!canvas || !page) return

  // Snapshot existing drawing so it survives resize
  const prev = document.createElement('canvas')
  prev.width = canvas.width
  prev.height = canvas.height
  if (canvas.width && canvas.height) {
    const prevCtx = prev.getContext('2d')
    prevCtx?.drawImage(canvas, 0, 0)
  }

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = page.scrollWidth || page.clientWidth
  const h = page.scrollHeight || page.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  if (prev.width && prev.height) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(prev, 0, 0)
    ctx.restore()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
}

function clear() {
  const canvas = canvasRef.value
  const ctx = getCtx()
  if (!canvas || !ctx) return
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Shift') {
    active.value = true
    document.documentElement.classList.add('draw-active')
  }
  if (e.key === 'Escape') clear()
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'Shift') {
    active.value = false
    drawing = false
    document.documentElement.classList.remove('draw-active')
  }
}

function onWindowBlur() {
  active.value = false
  drawing = false
  document.documentElement.classList.remove('draw-active')
}

function docX(clientX: number) {
  return clientX + window.scrollX
}
function docY(clientY: number) {
  return clientY + window.scrollY
}

function onMouseDown(e: MouseEvent) {
  if (!e.shiftKey) return
  e.preventDefault()
  drawing = true
  lastX = docX(e.clientX)
  lastY = docY(e.clientY)
  prevMidX = lastX
  prevMidY = lastY
  const ctx = getCtx()
  if (ctx) {
    ctx.beginPath()
    ctx.arc(lastX, lastY, 1.3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(217, 33, 31, 0.92)'
    ctx.fill()
  }
}

function onMouseMove(e: MouseEvent) {
  if (!drawing || !e.shiftKey) return
  const ctx = getCtx()
  if (!ctx) return
  const x = docX(e.clientX)
  const y = docY(e.clientY)
  const midX = (lastX + x) / 2
  const midY = (lastY + y) / 2
  ctx.strokeStyle = 'rgba(217, 33, 31, 0.92)'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(prevMidX, prevMidY)
  ctx.quadraticCurveTo(lastX, lastY, midX, midY)
  ctx.stroke()
  prevMidX = midX
  prevMidY = midY
  lastX = x
  lastY = y
}

function onMouseUp() {
  drawing = false
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseup', onMouseUp)

  const page = getPageEl()
  if (page && 'ResizeObserver' in window) {
    ro = new ResizeObserver(() => resize())
    ro.observe(page)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  document.documentElement.classList.remove('draw-active')
  ro?.disconnect()
})
</script>

<template>
  <canvas ref="canvasRef" class="draw-layer" aria-hidden="true" />
  <div class="draw-hint" :class="{ 'is-on': active }" aria-hidden="true">
    <span class="draw-hint__dot" />
    drawing mode · esc to clear
  </div>
</template>

<style lang="scss" scoped>
.draw-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.draw-hint {
  position: fixed;
  bottom: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  pointer-events: none;
  z-index: 9998;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &.is-on {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 640px) { display: none; }
}

.draw-hint__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  animation: draw-pulse 1.4s ease-in-out infinite;
}

@keyframes draw-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.7); }
}
</style>
