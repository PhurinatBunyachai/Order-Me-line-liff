import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import OrderHistoryPage from '@/pages/OrderHistoryPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/profile', component: ProfilePage },
  { path: '/order-history', component: OrderHistoryPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
