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
  <div class="h-[50px] w-screen bg-green-600">
    <div class="flex h-full w-full flex-row items-center justify-between px-10">
      <div></div>
      <div class="flex flex-row items-center gap-3">
        <div class="text-lg font-semibold text-white">{{ title }}</div>
      </div>
      <div class="mt-2 flex items-center justify-center">
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
