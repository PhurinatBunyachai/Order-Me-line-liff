<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product, ProductCart } from '@/types'
const { product, carts } = defineProps<{
  product: Product
  carts: ProductCart[]
}>()
const totalQuantity = computed(() => {
  return carts.filter((cart) => cart.id === product.id).length
})

const imageLoaded = ref(false)
const imageError = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<template>
  <div
    class="animate-fade-in rounded-lg border bg-card text-card-foreground shadow-sm transition-opacity duration-300 ease-in-out"
    :class="{ 'pointer-events-none opacity-50': !product.available }"
  >
    <div v-if="!product.available" class="relative z-10">
      <div class="absolute right-10 top-[4.2rem]">
        <span class="rounded-full bg-gray-500 px-3 py-1 text-sm text-white"> Out of Stock </span>
      </div>
    </div>
    <div class="relative aspect-square w-full overflow-hidden rounded-t-lg">
      <img
        :src="product.image"
        :alt="product.name"
        class="h-full w-full object-cover"
        @load="handleImageLoad"
        @error="handleImageError"
        :class="{ 'opacity-0': !imageLoaded && !imageError }"
      />
      <div
        v-if="!imageLoaded && !imageError"
        class="absolute inset-0 flex items-center justify-center bg-gray-100"
      >
        <img src="/preload-image.png" alt="Loading" class="h-64 w-64" />
      </div>
      <div v-if="imageError" class="absolute inset-0 flex items-center justify-center bg-gray-100">
        <span class="text-sm text-gray-500">Image not available</span>
      </div>
      <span
        v-if="totalQuantity"
        class="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white"
      >
        {{ totalQuantity }}
      </span>
    </div>
    <div class="p-4">
      <h3 class="font-semibold">{{ product.name }}</h3>
      <p class="mt-2 line-clamp-2 text-sm text-gray-600">
        {{ product.description }}
      </p>
      <div class="mt-4 flex items-center justify-end">
        <span class="text-lg font-bold">{{ product.price }} THB</span>
      </div>
    </div>
  </div>
</template>
