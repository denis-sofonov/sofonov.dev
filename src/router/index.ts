import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'

// ViteSSG creates the router itself (per-route prerender), so we export the
// route table + scroll behaviour rather than a constructed router instance.
// Locale lives in the URL so each language is its own crawlable, prerendered
// page: '/' + '/resume' are English, '/ru' + '/ru/resume' Russian. route.meta
// .locale drives vue-i18n (main.ts guard) and the per-page head (App.vue).
export const routes: RouteRecordRaw[] = [
  { path: '/', component: LandingPage, meta: { locale: 'en' } },
  { path: '/ru', component: LandingPage, meta: { locale: 'ru' } },
  { path: '/resume', component: () => import('../pages/ResumePage.vue'), meta: { locale: 'en' } },
  { path: '/ru/resume', component: () => import('../pages/ResumePage.vue'), meta: { locale: 'ru' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' }
  }
  return { top: 0 }
}
