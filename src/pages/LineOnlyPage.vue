<script setup lang="ts">
import { onMounted, ref } from 'vue'

const message = ref('This page is only accessible within LINE')

onMounted(() => {})
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col items-center justify-center space-y-6 py-8">
      <h1 class="flex items-center gap-2 text-2xl font-bold">Add friend to order</h1>
      <img src="https://qr-official.line.me/gs/M_972kbkrr_GW.png?oat_content=qr" />
      <div class="rounded-lg bg-green-100 p-6 text-center">
        <p class="mb-4 text-lg">{{ message }}</p>
        <p class="text-sm text-gray-600">
          This content is exclusively available to users accessing from the LINE app.
        </p>
      </div>
    </div>
  </div>
</template>
