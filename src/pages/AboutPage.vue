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
  gsap.from('.about__statement', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
  gsap.from('.about__pitch', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.5 })
  gsap.from('.meta__item', { y: 10, opacity: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out', delay: 0.7 })

  // Activity cells — wave animation from top-left to bottom-right
  document.querySelectorAll('.activity__cell').forEach((cell, i) => {
    const el = cell as HTMLElement
    const col = Math.floor(i / DAYS_PER_WEEK)
    const row = i % DAYS_PER_WEEK
    const delay = (col * 0.03 + row * 0.04) + 0.8
    gsap.fromTo(el,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', delay }
    )
  })
})
</script>

<template>
  <PageFrame num="02" :section="t('nav.about')" :subtitle="t('sections.about')" sheet="SHEET 02/08">
  <div class="about-page">
    <!-- Big statement — centerpiece -->
    <h1 class="about__statement">{{ t('statement') }}</h1>

    <!-- Pitch — smaller serif -->
    <p class="about__pitch">{{ t('heroPitch') }}</p>

    <!-- Meta line -->
    <div class="meta">
      <span class="meta__item meta__item--accent">{{ t('heroLabels.availableForHire') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">{{ t('location') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">{{ t('experience') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">40+ {{ t('heroStats.projects') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">{{ t('heroLabels.focusVal') }}</span>
      <span class="meta__sep">·</span>
      <span class="meta__item">{{ t('heroLabels.langVal') }}</span>
    </div>

    <!-- GitHub activity — always rendered, data fills in -->
    <div class="activity" :class="{ 'activity--loaded': activityLoaded }">
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
        <span>{{ t('activity.label') }}</span>
        <span>{{ activityLoaded ? `${activityTotal} ${t('activity.commits')} · ${t('activity.period')}` : '...' }}</span>
      </div>
    </div>
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

  @media (max-width: 768px) { padding: 20px 8px; }
}

.about__statement {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--fs-h3);
  letter-spacing: var(--ls-display);
  text-transform: uppercase;
  line-height: 1.15;
  margin-bottom: 20px;
}

.about__pitch {
  font-family: var(--font-serif);
  font-size: clamp(15px, 1.4vw, 19px);
  font-style: italic;
  line-height: 1.5;
  color: var(--muted);
  max-width: 55ch;
  margin-bottom: 32px;
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
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.meta__item--accent {
  color: var(--fg);
}

.meta__sep {
  margin: 0 12px;
  color: var(--muted);
  font-size: 14px;
}

// Activity — thin strip at bottom
.activity {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 460px;
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
  font-size: 9px;
  font-weight: 700;
  letter-spacing: var(--ls-wide);
  color: var(--muted);
  text-transform: uppercase;
}
</style>
