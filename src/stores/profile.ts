import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('profile', () => {
  const profile = ref(0)

  return { profile }
})
