<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="fo-ticker">
    <div class="fo-ticker__track">
      <span>{{ t('forma.ticker') }}</span>
      <span>{{ t('forma.ticker') }}</span>
      <span>{{ t('forma.ticker') }}</span>
      <span>{{ t('forma.ticker') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-ticker {
  background: $fo-fg;
  color: $fo-bg;
  padding: 14px 0;
  overflow: hidden;
  border-top: 1px solid $fo-fg;
  border-bottom: 1px solid $fo-fg;
}

.fo-ticker__track {
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: foTickerScroll 35s linear infinite;

  span {
    @include fo-mono;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    padding-right: 32px;
    flex-shrink: 0;
  }
}

@keyframes foTickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
