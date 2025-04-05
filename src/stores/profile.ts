import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserProfile {
  building?: string
  roomId?: string
  tel?: string
}

export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<UserProfile>({
      building: '',
      roomId: '',
      tel: ''
    })

    const updateProfile = (newProfile: UserProfile) => {
      profile.value = { ...profile.value, ...newProfile }
    }

    return { profile, updateProfile }
  },
  {
    persist: true
  }
)
