import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { Ref } from 'vue'

type Mode = 'words' | 'chars'

function collectTextNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT
      const p = node.parentElement
      if (!p) return NodeFilter.FILTER_REJECT
      if (p.closest('[data-split-inner]')) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  const out: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) out.push(n as Text)
  return out
}

function splitNode(textNode: Text, mode: Mode, counter: { i: number }) {
  const raw = textNode.textContent || ''
  const frag = document.createDocumentFragment()
  const parts = mode === 'chars'
    ? raw.split('')
    : raw.split(/(\s+)/)

  for (const part of parts) {
    if (!part) continue
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(part))
      continue
    }

    if (mode === 'chars') {
      const mask = document.createElement('span')
      mask.className = 'mask-tok'
      mask.setAttribute('data-split-inner', '')
      mask.style.setProperty('--i', String(counter.i))
      const inner = document.createElement('span')
      inner.className = 'mask-tok__inner'
      inner.textContent = part
      mask.appendChild(inner)
      frag.appendChild(mask)
      counter.i++
    } else {
      const mask = document.createElement('span')
      mask.className = 'mask-tok'
      mask.setAttribute('data-split-inner', '')
      mask.style.setProperty('--i', String(counter.i))
      const inner = document.createElement('span')
      inner.className = 'mask-tok__inner'
      inner.textContent = part
      mask.appendChild(inner)
      frag.appendChild(mask)
      counter.i++
    }
  }
  textNode.parentNode?.replaceChild(frag, textNode)
}

export function splitText(root: HTMLElement, mode: Mode = 'words') {
  const existing = root.querySelector('[data-split-inner]')
  if (existing) {
    const original = root.getAttribute('data-split-original')
    if (original != null) root.innerHTML = original
  } else {
    root.setAttribute('data-split-original', root.innerHTML)
  }

  const nodes = collectTextNodes(root)
  const counter = { i: 0 }
  for (const tn of nodes) splitNode(tn, mode, counter)
  root.style.setProperty('--count', String(Math.max(counter.i, 1)))
  root.setAttribute('data-split-applied', mode)
}

export function useMaskReveal(
  targetRef: Ref<HTMLElement | null> | Ref<HTMLElement | undefined>,
  opts: { mode?: Mode; watchSource?: () => unknown } = {},
) {
  const mode = opts.mode || 'words'

  const apply = async () => {
    await nextTick()
    const el = targetRef.value
    if (el) splitText(el, mode)
  }

  onMounted(apply)

  if (opts.watchSource) {
    watch(opts.watchSource, apply, { flush: 'post' })
  }

  onUnmounted(() => {
    const el = targetRef.value
    if (!el) return
    const original = el.getAttribute('data-split-original')
    if (original != null) {
      el.innerHTML = original
      el.removeAttribute('data-split-original')
      el.removeAttribute('data-split-applied')
    }
  })
}
