import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/features/profile/stores/profile'
import { useToast } from '@/components/toast/use-toast'

export const useProfilePage = () => {
  const profileStore = useProfileStore()
  const { profile, profileAddress } = storeToRefs(profileStore)
  const { toast } = useToast()

  const saveProfile = () => {
    profileStore.updateProfileAddress({
      building: profileAddress.value.building,
      roomId: profileAddress.value.roomId,
      tel: profileAddress.value.tel
    })
    toast({
      title: 'Success',
      description: 'Profile saved successfully!'
    })
  }

  return { profile, profileAddress, saveProfile }
}
