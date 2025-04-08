<script setup lang="ts">
import { onMounted } from 'vue'
import { Header } from '@/components/herder'
import { useLiff } from '@/composables/useLiff'
import { useProfileStore } from '@/stores/profile'
import {Toaster} from '@/components/ui/toast'
const { getProfile, profile } = useLiff()
const profileStore = useProfileStore()

onMounted(async () => {
  await getProfile()

  await profileStore.updateProfile({
    userId: profile.value.userId,
    displayName: profile.value.displayName,
    pictureUrl: profile.value.pictureUrl,
    statusMessage: profile.value.statusMessage
  })
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
