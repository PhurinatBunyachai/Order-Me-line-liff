<script setup lang="ts">
import { computed } from 'vue'
import type { Product, ProductCart } from '@/types'
const { product, carts } = defineProps<{
  product: Product
  carts: ProductCart[]
}>()
const totalQuantity = computed(() => {
  return carts.filter((cart) => cart.id === product.id).length
})
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div class="relative h-20 w-full overflow-hidden rounded-t-lg">
      <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
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
