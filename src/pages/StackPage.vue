<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, nextTick } from 'vue'
import { animate as anime } from 'animejs'
import PageFrame from '../components/PageFrame.vue'

const { tm, t } = useI18n()

interface Item { name: string; note: string }
interface Group { label: string; items: Item[] }

const groups = computed(() => tm('stack.groups') as Group[])

const activeKey = ref<string | null>(null) // "group-idx:item-idx"
const activeNote = ref<string>('')

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#$%&@01'

function scrambleTo(el: HTMLElement, target: string) {
  const total = target.length
  const frames = 14
  const obj = { f: 0 }
  anime(obj, {
    f: frames,
    duration: 360,
    ease: 'outQuad',
    onUpdate: () => {
      let out = ''
      const reveal = Math.floor((obj.f / frames) * total)
      for (let i = 0; i < total; i++) {
        if (i < reveal) out += target[i]
        else if (target[i] === ' ') out += ' '
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      el.textContent = out
    },
    onComplete: () => { el.textContent = target },
  })
}

function onEnter(e: MouseEvent | FocusEvent, gi: number, ii: number) {
  const key = `${gi}:${ii}`
  activeKey.value = key
  const item = groups.value[gi].items[ii]
  activeNote.value = item.note
  const el = (e.currentTarget as HTMLElement).querySelector('.stack__name') as HTMLElement
  if (el) scrambleTo(el, item.name)
}

function onLeave() {
  activeKey.value = null
  activeNote.value = ''
}

function isActive(gi: number, ii: number) {
  return activeKey.value === `${gi}:${ii}`
}

onMounted(() => {
  nextTick(() => {
    anime('.stack__col-label', {
      opacity: [0, 1],
      duration: 380,
      delay: (_: unknown, i: number) => 100 + i * 70,
      ease: 'outQuad',
    })
    anime('.stack__name', {
      opacity: [0, 1],
      duration: 400,
      delay: (_: unknown, i: number) => 180 + i * 22,
      ease: 'outQuad',
    })
  })
})
</script>

<template>
  <PageFrame num="06" :section="t('nav.stack')">
    <div class="stack-page">
      <header class="stack__head">
        <h1 class="stack__title">{{ t('stack.title') }}</h1>
        <p class="stack__sub">{{ t('stack.subtitle') }}</p>
      </header>

      <div class="stack__note-slot">
        <span class="stack__note" :class="{ 'is-visible': !!activeNote }">{{ activeNote || '—' }}</span>
      </div>

      <div class="stack__grid">
        <section
          v-for="(group, gi) in groups"
          :key="group.label"
          class="stack__col"
        >
          <h3 class="stack__col-label">{{ group.label }}</h3>
          <ul class="stack__list">
            <li
              v-for="(item, ii) in group.items"
              :key="item.name"
              class="stack__item"
              :class="{ 'is-active': isActive(gi, ii), 'is-dim': activeKey && !isActive(gi, ii) }"
              tabindex="0"
              @mouseenter="onEnter($event, gi, ii)"
              @mouseleave="onLeave"
              @focus="onEnter($event, gi, ii)"
              @blur="onLeave"
            >
              <span class="stack__name">{{ item.name }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.stack-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px 24px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) { padding: 24px 12px; gap: 22px; }
}

.stack__head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stack__title {
  font-family: var(--font-display);
  font-size: clamp(36px, 4.2vw, 60px);
  letter-spacing: -0.025em;
  line-height: 0.95;
  color: var(--fg);
  margin: 0;
  font-weight: 500;
}

.stack__sub {
  font-family: var(--font-sans);
  font-size: clamp(14px, 1.1vw, 17px);
  line-height: 1.55;
  color: var(--muted);
  max-width: 54ch;
  margin: 0;
}

// Floating note — reserves space so list doesn't jump
.stack__note-slot {
  min-height: 1.6em;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 0;
  padding-left: 2px;
}
.stack__note {
  opacity: 0;
  transition: opacity 0.2s ease;
  color: var(--fg);

  &.is-visible { opacity: 1; }
}

// Columns
.stack__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.stack__col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.stack__col-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--muted);
  text-transform: none;
}

.stack__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stack__item {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: clamp(22px, 2.2vw, 30px);
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: var(--fg);
  cursor: pointer;
  outline: none;
  padding: 2px 0;
  transition: color 0.22s ease, opacity 0.22s ease, transform 0.22s ease;

  &.is-active {
    color: var(--accent);
    transform: translateX(4px);
  }

  &.is-dim {
    opacity: 0.35;
  }
}

.stack__name {
  display: inline-block;
  will-change: contents;
}
</style>
