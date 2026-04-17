import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

/**
 * Runs a GSAP entrance animation the first time elements matching `selector`
 * scroll into view (via IntersectionObserver). Fires once per element.
 *
 * @param selector CSS selector to target
 * @param from     GSAP "from" vars (e.g. { y: 20 }) — elements animate FROM these values TO their natural state
 */
export function useRevealOnScroll(
  selector: string,
  from: gsap.TweenVars = {},
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const els = document.querySelectorAll<HTMLElement>(selector)
    if (!els.length) return

    // Pre-hide
    gsap.set(els, { opacity: 0, ...from })

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          observer!.unobserve(entry.target)
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'transform',
          })
        })
      },
      { threshold: 0.1 },
    )

    els.forEach(el => observer!.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
