<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Header } from '@/components/herder'
import { useLiff } from '@/composables/useLiff'
import { useProfileStore } from '@/stores/profile'
import { Toaster } from '@/components/ui/toast'
const { getProfile, profile, isInClient, initialize } = useLiff()
const profileStore = useProfileStore()
const isLoading = ref(true)

onMounted(async () => {
  // Initialize LIFF SDK first
  await initialize()

  if (isInClient.value) {
    console.log('in client')
  }
  await getProfile()

  await profileStore.updateProfile({
    userId: profile.value.userId,
    displayName: profile.value.displayName,
    pictureUrl: profile.value.pictureUrl,
    statusMessage: profile.value.statusMessage
  })

  isLoading.value = false
})
</script>

<template>
  <Toaster />
  <Header title="Sketchy" :profile="profile" />
  <div class="container mx-auto flex h-screen max-w-[1280px] justify-center">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
