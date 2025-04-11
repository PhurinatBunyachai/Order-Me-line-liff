import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])

  // State
  return {
    products
  }
})
