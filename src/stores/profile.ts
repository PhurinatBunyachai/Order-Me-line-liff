import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile, ProfileAddress } from '@/types'

export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<Profile>({
      userId: '',
      displayName: '',
      pictureUrl: '',
      statusMessage: ''
    })

    const profileAddress = ref<ProfileAddress>({
      building: '',
      roomId: '',
      tel: ''
    })

    const updateProfileAddress = (newProfile: ProfileAddress) => {
      profileAddress.value = { ...newProfile }
    }

    const updateProfile = (newProfile: Profile) => {
      profile.value = { ...newProfile }
    }

    return { profile, profileAddress, updateProfile, updateProfileAddress }
  },
  {
    persist: true
  }
)
