import WorkoutPage from '@/pages/WorkoutPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

/** @typedef {{ title?: string }} RouteMeta */

const routes = [
  {
    path: '/',
    name: 'home',
    component: WorkoutPage,
    /** @type RouteMeta */
    meta: { title: 'Workout' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
