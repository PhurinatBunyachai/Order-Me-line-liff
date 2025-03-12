import { ref } from 'vue'
import liff from '@line/liff'
import type { Profile } from '@/types'

export const useLiff = () => {
  const isInitialized = ref(false)

  const profile = ref<Profile>(<Profile>{})
  const error = ref<Error | null>(null)
  const isInClient = ref<boolean>(false)

  const initialize = async () => {
    const liffId = import.meta.env.APP_LIFF_ID

    try {
      if (!liffId) {
        throw new Error('LIFF ID is required')
      }

      await liff.init({
        liffId,
        withLoginOnExternalBrowser: true
      })

      isInitialized.value = true
      isInClient.value = liff.isInClient()

      if (!liff.isLoggedIn()) {
        liff.login()
      }
    } catch (err) {
      error.value = err as Error
      console.error('LIFF initialization failed', err)
    }
  }

  const getProfile = async () => {
    try {
      if (!isInitialized.value) {
        await initialize()
      }
      const data = (await liff.getProfile()) as Profile
      profile.value = data
      return profile
    } catch (err) {
      error.value = err as Error
      console.error('Failed to get LIFF profile', err)
      return null
    }
  }

  const closeWindow = () => {
    liff.closeWindow()
  }

  return {
    isInitialized,
    profile,
    error,
    initialize,
    getProfile,
    closeWindow,
    isInClient
  }
}
