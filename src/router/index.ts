import { createRouter, createWebHistory } from 'vue-router'
import HeroPage from '../pages/HeroPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import ServicesPage from '../pages/ServicesPage.vue'
import ProcessPage from '../pages/ProcessPage.vue'
import RatesPage from '../pages/RatesPage.vue'
import WorkPage from '../pages/WorkPage.vue'
import StackPage from '../pages/StackPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import Northwind from '../pages/work/Northwind.vue'
import Lumen from '../pages/work/Lumen.vue'
import Atelier from '../pages/work/Atelier.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HeroPage },
    { path: '/about', component: AboutPage },
    { path: '/services', component: ServicesPage },
    { path: '/process', component: ProcessPage },
    { path: '/rates', component: RatesPage },
    { path: '/work', component: WorkPage },
    { path: '/stack', component: StackPage },
    { path: '/contact', component: ContactPage },
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
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta?.title as string) || 'DENIS SOFONOV'
  document.title = title
})
