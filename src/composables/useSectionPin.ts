import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

export interface PinState {
  /** Overall progress across the whole pinned track, 0→1. */
  progress: number
  /** Integer segment index, 0..(segments-1). */
  segment: number
  /** Progress within the current segment, 0→1. */
  segmentProgress: number
  /** How far scrolled past the section's top, in px. */
  pxScrolled: number
  /** Whether the section is currently in the viewport. */
  active: boolean
}

/**
 * Turns a section into a sticky-pinned track.
 *
 * DOM convention (in the component template):
 *   <section ref="wrapEl" class="pin">
 *     <div class="pin__sticky">
 *       ... pinned content reads `state.progress` ...
 *     </div>
 *   </section>
 *
 * The wrap gets `height: (1 + scrollSegments) * 100vh` so the sticky child stays pinned
 * for `scrollSegments * 100vh` of scroll before unpinning.
 */
export function useSectionPin(
  wrapRef: Ref<HTMLElement | null>,
  opts: {
    segments: number
    vpPerSegment?: number
    /** Scroll-snap dock count override. Defaults to `segments`. Use when the
     * section's internal slides are too close together to be useful docks
     * (e.g. FAQ's 0.55vh-per-question reel compressed to a single section dock). */
    snapSegments?: number
    /** Snap viewport-per-segment override. Defaults to `vpPerSegment`. */
    snapVp?: number
  },
) {
  const state = ref<PinState>({
    progress: 0,
    segment: 0,
    segmentProgress: 0,
    pxScrolled: 0,
    active: false,
  })

  const segments = Math.max(1, opts.segments)
  // How many viewport heights to allocate per segment. Default 1 (one screen
  // per slide). Reduce to compress sections with lots of small slides.
  const vpPerSegment = Math.max(0.2, opts.vpPerSegment ?? 1)
  const snapSegments = opts.snapSegments ?? segments
  const snapVp = opts.snapVp ?? vpPerSegment
  // Reduced-motion + narrow-touch: collapse the pinned track into a single
  // static viewport and jump the sticky child to its "final" frame. Consumers
  // render progress=1 (catalog view for Services, day 70 for Process, etc.)
  // Touch devices under 768px get the same treatment — pinning a 400svh lane
  // on a phone is a UX tax nobody asked for.
  const reduced = typeof matchMedia !== 'undefined' && (
    matchMedia('(prefers-reduced-motion: reduce)').matches
    || (matchMedia('(hover: none)').matches && matchMedia('(max-width: 768px)').matches)
  )
  let raf = 0
  let onScroll: (() => void) | null = null
  let onResize: (() => void) | null = null

  function setWrapHeight() {
    const el = wrapRef.value
    if (!el) return
    if (reduced) {
      el.style.setProperty('--pin-height', '100svh')
      // Dock at one point (section top) only — no per-segment snapping.
      el.dataset.snapSegments = '1'
      el.dataset.snapVp = '1'
      return
    }
    // 1 * 100vh for the sticky display + (segments * vpPerSegment) of travel.
    el.style.setProperty('--pin-height', `${(1 + segments * vpPerSegment) * 100}svh`)
    // Expose snap docks to the global snap handler (in App.vue) so it doesn't
    // need a parallel hardcoded config.
    el.dataset.snapSegments = String(snapSegments)
    el.dataset.snapVp = String(snapVp)
  }

  function compute() {
    const el = wrapRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const trackPx = segments * vpPerSegment * vh
    const scrolled = Math.max(0, Math.min(trackPx, -rect.top))
    const progress = trackPx > 0 ? scrolled / trackPx : 0
    const segF = progress * segments
    const segment = Math.min(segments - 1, Math.floor(segF))
    const segmentProgress = Math.min(1, Math.max(0, segF - segment))
    const active = rect.bottom > 0 && rect.top < vh

    state.value = { progress, segment, segmentProgress, pxScrolled: scrolled, active }

    // expose as CSS vars on the wrap for pure-CSS scrubbing
    el.style.setProperty('--progress', progress.toFixed(4))
    el.style.setProperty('--segment', String(segment))
    el.style.setProperty('--seg-progress', segmentProgress.toFixed(4))

    raf = requestAnimationFrame(compute)
  }

  function start() {
    if (raf) return
    if (reduced) {
      // Skip the RAF loop entirely — one snapshot at the track's end so
      // consumers render the "summary" frame (final segment, fully advanced).
      state.value = {
        progress: 1,
        segment: segments - 1,
        segmentProgress: 1,
        pxScrolled: 0,
        active: true,
      }
      const el = wrapRef.value
      if (el) {
        el.style.setProperty('--progress', '1')
        el.style.setProperty('--segment', String(segments - 1))
        el.style.setProperty('--seg-progress', '1')
      }
      return
    }
    raf = requestAnimationFrame(compute)
  }
  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  onMounted(() => {
    setWrapHeight()
    start()
    onResize = () => setWrapHeight()
    window.addEventListener('resize', onResize)
  })

  // If component remounts or ref populates late, handle that
  watch(wrapRef, (el) => {
    if (el) setWrapHeight()
  })

  onUnmounted(() => {
    stop()
    if (onScroll) window.removeEventListener('scroll', onScroll)
    if (onResize) window.removeEventListener('resize', onResize)
  })

  return state
}
