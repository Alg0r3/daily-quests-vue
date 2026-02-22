import { createRouter, createWebHistory } from 'vue-router';
import DevPlaygroundView from '@/modules/workout/presentation/views/DevPlaygroundView.vue';

const routes = [
  {
    path: '/dev/playground',
    name: 'playground',
    component: DevPlaygroundView,
    meta: { title: 'DevPlayground' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
