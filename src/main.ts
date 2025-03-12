import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from '@/route/router.ts'
import { useLiff } from '@/composables/useLiff.ts'
import { createPinia } from 'pinia'

const { initialize, getProfile } = useLiff()

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')

initialize()
getProfile()
