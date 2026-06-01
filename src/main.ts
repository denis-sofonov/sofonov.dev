import { ViteSSG } from 'vite-ssg'
import i18n from './i18n'
import { routes, scrollBehavior } from './router'
import App from './App.vue'

// ViteSSG prerenders every route to static HTML at build time (great SEO +
// /resume served as a real file), then hydrates on the client.
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app }) => {
    app.use(i18n)
  },
)
