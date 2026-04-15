<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import PageFrame from '../components/PageFrame.vue'

const { tm, t } = useI18n()
interface StackGroup { label: string; items: string[] }

const lines = ref<{ text: string; cls?: string }[]>([])
const showCursor = ref(true)
const typingDone = ref(false)

onMounted(() => {
  const groups = tm('stack.groups') as StackGroup[]

  // Build terminal output lines
  const output: { text: string; cls?: string }[] = []
  const totalTools = groups.reduce((s, g) => s + g.items.length, 0)

  // ASCII art header
  const ascii = [
    '  ███████╗████████╗ █████╗  ██████╗██╗  ██╗',
    '  ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝',
    '  ███████╗   ██║   ███████║██║     █████╔╝ ',
    '  ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ',
    '  ███████║   ██║   ██║  ██║╚██████╗██║  ██╗',
    '  ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝',
  ]
  ascii.forEach(line => output.push({ text: line, cls: 'ascii' }))

  output.push({ text: '' })
  output.push({ text: '  $ cat stack.json', cls: 'cmd' })
  output.push({ text: '' })

  // Find max items
  const col = 22
  const maxItems = Math.max(...groups.map(g => g.items.length))

  // Header
  output.push({ text: '  ' + groups.map(g => g.label.padEnd(col)).join(''), cls: 'header' })
  output.push({ text: '  ' + groups.map(() => '─'.repeat(col - 2) + '  ').join(''), cls: 'sep' })

  // Items
  for (let i = 0; i < maxItems; i++) {
    output.push({ text: '  ' + groups.map(g => (g.items[i] || '').padEnd(col)).join('') })
  }

  output.push({ text: '' })
  output.push({ text: `  ${totalTools} packages installed. uptime: 4y 2m.`, cls: 'footer' })
  output.push({ text: '' })

  // Typing animation — reveal lines one by one
  let lineIndex = 0

  function addLine() {
    if (lineIndex < output.length) {
      lines.value.push(output[lineIndex])
      lineIndex++
      // ASCII art fast, command slow, rest medium
      const isAscii = output[lineIndex - 1]?.cls === 'ascii'
      const isCmd = output[lineIndex - 1]?.cls === 'cmd'
      const delay = isAscii ? 35 : isCmd ? 400 : 55
      setTimeout(addLine, delay)
    } else {
      typingDone.value = true
    }
  }

  setTimeout(addLine, 400)

  // Blink cursor
  setInterval(() => { showCursor.value = !showCursor.value }, 530)
})
</script>

<template>
  <PageFrame num="07" :section="t('nav.stack')" :subtitle="t('sections.stack')" sheet="SHEET 07/08">
    <div class="stack-page">
      <header class="stack__head">
        <h1 class="stack__title">{{ t('stack.title') }}</h1>
        <p class="stack__sub">{{ t('stack.subtitle') }}</p>
      </header>

      <div class="stack__panel">
        <div class="terminal">
          <div class="terminal__bar">
            <span class="terminal__path">~/denis-sofonov</span>
            <span class="terminal__tab">stack</span>
          </div>
          <div class="terminal__body" ref="termBody">
            <div v-for="(line, i) in lines" :key="i" class="terminal__line" :class="line.cls ? `terminal__line--${line.cls}` : ''">{{ line.text }}</div>
            <span class="terminal__cursor" :class="{ 'terminal__cursor--hidden': !showCursor }">█</span>
          </div>
        </div>
      </div>
    </div>
  </PageFrame>
</template>

<style lang="scss" scoped>
.stack-page {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: 40px;
  align-items: center;
  padding: 24px 20px;
  overflow: hidden;
  min-height: 0;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 20px;
    overflow-y: auto;
    padding: 20px 8px;
  }
}

.stack__head {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stack__title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  line-height: 0.9;
  letter-spacing: var(--ls-display);
  color: var(--fg);
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
}

.stack__sub {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(14px, 1.1vw, 17px);
  line-height: 1.5;
  color: var(--muted);
  max-width: 36ch;
  margin: 0;
}

.stack__panel {
  min-width: 0;
  display: flex;
  justify-content: flex-start;
}

.terminal {
  width: 100%;
  max-width: 720px;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  background: color-mix(in srgb, var(--fg) 6%, var(--bg));
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}

.terminal__bar {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid var(--border);
}

.terminal__path {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: var(--muted);
  padding: 10px 16px;
  opacity: 0.6;
}

.terminal__tab {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: var(--fg);
  padding: 10px 20px;
  background: color-mix(in srgb, var(--fg) 5%, transparent);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

.terminal__body {
  padding: 20px 24px 24px;
  min-height: 340px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: var(--fg);
  white-space: pre;
  overflow-x: auto;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 16px;
  }
}

.terminal__line {
  opacity: 0.92;

  &--ascii {
    color: #5f87af;
    opacity: 0.7;
  }

  &--cmd {
    color: #87d787;
    opacity: 1;
    font-weight: 700;
  }

  &--header {
    color: var(--fg);
    opacity: 1;
    font-weight: 700;
  }

  &--sep {
    color: var(--muted);
    opacity: 0.3;
  }

  &--footer {
    color: var(--muted);
    opacity: 0.5;
  }
}

.terminal__cursor {
  color: var(--fg);
  font-size: 13px;
  animation: none;

  &--hidden { opacity: 0; }
}
</style>
