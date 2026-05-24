import { createWebHistory, createRouter } from 'vue-router'
import { useLiff } from '@/features/shared/composables/useLiff'

const isProd = import.meta.env.PROD
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/home/HomePage.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/features/profile/ProfilePage.vue')
  },
  {
    path: '/order-history',
    name: 'order-history',
    component: () => import('@/features/order-history/OrderHistoryPage.vue')
  },
  {
    path: '/line-only',
    name: 'line-only',
    component: () => import('@/features/line-only/LineOnlyPage.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

const { isInClient, initialize } = useLiff()

router.beforeEach(async (to, _, next) => {
  await initialize()
  if (to.path === '/line-only') {
    return next()
  }
  if (isProd && !isInClient.value) {
    return next({ name: 'line-only' })
  } else {
    return next()
  }
})
