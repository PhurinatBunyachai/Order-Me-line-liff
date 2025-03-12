<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
defineProps({
  profile: {
    type: Object,
    required: true
  },
  title: String
})
</script>

<template>
  <div class="h-[50px] w-screen bg-green-600">
    <div class="flex h-full w-full flex-row items-center justify-between px-10">
      <div class="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage :src="profile.pictureUrl" alt="profileImg" />
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
        <div class="text-lg font-semibold text-white">{{ title }}</div>
      </div>
    </div>
  </div>
</template>
