<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { photos } from './photos'

interface Scene { tag: string; title: string; desc: string }

gsap.registerPlugin(ScrollTrigger)

const { t, tm } = useI18n()
const root = ref<HTMLElement | null>(null)
const activeScene = ref(0)
const tweens: gsap.core.Tween[] = []

const sceneImages = [photos.story1, photos.story2, photos.story3, photos.story4]

onMounted(async () => {
  await nextTick()
  if (!root.value) return

  // Reveal section head
  const head = root.value.querySelector('.fo-story__eyebrow')
  if (head) {
    tweens.push(
      gsap.fromTo(head,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: root.value, start: 'top 85%', toggleActions: 'play none none none' },
        },
      ),
    )
  }

  // Each scene activates corresponding image
  const scenes = root.value.querySelectorAll('.fo-story__scene')
  scenes.forEach((scene, i) => {
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => { activeScene.value = i },
      onEnterBack: () => { activeScene.value = i },
    })
  })
})

onUnmounted(() => {
  tweens.forEach((t) => t.kill())
  if (root.value) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger && root.value!.contains(st.trigger as Node)) st.kill()
    })
  }
})
</script>

<template>
  <section ref="root" id="story" class="fo-story">
    <div class="fo-story__eyebrow">{{ t('forma.story.eyebrow') }}</div>

    <div class="fo-story__layout">
      <div class="fo-story__sticky">
        <div class="fo-story__visuals">
          <div
            v-for="(_, i) in sceneImages"
            :key="i"
            class="fo-story__visual"
            :class="{ 'fo-story__visual--active': activeScene === i }"
            :style="{ backgroundImage: `url(${sceneImages[i]})` }"
          ></div>
        </div>
      </div>

      <div class="fo-story__scenes">
        <div
          v-for="(scene, i) in (tm('forma.story.scenes') as Scene[])"
          :key="i"
          class="fo-story__scene"
          :class="{ 'fo-story__scene--active': activeScene === i }"
        >
          <span class="fo-story__scene-tag">{{ scene.tag }}</span>
          <h3 class="fo-story__scene-title">{{ scene.title }}</h3>
          <p class="fo-story__scene-desc">{{ scene.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './_shared.scss' as *;

.fo-story {
  padding: 160px 40px 200px;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 900px) { padding: 100px 24px; }
}

.fo-story__eyebrow {
  @include fo-mono;
  font-size: 11px;
  color: $fo-fg-muted;
  margin-bottom: 80px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fo-story__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

// LEFT — sticky product image
.fo-story__sticky {
  position: sticky;
  top: 120px;
  align-self: start;
  height: 70vh;
  max-height: 600px;
  display: flex;
  align-items: center;

  @media (max-width: 900px) { display: none; }
}

.fo-story__visuals {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: $fo-bg-elevated;
}

.fo-story__visual {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 0.8s ease, transform 1.2s ease;
  filter: contrast(1.05);
}

.fo-story__visual--active {
  opacity: 1;
  transform: scale(1);
}

// RIGHT — scrolling text scenes
.fo-story__scenes {
  display: flex;
  flex-direction: column;
}

.fo-story__scene {
  min-height: 80vh;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  opacity: 0.4;
  transition: opacity 0.5s ease;

  &--active { opacity: 1; }

  @media (max-width: 900px) {
    min-height: auto;
    padding: 32px 0;
    opacity: 1;
  }
}

.fo-story__scene-tag {
  display: inline-block;
  @include fo-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: $fo-accent;
  margin-bottom: 24px;
  width: fit-content;
}

.fo-story__scene-title {
  @include fo-display;
  font-size: clamp(28px, 4vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: $fo-fg;
  margin-bottom: 24px;
  text-wrap: balance;
}

.fo-story__scene-desc {
  @include fo-sans;
  font-size: 16px;
  line-height: 1.7;
  color: $fo-fg-muted;
  max-width: 480px;
}
</style>
