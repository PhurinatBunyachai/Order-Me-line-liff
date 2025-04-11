<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
defineProps({
  profile: {
    type: Object,
    required: true
  },
  title: String
})
const isAvatarMenuOpen = ref<boolean>(false)
</script>

<template>
  <div class="sticky top-0 z-50 block h-[50px] w-full bg-primary">
    <div class="flex h-full w-full flex-row items-center justify-between px-5">
      <div class="flex flex-row items-center gap-3" @click="$router.push('/')">
        <img src="/logo.png" alt="logo" class="h-8 w-8 rounded-full bg-white" />
        <div class="text-lg font-semibold text-white">{{ title }}</div>
      </div>
      <div class="mt-1 flex items-center justify-center">
        <DropdownMenu v-model:open="isAvatarMenuOpen">
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage :src="profile.pictureUrl" alt="profileImg" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="$router.push('/profile')">Your Profile</DropdownMenuItem>
            <DropdownMenuItem @click="$router.push('/order-history')"
              >Order History</DropdownMenuItem
            >
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
