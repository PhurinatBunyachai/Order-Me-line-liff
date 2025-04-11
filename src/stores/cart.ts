import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductCart } from '@/types'

export const useCartStore = defineStore(
  'cart',
  () => {
    const carts = ref<ProductCart[]>([])

    return {
      carts
    }
  },
  { persist: true }
)
