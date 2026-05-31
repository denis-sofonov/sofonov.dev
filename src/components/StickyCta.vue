<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { t } = useI18n()

const scrolledEnough = ref(false)
const contactsInView = ref(false)
const visible = ref(false)

let scrollRaf = 0
let contactsObserver: IntersectionObserver | null = null

// Single, steady invitation — this is a résumé site, not a sales funnel.
const label = computed(() => t('cta.getInTouch'))

function update() {
  visible.value = scrolledEnough.value && !contactsInView.value
}

function onScroll() {
  cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(() => {
    scrolledEnough.value = window.scrollY > window.innerHeight * 0.55
    update()
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Hide the CTA once the contacts section is visible — the section IS the CTA.
  // Wait a frame so the section has mounted under RouterView.
  requestAnimationFrame(() => {
    const contacts = document.getElementById('contacts')
    if (!contacts) return
    contactsObserver = new IntersectionObserver(
      ([entry]) => {
        contactsInView.value = entry.isIntersecting
        update()
      },
      { threshold: 0.15 },
    )
    contactsObserver.observe(contacts)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(scrollRaf)
  contactsObserver?.disconnect()
})
</script>

<template>
  <a
    href="https://t.me/denis_sofonov"
    target="_blank"
    rel="noopener"
    class="sticky-cta"
    :class="{ 'is-visible': visible }"
    data-magnetic="120"
    data-magnetic-strength="0.3"
    data-cursor="cta"
    :data-cursor-text="t('cta.sayHi')"
  >
    <span class="sticky-cta__inner" data-magnetic-inner>
      <Transition name="cta-swap" mode="out-in">
        <span :key="label" class="sticky-cta__label">{{ label }}</span>
      </Transition>
    </span>
  </a>
</template>

<style lang="scss" scoped>
.sticky-cta {
  position: fixed;
  left: 50%;
  bottom: 48px;
  z-index: 9997;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  /* Width breathes with the label — long names like "обсудить поддержка
     и ретейнер" need padding, short ones shouldn't look stretched. */
  min-width: 220px;
  height: 38px;
  padding: 0 24px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 24px);
  transition:
    opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    min-width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background: #0a0a0a;
    color: #fff;
  }

  :root[data-theme='dark'] &:hover {
    background: #fff;
    color: var(--accent);
  }

  @media (max-width: 640px) {
    bottom: 32px;
    min-width: 200px;
    padding: 0 18px;
    font-size: 12px;
  }
}

.sticky-cta__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.sticky-cta__label {
  position: relative;
  white-space: nowrap;
}
.cta-swap-enter-active,
.cta-swap-leave-active { transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.cta-swap-enter-from { opacity: 0; transform: translateY(6px); }
.cta-swap-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
