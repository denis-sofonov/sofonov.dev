<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { animate as anime } from 'animejs'
import PageFrame from '../components/PageFrame.vue'
import { bookmarks } from '../data/bookmarks'

const { t } = useI18n()

const activeTag = ref<string | null>(null)

// All unique tags, sorted by frequency (most used first)
const tags = computed(() => {
  const counts = new Map<string, number>()
  bookmarks.forEach(b => b.tags.forEach(tg => counts.set(tg, (counts.get(tg) || 0) + 1)))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
})

const filtered = computed(() => {
  if (!activeTag.value) return bookmarks
  return bookmarks.filter(b => b.tags.includes(activeTag.value!))
})

function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag
}

onMounted(() => {
  nextTick(() => {
    anime('.bm__head > *', {
      opacity: [0, 1],
      duration: 400,
      delay: (_: unknown, i: number) => 100 + i * 80,
      ease: 'outQuad',
    })
    anime('.bm__chip', {
      opacity: [0, 1],
      duration: 360,
      delay: (_: unknown, i: number) => 240 + i * 25,
      ease: 'outQuad',
    })
    anime('.bm__item', {
      opacity: [0, 1],
      duration: 420,
      delay: (_: unknown, i: number) => 350 + i * 30,
      ease: 'outQuad',
    })
  })
})

// Re-fade items when filter changes
watch(activeTag, () => {
  nextTick(() => {
    anime('.bm__item', {
      opacity: [0, 1],
      duration: 340,
      delay: (_: unknown, i: number) => i * 20,
      ease: 'outQuad',
    })
  })
})
</script>

<template>
  <PageFrame num="09" :section="t('nav.bookmarks')">
    <div class="bm-page">
      <header class="bm__head">
        <h1 class="bm__title">{{ t('bookmarks.title') }}</h1>
        <p class="bm__sub">{{ t('bookmarks.subtitle') }}</p>
      </header>

      <nav class="bm__chips" aria-label="tag filter">
        <button
          class="bm__chip"
          :class="{ 'is-active': activeTag === null }"
          @click="activeTag = null"
        >
          {{ t('bookmarks.all') }}
          <span class="bm__chip-count">{{ bookmarks.length }}</span>
        </button>
        <button
          v-for="tag in tags"
          :key="tag"
          class="bm__chip"
          :class="{ 'is-active': activeTag === tag }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </nav>

      <ul v-if="filtered.length" class="bm__list">
        <li v-for="b in filtered" :key="b.url" class="bm__item">
          <a :href="b.url" target="_blank" rel="noopener noreferrer" class="bm__link">
            <div class="bm__row">
              <span class="bm__name">{{ b.title }}</span>
              <span class="bm__tags">
                <span v-for="tg in b.tags" :key="tg" class="bm__tag">{{ tg }}</span>
              </span>
            </div>
            <p class="bm__desc">{{ b.desc }}</p>
          </a>
        </li>
      </ul>
      <p v-else class="bm__empty">{{ t('bookmarks.empty') }}</p>
    </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.bm-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 40px 24px;
  max-width: 980px;
  width: 100%;
  margin: 0 auto;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 0; }

  @media (max-width: 768px) { padding: 24px 12px; gap: 22px; }
}

.bm__head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bm__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(36px, 4.2vw, 60px);
  letter-spacing: -0.025em;
  line-height: 0.95;
  color: var(--fg);
  font-weight: 500;
}

.bm__sub {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(14px, 1.1vw, 17px);
  line-height: 1.55;
  color: var(--muted);
  max-width: 58ch;
}

// Chips
.bm__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bm__chip {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--fg);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover {
    border-color: var(--fg);
  }

  &.is-active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
}

.bm__chip-count {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  .bm__chip.is-active & { color: rgba(255,255,255,0.8); }
}

// List
.bm__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.bm__item {
  border-top: 1px solid var(--border);

  &:last-child { border-bottom: 1px solid var(--border); }
}

.bm__link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 0;
  text-decoration: none;
  color: inherit;
  transition: padding-left 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    padding-left: 12px;

    .bm__name { color: var(--accent); }
  }
}

.bm__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.bm__name {
  font-family: var(--font-sans);
  font-size: clamp(17px, 1.5vw, 22px);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--fg);
  transition: color 0.22s ease;
}

.bm__tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}

.bm__tag {
  &::before { content: '#'; opacity: 0.55; }
}

.bm__desc {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(13px, 1vw, 15px);
  line-height: 1.55;
  color: var(--muted);
  max-width: 68ch;
}

.bm__empty {
  margin: 32px 0 0;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}
</style>
