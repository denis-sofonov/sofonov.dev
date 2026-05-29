<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const dot = ref<HTMLDivElement | null>(null)
const ring = ref<HTMLDivElement | null>(null)
const label = ref<HTMLDivElement | null>(null)

let raf = 0
let cleanups: Array<() => void> = []

onMounted(() => {
  if (matchMedia('(hover: none)').matches) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!dot.value || !ring.value || !label.value) return

  const dotEl = dot.value
  const ringEl = ring.value
  const labelEl = label.value

  document.documentElement.classList.add('has-custom-cursor')

  let mx = window.innerWidth / 2
  let my = window.innerHeight / 2
  let dx = mx, dy = my
  let rx = mx, ry = my
  let visible = false
  let pressed = false

  type Mode = 'idle' | 'link' | 'cta' | 'expand' | 'drag' | 'text'
  let mode: Mode = 'idle'
  let setText = ''

  const onMove = (e: PointerEvent) => {
    mx = e.clientX
    my = e.clientY
    if (!visible) {
      visible = true
      dotEl.style.opacity = '1'
      ringEl.style.opacity = '1'
      dx = mx; dy = my; rx = mx; ry = my
    }
  }
  const onLeave = () => {
    visible = false
    dotEl.style.opacity = '0'
    ringEl.style.opacity = '0'
  }
  const onDown = () => {
    pressed = true
    ringEl.classList.add('is-pressed')
    dotEl.classList.add('is-pressed')
    spawnRipple(mx, my)
  }
  const onUp = () => {
    pressed = false
    ringEl.classList.remove('is-pressed')
    dotEl.classList.remove('is-pressed')
  }

  function spawnRipple(x: number, y: number) {
    const el = document.createElement('div')
    el.className = 'cursor-ripple'
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    document.body.appendChild(el)
    requestAnimationFrame(() => el.classList.add('is-on'))
    setTimeout(() => el.remove(), 620)
  }

  function findContext(t: EventTarget | null): { mode: Mode; text: string } {
    if (!(t instanceof Element)) return { mode: 'idle', text: '' }
    const cta = t.closest('[data-cursor="cta"]') as HTMLElement | null
    if (cta) return { mode: 'cta', text: cta.getAttribute('data-cursor-text') || 'click' }
    const expand = t.closest('[data-cursor="expand"]') as HTMLElement | null
    if (expand) return { mode: 'expand', text: '' }
    const drag = t.closest('[data-cursor="drag"]') as HTMLElement | null
    if (drag) return { mode: 'drag', text: drag.getAttribute('data-cursor-text') || 'drag' }
    if (t.closest('input, textarea, [contenteditable="true"]')) return { mode: 'text', text: '' }
    if (t.closest('a, button, [role="button"], [data-magnetic], label, select, summary, .service__head')) {
      return { mode: 'link', text: '' }
    }
    return { mode: 'idle', text: '' }
  }

  const onOver = (e: PointerEvent) => {
    const ctx = findContext(e.target)
    if (ctx.mode !== mode || ctx.text !== setText) {
      mode = ctx.mode
      setText = ctx.text
      ringEl.dataset.mode = mode
      dotEl.dataset.mode = mode
      labelEl.textContent = setText
      labelEl.dataset.show = setText ? '1' : '0'
    }
  }

  const tick = () => {
    // Dot eases hard (near-1:1 with lag)
    dx += (mx - dx) * 0.42
    dy += (my - dy) * 0.42
    // Ring drags behind
    rx += (mx - rx) * 0.16
    ry += (my - ry) * 0.16

    dotEl.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) translate(-50%, -50%)`
    ringEl.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) translate(-50%, -50%)`

    raf = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerover', onOver, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointerleave', onLeave)
  document.addEventListener('mouseleave', onLeave)

  raf = requestAnimationFrame(tick)

  cleanups.push(() => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerover', onOver)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('mouseleave', onLeave)
    cancelAnimationFrame(raf)
    document.documentElement.classList.remove('has-custom-cursor')
    void pressed
  })
})

onUnmounted(() => {
  cleanups.forEach(fn => fn())
  cleanups = []
})
</script>

<template>
  <div ref="ring" class="cursor-ring" aria-hidden="true">
    <div ref="label" class="cursor-label" data-show="0"></div>
  </div>
  <div ref="dot" class="cursor-dot" aria-hidden="true"></div>
</template>

<style lang="scss" scoped>
.cursor-dot,
.cursor-ring {
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 100000;
  opacity: 0;
  will-change: transform;
  mix-blend-mode: difference;
}

.cursor-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              height 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.2s ease,
              background 0.2s ease;

  &[data-mode='link'],
  &[data-mode='cta'],
  &[data-mode='drag'] {
    width: 0;
    height: 0;
  }
  &[data-mode='expand'] {
    width: 4px;
    height: 4px;
  }
  &[data-mode='text'] {
    width: 2px;
    height: 18px;
    border-radius: 0;
  }
  &.is-pressed {
    width: 3px;
    height: 3px;
  }
}

.cursor-ring {
  width: 34px;
  height: 34px;
  border: 1px solid #fff;
  border-radius: 50%;
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.35s ease,
              background-color 0.35s ease,
              opacity 0.25s ease,
              border-width 0.35s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &[data-mode='idle'] {
    width: 34px;
    height: 34px;
    border-width: 1px;
  }
  &[data-mode='link'] {
    width: 52px;
    height: 52px;
    border-width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
  &[data-mode='cta'] {
    width: 88px;
    height: 88px;
    background: #fff;
    border-color: transparent;
  }
  &[data-mode='expand'] {
    width: 72px;
    height: 72px;
    border-width: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  &[data-mode='drag'] {
    width: 108px;
    height: 108px;
    background: #fff;
    border-color: transparent;
  }
  &[data-mode='text'] {
    width: 0;
    height: 0;
    border-width: 0;
  }
  &.is-pressed {
    transform-origin: center;
    filter: brightness(1.1);
  }
}

.cursor-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #000;
  mix-blend-mode: normal;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.25s ease;

  &[data-show='1'] {
    transform: scale(1);
    opacity: 1;
  }
}

@media (hover: none), (prefers-reduced-motion: reduce) {
  .cursor-dot, .cursor-ring { display: none; }
}
</style>

<style lang="scss">
/* Universal — the old selector list missed SVG/canvas/plain divs and the
   native arrow kept leaking through. `*` forces hide everywhere. */
html.has-custom-cursor,
html.has-custom-cursor * {
  cursor: none !important;
}
html.has-custom-cursor input,
html.has-custom-cursor textarea,
html.has-custom-cursor [contenteditable='true'] {
  cursor: text !important;
}

.cursor-ripple {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--accent, #c92a2a);
  pointer-events: none;
  z-index: 99999;
  opacity: 0.8;
  transform: translate(-50%, -50%) scale(0.6);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease;

  &.is-on {
    transform: translate(-50%, -50%) scale(6);
    opacity: 0;
  }
}
</style>
