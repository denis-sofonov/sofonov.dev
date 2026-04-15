<script setup lang="ts">
interface Props {
  num?: string
  section: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <section class="pf">
    <div class="pf__inner">
      <div class="pf__corner pf__corner--tl">
        <span class="pf__section">{{ section.toLowerCase() }}<template v-if="subtitle"> <em>— {{ subtitle }}</em></template></span>
      </div>

      <div class="pf__body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.pf {
  height: 100vh;
  height: 100svh;
  padding: 56px 20px 20px;
  display: flex;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100svh;
    overflow: visible;
    padding: 52px 10px 10px;
  }
}

.pf__inner {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 34px 32px 34px;
  overflow: hidden;

  @media (max-width: 768px) {
    overflow: visible;
    padding: 30px 14px 30px;
  }
}

// Corner meta — minimal chrome, no border, no registration marks
.pf__corner {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--muted);
  white-space: nowrap;
  pointer-events: none;
}

.pf__corner > * { pointer-events: auto; }

.pf__corner--tl { top: 14px; left: 26px; }

@media (max-width: 768px) {
  .pf__corner--tl { left: 14px; top: 10px; }
}

.pf__section {
  color: var(--fg);
  em { font-style: normal; color: var(--muted); font-weight: 400; }
}

.pf__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
