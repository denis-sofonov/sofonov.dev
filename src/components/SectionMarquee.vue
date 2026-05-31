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
  /* Ambient texture, not a competing headline — sits back so the section
     title owns the band. */
  opacity: 0.5;
}

/* One shared offset (--marq-x, 0..50, set each frame in App.vue) drives every
   marquee. translateX runs 0 → -50%; the track is duplicated so the wrap is
   seamless. Reverse marquees ride the same value from the opposite end, so both
   directions reverse smoothly together when the scroll direction flips. */
.marq__loop {
  display: flex;
  width: max-content;
  transform: translate3d(calc(var(--marq-x, 0) * -1%), 0, 0);
  will-change: transform;
}
.marq.is-reverse .marq__loop {
  transform: translate3d(calc(var(--marq-x, 0) * 1% - 50%), 0, 0);
}

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

@media (prefers-reduced-motion: reduce) {
  .marq__loop { transform: none; }
}
</style>
