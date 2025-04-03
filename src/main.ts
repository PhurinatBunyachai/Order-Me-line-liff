import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from '@/route/router.ts'
import { useLiff } from '@/composables/useLiff.ts'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const { initialize } = useLiff()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.mount('#app')

initialize()
