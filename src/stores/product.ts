import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([
    {
      id: 1,
      name: 'Americano',
      price: 45,
      description: 'Espresso shot with hot water',
      category: 'hot',
      image: '/assets/img/products/coffee.png',
      available: true
    }
    // {
    //   id: 2,
    //   name: 'Iced Latte',
    //   price: 55,
    //   description: 'Espresso with cold milk and ice',
    //   category: 'cold',
    //   image: '@/assets/img/products/coffee.png',
    //   available: true
    // },
    // {
    //   id: 3,
    //   name: 'Iced Caramel',
    //   price: 65,
    //   description: 'Blended coffee with caramel syrup',
    //   category: 'cold',
    //   image: '@/assets/img/products/coffee.png',
    //   available: true
    // }
  ])

  return {
    // State
    products
  }
})
