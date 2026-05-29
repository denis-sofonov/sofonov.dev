<script setup lang="ts">
defineProps<{
  sigil: string
  title: string
}>()
</script>

<template>
  <header class="sec-head">
    <div class="sec-head__l">
      <span class="sec-head__sigil">{{ sigil }}</span>
      <span class="sec-head__sep" aria-hidden="true">/</span>
      <h2 class="sec-head__title">{{ title }}</h2>
    </div>
    <div class="sec-head__r">
      <slot name="meta" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
/*
  Chip-line section header: tiny, monospace, hairline-bottom. Sits in the
  band beneath the marquee (top of marquee = 60px, bottom ≈ 78px, so we
  start at 92px from section top — a 14px gap to the marquee).

  Total height ≈ 36-40px, leaving the section's content area maximised.
*/

.sec-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
  padding: 8px 0 12px;
  /* No margin-top — sections set padding-top to clear the marquee band
     (marquee runs at top: 60px). Keeps the rhythm identical across all six. */
  margin-top: 0;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: var(--fg);
  flex: 0 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 6px 0 10px; }
}

.sec-head__l {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  min-width: 0;
}

.sec-head__sigil {
  color: var(--accent);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 500;
  white-space: nowrap;
}

.sec-head__sep {
  color: var(--muted);
  opacity: 0.45;
  font-weight: 300;
}

.sec-head__title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--fg);
  text-transform: lowercase;
}

.sec-head__r {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/*
  Slot styling — sections drop spans with .sec-meta-k / .sec-meta-v inside
  <template #meta>. Using :deep so the rules pierce scoped boundaries.
*/
:deep(.sec-meta-k) {
  color: var(--muted);
  opacity: 0.55;
}
:deep(.sec-meta-v) {
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
:deep(.sec-meta-sep) {
  color: var(--muted);
  opacity: 0.35;
  margin: 0 4px;
}
</style>
