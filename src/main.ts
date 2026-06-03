import { ViteSSG } from 'vite-ssg'
import { createAppI18n } from './i18n'
import { routes, scrollBehavior } from './router'
import App from './App.vue'

// ViteSSG prerenders every route to static HTML at build time (great SEO +
// /resume served as a real file), then hydrates on the client.
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app, router }) => {
    // Per-app i18n so each prerendered route owns its locale (no cross-page leak).
    const i18n = createAppI18n()
    app.use(i18n)
    // URL is the source of truth for language — set the locale from route.meta
    // before each render so the prerendered HTML (and client hydration) match.
    router.beforeEach((to) => {
      const loc = (to.meta.locale as 'en' | 'ru' | undefined) ?? 'en'
      if (i18n.global.locale.value !== loc) i18n.global.locale.value = loc
    })
  },
)
