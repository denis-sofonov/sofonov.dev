<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import PageFrame from '../components/PageFrame.vue'

const { t } = useI18n()

interface ActivityDay { date: string; count: number; level: 0|1|2|3|4 }

const WEEKS_COUNT = 20
const DAYS_PER_WEEK = 7

// Init empty grid immediately — no layout shift
const activityWeeks = ref<ActivityDay[][]>(
  Array.from({ length: WEEKS_COUNT }, () =>
    Array.from({ length: DAYS_PER_WEEK }, () => ({ date: '', count: 0, level: 0 as 0 }))
  )
)
const activityLoaded = ref(false)
const activityTotal = ref(0)

function toLevel(c: number): 0|1|2|3|4 { return c===0?0:c<=2?1:c<=5?2:c<=10?3:4 }

async function loadActivity() {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/denis-sofonov?y=last', { signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data.contributions) {
      const days = data.contributions.map((d:any)=>({date:d.date,count:d.count??0,level:toLevel(d.count??0)}))
      const last = days.slice(-53*7)
      const first = new Date(last[0].date)
      const padded: any[] = [...Array(first.getDay()).fill(null), ...last]
      const weeks: ActivityDay[][] = []
      for (let i=0;i<padded.length;i+=7) weeks.push(padded.slice(i,i+7).filter(Boolean))
      const recent = weeks.slice(-WEEKS_COUNT)

      // Animate in — set data then trigger CSS transition
      activityWeeks.value = recent
      activityTotal.value = recent.flat().reduce((s,d)=>s+d.count,0)
      await nextTick()
      activityLoaded.value = true
    }
  } catch {
    activityLoaded.value = true
  }
}

onMounted(() => {
  loadActivity()
  gsap.from('.about__statement', { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 })
  gsap.from('.about__signoff', { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.25 })
  gsap.from('.about__pitch', { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.35 })
  gsap.from('.meta__item', { opacity: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out', delay: 0.45 })

  // Activity cells — soft opacity stagger, no scale pop
  document.querySelectorAll('.activity__cell').forEach((cell, i) => {
    const el = cell as HTMLElement
    const col = Math.floor(i / DAYS_PER_WEEK)
    const row = i % DAYS_PER_WEEK
    const delay = (col * 0.02 + row * 0.025) + 0.55
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out', delay }
    )
  })
})
</script>

<template>
  <PageFrame num="02" :section="t('nav.about')">
  <div class="about-page">
    <!-- Big statement — centerpiece -->
    <h1 class="about__statement">{{ t('statement') }}</h1>

    <!-- Sign-off — breaking asymmetric element -->
    <p class="about__signoff">{{ t('aboutSignoff') }}</p>

    <!-- Secondary — personal angle, different message -->
    <p class="about__pitch">{{ t('aboutSecondary') }}</p>

    <!-- Meta line — 3 facts only -->
    <div class="meta">
      <span class="meta__item">{{ t('location') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">{{ t('experience') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">40+ {{ t('heroStats.projects') }}</span>
    </div>

    <!-- GitHub activity — linked, human caption -->
    <a
      href="https://github.com/denis-sofonov"
      target="_blank"
      rel="noopener noreferrer"
      class="activity"
      :class="{ 'activity--loaded': activityLoaded }"
    >
      <div class="activity__grid">
        <div v-for="(week, wi) in activityWeeks" :key="wi" class="activity__col">
          <div
            v-for="(day, di) in week"
            :key="di"
            class="activity__cell"
            :class="`activity__cell--${day.level}`"
          />
        </div>
      </div>
      <div class="activity__info">
        <span>{{ t('activity.prefix') }}</span>
        <span class="activity__link">{{ t('activity.link') }}</span>
      </div>
    </a>
  </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.about-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px 20px;
  overflow: hidden;
  gap: 0;
  position: relative;

  @media (max-width: 768px) { padding: 20px 8px; }
}


.about__statement {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: clamp(22px, 2.6vw, 36px);
  letter-spacing: -0.015em;
  line-height: 1.25;
  margin-bottom: 8px;
  max-width: 46ch;
}

.about__signoff {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 28px;
  align-self: flex-end;
  margin-right: max(8vw, 60px);

  @media (max-width: 768px) {
    align-self: center;
    margin-right: 0;
  }
}

.about__pitch {
  font-family: var(--font-sans);
  font-size: clamp(14px, 1.2vw, 17px);
  line-height: 1.55;
  color: var(--muted);
  max-width: 56ch;
  margin-bottom: 24px;
}

// Meta line
.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  margin-bottom: 32px;
}

.meta__item {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--fg);
}

.meta__sep {
  margin: 0 12px;
  color: var(--muted);
  font-size: 14px;
}

// Activity — thin strip at bottom, clickable link to github
.activity {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 460px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-2px);

    .activity__link { color: var(--accent); }
  }
}

.activity__grid {
  display: flex;
  gap: 3px;
}

.activity__col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.activity__cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 2px;
  background: color-mix(in srgb, var(--fg) 5%, transparent);
  transition: background 0.8s ease;
}

.activity--loaded .activity__cell {
  &--0 { background: color-mix(in srgb, var(--fg) 5%, transparent); }
  &--1 { background: color-mix(in srgb, var(--fg) 12%, transparent); }
  &--2 { background: color-mix(in srgb, var(--fg) 25%, transparent); }
  &--3 { background: color-mix(in srgb, var(--fg) 45%, transparent); }
  &--4 { background: var(--fg); }
}

.activity__info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--muted);
}

.activity__link {
  color: var(--fg);
  transition: color 0.2s;
}
</style>
