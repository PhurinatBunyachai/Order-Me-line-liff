import { createWebHistory, createRouter } from 'vue-router'
import { useLiff } from '@/composables/useLiff'

const isProd = import.meta.env.PROD
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/ProfilePage.vue')
  },
  {
    path: '/order-history',
    name: 'order-history',
    component: () => import('@/pages/OrderHistoryPage.vue')
  },
  {
    path: '/line-only',
    name: 'line-only',
    component: () => import('@/pages/LineOnlyPage.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

const { isInClient, initialize } = useLiff()

router.beforeEach(async (to, _, next) => {
  await initialize()
  console.log(isInClient.value)
  if (to.path === '/line-only') {
    return next()
  }
  if (isProd && !isInClient.value) {
    return next({ name: 'line-only' })
  } else {
    return next()
  }
})
