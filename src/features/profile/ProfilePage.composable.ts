import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useProfileStore } from '@/features/profile/stores/profile'
import { useToast } from '@/components/toast/use-toast'
import { profileAddressSchema } from '@/features/profile/schemas/ProfilePage.schema'

export const useProfilePage = () => {
  const profileStore = useProfileStore()
  const { profile, profileAddress } = storeToRefs(profileStore)
  const { toast } = useToast()

  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(profileAddressSchema),
    initialValues: {
      building: profileAddress.value.building ?? '',
      roomId: profileAddress.value.roomId ?? '',
      tel: profileAddress.value.tel ?? ''
    }
  })

  const saveProfile = handleSubmit((values) => {
    profileStore.updateProfileAddress(values)
    toast({
      title: 'Success',
      description: 'Profile saved successfully!'
    })
  })

  return { profile, saveProfile }
}
