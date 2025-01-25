import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home - Chako'
      }
    }
  ]
})

// Update document title for accessibility
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'Chako'
  next()
})

export default router
