import { ref } from 'vue'
import liff from '@line/liff'

interface Profile {
  userId: string
  displayName: string | null
  pictureUrl: string
  statusMessage: string | null
}
export const useLiff = () => {
  const isInitialized = ref(false)

  const profile = ref<Profile>()
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
      const liffProfile = (await liff.getProfile()) as Profile
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
