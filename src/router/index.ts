import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'

// ViteSSG creates the router itself (per-route prerender), so we export the
// route table + scroll behaviour rather than a constructed router instance.
export const routes: RouteRecordRaw[] = [
  { path: '/', component: LandingPage },
  { path: '/resume', component: () => import('../pages/ResumePage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' }
  }
  return { top: 0 }
}
