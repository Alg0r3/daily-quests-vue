import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'

/** @typedef {{ title?: string }} RouteMeta */

const routes = [
  {
    path: '/',
    name: 'home',
    component: { name: 'empty', render: () => h('div') },
    /** @type RouteMeta */
    meta: { title: 'Home - WorkoutLogger' },
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
