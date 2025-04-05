<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProfileStore } from '@/stores/profile'
import { useLiff } from '@/composables/useLiff'

const profileStore = useProfileStore()
const { profile } = useLiff()

const building = ref('')
const roomId = ref('')
const tel = ref('')

const saveProfile = () => {
  // Update the profile store with the new values
  profileStore.updateProfile({
    building: building.value,
    roomId: roomId.value,
    tel: tel.value
  })

  // Show success message or redirect
  alert('Profile saved successfully!')
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-6 text-2xl font-bold">Profile</h1>

    <div class="mb-8 flex items-center">
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
        <Input id="building" v-model="building" placeholder="Enter your building" class="w-full" />
      </div>

      <div>
        <label for="roomId" class="mb-2 block text-sm font-medium">Room ID</label>
        <Input id="roomId" v-model="roomId" placeholder="Enter your room ID" class="w-full" />
      </div>

      <div>
        <label for="tel" class="mb-2 block text-sm font-medium">Tel</label>
        <Input id="tel" v-model="tel" placeholder="Enter your telephone number" class="w-full" />
      </div>

      <Button @click="saveProfile" class="mt-4 w-full">Save Profile</Button>
    </div>
  </div>
</template>
