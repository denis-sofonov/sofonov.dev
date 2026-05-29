<script setup lang="ts">
withDefaults(defineProps<{
  items: string[]
  reverse?: boolean
  // Number of times the items array is repeated inside one track. Two tracks
  // are rendered side-by-side, so total marquee width is 2 × repeat × items.
  repeat?: number
}>(), { repeat: 4, reverse: false })
</script>

<template>
  <div class="marq" :class="{ 'is-reverse': reverse }" aria-hidden="true">
    <div class="marq__loop">
      <div v-for="g in 2" :key="g" class="marq__track">
        <template v-for="r in repeat" :key="`${g}-${r}`">
          <template v-for="(it, n) in items" :key="`${g}-${r}-${n}`">
            <span class="marq__item">{{ it }}</span>
            <span class="marq__sep" aria-hidden="true">•</span>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.marq {
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  /* Sits in a fixed band between the 56px page header and the section header
     beneath. NO parallax — the band must stay at the same viewport-y across
     every section, otherwise the rhythm breaks. */
  top: 60px;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 1;
}

.marq__loop {
  display: flex;
  width: max-content;
  animation: marq-flow 56s linear infinite;
}
.marq.is-reverse .marq__loop { animation-direction: reverse; }

/* Direction-aware: when the user scrolls UP, marquees flip — they "follow"
   the scroll gesture rather than dictate their own motion. The :root flag
   is set in App.vue from lenis.velocity sign with a small dead zone. */
:root[data-scroll-dir='up'] .marq__loop { animation-direction: reverse; }
:root[data-scroll-dir='up'] .marq.is-reverse .marq__loop { animation-direction: normal; }

.marq__track {
  display: flex;
  flex-shrink: 0;
  gap: 22px;
  padding-right: 22px;
  align-items: center;
}

.marq__item {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  letter-spacing: 0.06em;
  text-transform: lowercase;
}

.marq__sep {
  display: inline-block;
  color: var(--accent);
  opacity: 0.6;
  font-size: 6px;
}

@keyframes marq-flow {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marq__loop { animation: none; }
}
</style>
