<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import PageFrame from '../components/PageFrame.vue'

const { t, tm } = useI18n()

interface Project {
  name: string
  desc: string
  stack: string
  href?: string
  tag?: string
}

const allProjects = ref<Project[]>([])
const activeIndex = ref(0)
const iframeSrc = ref('')

onMounted(() => {
  const demos = (tm('demos.items') as any[]).map(d => ({
    name: d.name,
    desc: d.desc,
    stack: d.stack,
    href: d.href,
    tag: d.niche,
  }))
  allProjects.value = demos

  // Set first project
  if (allProjects.value[0]?.href) {
    iframeSrc.value = allProjects.value[0].href
  }

  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

function selectProject(index: number) {
  activeIndex.value = index
  const project = allProjects.value[index]
  if (project.href) {
    iframeSrc.value = project.href
  }
}

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  const len = allProjects.value.length
  if (!len) return
  e.preventDefault()
  const step = e.key === 'ArrowDown' ? 1 : -1
  selectProject((activeIndex.value + step + len) % len)
}
</script>

<template>
  <PageFrame num="03" :section="t('nav.work')">
  <div class="work-page">
    <!-- LEFT: iframe preview -->
    <div class="work__preview">
      <div class="frame">
        <iframe
          v-if="iframeSrc"
          :src="iframeSrc"
          class="frame__iframe"
          frameborder="0"
          loading="lazy"
        ></iframe>
        <div v-else class="frame__empty">
          <span>{{ t('heroLabels.availableForHire') }}</span>
        </div>
      </div>
    </div>

    <!-- RIGHT: Project list -->
    <div class="work__list">
      <p class="work__note">{{ t('demos.note') }}</p>
      <div class="work__items">
        <button
          v-for="(project, i) in allProjects"
          :key="i"
          class="work__item"
          :class="{ 'work__item--active': activeIndex === i }"
          @click="selectProject(i)"
        >
          <div class="work__item-head">
            <span class="work__item-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="work__item-tag">{{ project.tag }}</span>
          </div>
          <h3 class="work__item-name">{{ project.name }}</h3>
          <p class="work__item-desc">{{ project.desc }}</p>
          <span class="work__item-stack">{{ project.stack }}</span>
          <router-link
            v-if="project.href"
            :to="project.href"
            class="work__item-link"
            @click.stop
          >
            {{ t('viewLive') }} →
          </router-link>
        </button>
      </div>
    </div>
  </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.work-page {
  flex: 1;
  display: flex;
  padding: 16px 0 0;
  gap: 24px;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 12px 0 0;
    gap: 14px;
    overflow-y: auto;
  }
}

// LEFT — iframe preview
.work__preview {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}

.frame {
  width: 100%;
  height: 100%;
  max-height: 82vh;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background: #0a0a0a;
}

.frame__iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #0a0a0a;
  display: block;
}

.frame__empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: var(--ls-wide);
  text-transform: none;
}

// RIGHT — project list
.work__list {
  width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 16px;

  // Hide scrollbar
  &::-webkit-scrollbar { width: 0; }

  @media (max-width: 1024px) {
    width: 100%;
  }
}

.work__label {
  font-size: 11px;
  letter-spacing: var(--ls-wide);
  text-transform: none;
  color: var(--muted);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.work__note {
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
  letter-spacing: var(--ls-display);
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px dashed var(--border);
}

.work__items {
  display: flex;
  flex-direction: column;
}

.work__item {
  text-align: left;
  background: none;
  border: none;
  color: var(--fg);
  font-family: var(--font-sans);
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: padding-left 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s;
  opacity: 0.55;

  &:first-child { border-top: 1px solid var(--border); }

  &--active {
    opacity: 1;
    padding-left: 12px;
  }

  &:hover {
    opacity: 0.8;
  }
}

.work__item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work__item-num {
  font-size: 10px;
  color: var(--muted);
}

.work__item-tag {
  font-size: 9px;
  letter-spacing: var(--ls-wide);
  text-transform: none;
  color: var(--muted);
}

.work__item-name {
  font-family: var(--font-sans);
  font-size: clamp(15px, 1.5vw, 20px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.work__item-desc {
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 40ch;
}

.work__item-stack {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.work__item-link {
  font-size: 11px;
  color: var(--fg);
  text-decoration: none;
  letter-spacing: var(--ls-label);
  margin-top: 4px;
  transition: opacity 0.2s;

  &:hover { opacity: 0.5; }
}
</style>
