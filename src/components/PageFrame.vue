<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  num: string
  section: string
  subtitle?: string
  sheet?: string
  rev?: string
}

defineProps<Props>()

const time = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
})
function updateTime() {
  time.value = timeFormatter.format(new Date())
}

onMounted(() => {
  updateTime()
  const msToNextMinute = 60000 - (Date.now() % 60000)
  setTimeout(() => {
    updateTime()
    timer = setInterval(updateTime, 60000)
  }, msToNextMinute)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="pf">
    <div class="pf__inner">
      <span class="pf__mark pf__mark--tl"></span>
      <span class="pf__mark pf__mark--tr"></span>
      <span class="pf__mark pf__mark--bl"></span>
      <span class="pf__mark pf__mark--br"></span>

      <header class="pf__top">
        <span class="pf__label">
          [ {{ num }} · {{ section }}<template v-if="subtitle"> — {{ subtitle }}</template> ]
        </span>
        <div class="pf__meta">
          <span>{{ sheet || `SHEET ${num}` }}</span>
          <span class="pf__meta-sep">·</span>
          <span>{{ rev || 'REV A · 2026' }}</span>
          <span class="pf__meta-sep">·</span>
          <span class="pf__time">{{ time }}</span>
        </div>
      </header>

      <div class="pf__body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.pf {
  min-height: 100vh;
  min-height: 100svh;
  padding: 56px 20px 20px;
  display: flex;

  @media (max-width: 768px) {
    padding: 52px 10px 10px;
  }
}

.pf__inner {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid var(--border);
  padding: 16px 28px 20px;
  min-height: 0;

  @media (max-width: 768px) { padding: 14px 14px 16px; }
}

// Registration marks
.pf__mark {
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
  z-index: 3;

  &::before, &::after {
    content: '';
    position: absolute;
    background: var(--fg);
  }

  &--tl { top: -1px; left: -1px;
    &::before { top: 0; left: 0; width: 1px; height: 100%; }
    &::after  { top: 0; left: 0; width: 100%; height: 1px; }
  }
  &--tr { top: -1px; right: -1px;
    &::before { top: 0; right: 0; width: 1px; height: 100%; }
    &::after  { top: 0; right: 0; width: 100%; height: 1px; }
  }
  &--bl { bottom: -1px; left: -1px;
    &::before { bottom: 0; left: 0; width: 1px; height: 100%; }
    &::after  { bottom: 0; left: 0; width: 100%; height: 1px; }
  }
  &--br { bottom: -1px; right: -1px;
    &::before { bottom: 0; right: 0; width: 1px; height: 100%; }
    &::after  { bottom: 0; right: 0; width: 100%; height: 1px; }
  }
}

.pf__top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--ls-chrome);
  text-transform: uppercase;
  color: var(--muted);
  flex-shrink: 0;
  z-index: 2;
}

.pf__label {
  color: var(--fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pf__meta {
  display: flex;
  gap: 10px;
  align-items: baseline;
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.pf__meta-sep { opacity: 0.4; }

.pf__time {
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}

.pf__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
