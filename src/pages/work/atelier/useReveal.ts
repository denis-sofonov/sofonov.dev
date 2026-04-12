import { onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Atelier reveal composable — bolder, snappier than Lumen.
 */
export function useReveal(rootRef: Ref<HTMLElement | null>) {
  const tweens: gsap.core.Tween[] = []
  const timelines: gsap.core.Timeline[] = []

  function reveal(
    selector: string,
    options: {
      y?: number
      x?: number
      stagger?: number
      duration?: number
      delay?: number
      start?: string
      ease?: string
    } = {},
  ) {
    if (!rootRef.value) return
    const els = rootRef.value.querySelectorAll(selector)
    if (els.length === 0) return

    const {
      y = 60,
      x = 0,
      stagger = 0.08,
      duration = 1,
      delay = 0,
      start = 'top 85%',
      ease = 'power3.out',
    } = options

    const tween = gsap.fromTo(
      els,
      { y, x, opacity: 0 },
      {
        y: 0, x: 0, opacity: 1,
        duration, delay, stagger, ease,
        scrollTrigger: {
          trigger: rootRef.value,
          start,
          toggleActions: 'play none none none',
        },
      },
    )
    tweens.push(tween)
  }

  function tween(selector: string, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) {
    if (!rootRef.value) return null
    const els = rootRef.value.querySelectorAll(selector)
    if (els.length === 0) return null
    const t = gsap.fromTo(els, fromVars, toVars)
    tweens.push(t)
    return t
  }

  function timeline(opts?: gsap.TimelineVars) {
    const tl = gsap.timeline(opts)
    timelines.push(tl)
    return tl
  }

  onUnmounted(() => {
    tweens.forEach((t) => t.kill())
    timelines.forEach((t) => t.kill())
    if (rootRef.value) {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && rootRef.value!.contains(st.trigger as Node)) st.kill()
      })
    }
  })

  return { reveal, tween, timeline }
}
