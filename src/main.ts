import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from '@/route/router.ts'
import { useLiff } from '@/features/shared/composables/useLiff'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { configure } from 'vee-validate'

const { initialize } = useLiff()

// validate forms only on submit (not eagerly on input/blur/change)
configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.mount('#app')

initialize()
