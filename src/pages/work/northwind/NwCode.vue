<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, nextTick } from 'vue'
import { useReveal } from './useReveal'

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const { reveal } = useReveal(root)

const codeTabIndex = ref(0)
const codeSamples = [
  `import { Northwind } from '@northwind/sdk'

const nw = new Northwind('pk_live_a1b2c3d4')

nw.track('signup_completed', {
  plan: 'pro',
  source: 'landing_page',
  experiment: 'hero_v2',
})`,
  `from northwind import Client

nw = Client(api_key='pk_live_a1b2c3d4')

nw.track('signup_completed', properties={
  'plan': 'pro',
  'source': 'landing_page',
  'experiment': 'hero_v2',
})`,
  `import NorthwindSDK

let nw = Northwind(apiKey: "pk_live_a1b2c3d4")

nw.track("signup_completed", properties: [
  "plan": "pro",
  "source": "landing_page",
  "experiment": "hero_v2",
])`,
  `import "github.com/northwind/sdk-go"

nw := northwind.New("pk_live_a1b2c3d4")

nw.Track("signup_completed", map[string]any{
  "plan":       "pro",
  "source":     "landing_page",
  "experiment": "hero_v2",
})`,
]

function highlightCode(code: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let html = escape(code)
  html = html.replace(/(["'`])((?:(?!\1).)*)\1/g, '<span class="tk-str">$1$2$1</span>')
  html = html.replace(/(\/\/[^\n]*)/g, '<span class="tk-com">$1</span>')
  const keywords = ['import', 'from', 'const', 'let', 'var', 'function', 'return', 'new', 'class', 'def', 'self', 'true', 'false', 'null', 'None', 'True', 'False', 'package', 'func']
  keywords.forEach((kw) => {
    html = html.replace(new RegExp(`\\b${kw}\\b(?![^<]*<\\/span>)`, 'g'), `<span class="tk-kw">${kw}</span>`)
  })
  html = html.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g, '<span class="tk-fn">$1</span>')
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="tk-num">$1</span>')
  return html
}

const currentCode = computed(() => highlightCode(codeSamples[codeTabIndex.value]))

onMounted(async () => {
  await nextTick()
  reveal('.nw-section__head > *', { y: 30, stagger: 0.1, duration: 0.8 })
  reveal('.nw-code__editor', { y: 60, duration: 1.2, start: 'top 80%' })
})
</script>

<template>
  <section ref="root" id="code" class="nw-code">
    <div class="nw-section__head">
      <div class="nw-eyebrow">{{ t('northwind.code.eyebrow') }}</div>
      <h2 class="nw-section__title">{{ t('northwind.code.title') }}</h2>
      <p class="nw-section__sub">{{ t('northwind.code.subtitle') }}</p>
    </div>

    <div class="nw-code__editor">
      <div class="nw-code__tabs">
        <button
          v-for="(tab, i) in (tm('northwind.code.tabs') as string[])"
          :key="i"
          class="nw-code__tab"
          :class="{ 'nw-code__tab--active': codeTabIndex === i }"
          @click="codeTabIndex = i"
        >{{ tab }}</button>
        <div class="nw-code__filename">main.{{ ['js','py','swift','go'][codeTabIndex] }}</div>
      </div>
      <pre class="nw-code__pre"><code v-html="currentCode"></code></pre>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.nw-code {
  padding: 80px 24px 160px;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) { padding: 60px 16px 100px; }
}

.nw-section__head { @include nw-section-head; }
.nw-eyebrow { @include nw-eyebrow; }
.nw-section__title { @include nw-section-title; }
.nw-section__sub { @include nw-section-sub; }

.nw-code__editor {
  background: linear-gradient(180deg, $nw-bg-elevated 0%, $nw-bg-card 100%);
  border: 1px solid $nw-border-bright;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.05),
    0 40px 80px -20px rgba(0,0,0,0.6),
    0 0 60px rgba(0,212,255,0.1);
}

.nw-code__tabs {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid $nw-border;
  padding: 0 8px;
}

.nw-code__tab {
  padding: 14px 18px;
  font-size: 13px;
  font-weight: 500;
  color: $nw-fg-muted;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  transition: all 0.15s ease;
  cursor: pointer;
  @include nw-mono;

  &:hover { color: $nw-fg; }
}

.nw-code__tab--active {
  color: $nw-fg;
  border-bottom-color: $nw-accent;
}

.nw-code__filename {
  margin-left: auto;
  padding-right: 16px;
  font-size: 11px;
  color: $nw-fg-subtle;
  @include nw-mono;
}

.nw-code__pre {
  margin: 0;
  padding: 28px 32px;
  @include nw-mono;
  font-size: 14px;
  line-height: 1.7;
  color: $nw-fg;
  overflow-x: auto;
  text-align: left;

  :deep(.tk-kw) { color: #c4b5fd; }
  :deep(.tk-str) { color: $nw-green; }
  :deep(.tk-fn) { color: $nw-accent-bright; }
  :deep(.tk-num) { color: $nw-pink; }
  :deep(.tk-com) { color: $nw-fg-subtle; font-style: italic; }
}
</style>
