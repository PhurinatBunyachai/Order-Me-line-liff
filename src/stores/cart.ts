import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProductCart } from '@/types'

export const useCartStore = defineStore(
  'cart',
  () => {
    const carts = ref<ProductCart[]>([])
    const totalPrice = computed(() => carts.value.reduce((acc, cart) => acc + cart.price, 0))
    return {
      carts,
      totalPrice
    }
  },
  { persist: true }
)
