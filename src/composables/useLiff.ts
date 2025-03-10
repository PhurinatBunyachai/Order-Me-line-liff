import { ref } from 'vue'
import liff from '@line/liff'

export const useLiff = () => {
  const isInitialized = ref(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = ref<any>(null)
  const error = ref<Error | null>(null)

  const initialize = async () => {
    const liffId = import.meta.env.VITE_LIFF_ID

    try {
      if (!liffId) {
        throw new Error('LIFF ID is required')
      }

      await liff.init({
        liffId,
        withLoginOnExternalBrowser: true
      })

      isInitialized.value = true

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
      const liffProfile = await liff.getProfile()
      profile.value = liffProfile
      return liffProfile
    } catch (err) {
      error.value = err as Error
      console.error('Failed to get LIFF profile', err)
      return null
    }
  }

  const closeWindow = () => {
    liff.closeWindow()
  }

  const isInClient = () => {
    liff.isInClient()
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
