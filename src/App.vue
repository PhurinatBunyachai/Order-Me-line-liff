<script setup lang="ts">
import { onMounted } from 'vue'
import { Header } from '@/components/herder'
import { useLiff } from '@/composables/useLiff'

const { getProfile, profile } = useLiff()
onMounted(async () => {
  await getProfile()
})
</script>

<template>
  <Header title="Sketchy" :profile="profile" />
  <div class="container mx-auto flex h-screen max-w-[1280px] justify-center">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
