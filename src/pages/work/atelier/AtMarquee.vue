<script setup lang="ts">
defineProps<{
  text: string
  variant?: 'default' | 'accent' | 'invert'
}>()
</script>

<template>
  <div class="at-marquee" :class="variant && `at-marquee--${variant}`">
    <div class="at-marquee__track">
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.at-marquee {
  overflow: hidden;
  border-top: 1px solid $at-fg;
  border-bottom: 1px solid $at-fg;
  padding: 24px 0;

  @media (max-width: 768px) { padding: 16px 0; }
}

.at-marquee__track {
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: atMarqueeScroll 30s linear infinite;

  span {
    @include at-display;
    font-size: clamp(48px, 7vw, 120px);
    line-height: 1;
    font-weight: 500;
    color: $at-fg;
    padding-right: 64px;
    flex-shrink: 0;
  }
}

.at-marquee--accent {
  background: $at-accent;
  border-color: $at-fg;

  .at-marquee__track {
    animation-direction: reverse;
    animation-duration: 25s;
  }
}

.at-marquee--invert {
  background: $at-fg;
  border-color: $at-fg;

  .at-marquee__track span {
    color: $at-bg;
  }
}

@keyframes atMarqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
