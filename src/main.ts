import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from '@/route/router.ts'
import { useLiff } from '@/composables/useLiff.ts'

const { initialize, isInClient } = useLiff()
const app = createApp(App)

app.use(router)
app.mount('#app')
if (!isInClient) {
  initialize()
}
