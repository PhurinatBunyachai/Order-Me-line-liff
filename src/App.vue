<script setup lang="ts">
import { Header } from '@/components/herder'
import { useLiff } from '@/composables/useLiff'
const { profile } = useLiff()
</script>

<template>
  <Header title="Sketchy" :profile="profile" />
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
