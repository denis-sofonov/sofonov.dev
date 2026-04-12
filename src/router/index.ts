import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import Northwind from '../pages/work/Northwind.vue'
import Lumen from '../pages/work/Lumen.vue'
import Atelier from '../pages/work/Atelier.vue'
import Forma from '../pages/work/Forma.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    {
      path: '/work/northwind',
      component: Northwind,
      meta: { standalone: true, title: 'Northwind — Real-time analytics for product teams' },
    },
    {
      path: '/work/lumen',
      component: Lumen,
      meta: { standalone: true, title: 'Lumen — Natural wine bar' },
    },
    {
      path: '/work/atelier',
      component: Atelier,
      meta: { standalone: true, title: 'Atelier — Independent design studio' },
    },
    {
      path: '/work/forma',
      component: Forma,
      meta: { standalone: true, title: 'Forma One — Premium wireless headphones' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta?.title as string) || 'Denis Sofonov — Fullstack Engineer'
  document.title = title
})
