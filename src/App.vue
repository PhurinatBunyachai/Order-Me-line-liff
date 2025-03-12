<script setup lang="ts">
import Header from '@/components/herder/HeaderComponent.vue'
</script>

<template>
  <Header />
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
