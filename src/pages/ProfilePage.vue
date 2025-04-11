<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const { profile, profileAddress } = storeToRefs(profileStore)

const saveProfile = () => {
  // Update the profile store with the new values
  profileStore.updateProfileAddress({
    building: profileAddress.value.building,
    roomId: profileAddress.value.roomId,
    tel: profileAddress.value.tel
  })

  // Show success message or redirect
  alert('Profile saved successfully!')
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-6 text-2xl">Profile</h1>

    <div class="mb-8 flex items-center justify-center">
      <div v-if="profile.pictureUrl" class="mr-4">
        <img :src="profile.pictureUrl" alt="Profile" class="h-16 w-16 rounded-full" />
      </div>
      <div>
        <h2 class="text-xl font-semibold">{{ profile.displayName || 'User' }}</h2>
        <p class="text-gray-600">{{ profile.statusMessage || '' }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <label for="building" class="mb-2 block text-sm font-medium">Building</label>
        <Input
          id="building"
          v-model="profileAddress.building"
          placeholder="Enter your building (A B C D)"
          class="w-full"
        />
      </div>

      <div>
        <label for="roomId" class="mb-2 block text-sm font-medium">Room ID</label>
        <Input
          id="roomId"
          v-model="profileAddress.roomId"
          placeholder="Enter your Room ID (2XX)"
          class="w-full"
        />
      </div>

      <div>
        <label for="tel" class="mb-2 block text-sm font-medium">Tel</label>
        <Input
          id="tel"
          v-model="profileAddress.tel"
          placeholder="Enter your telephone number"
          class="w-full"
        />
      </div>

      <Button @click="saveProfile" class="mt-4 w-full">Save Profile</Button>
      <Button @click="$router.push('/order-history')" class="mt-4 w-full" variant="secondary"
        >View Order History</Button
      >
      <Button @click="$router.push('/')" class="mt-4 w-full" variant="outline">Back to Home</Button>
    </div>
  </div>
</template>
