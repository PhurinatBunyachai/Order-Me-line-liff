<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product'
import type { Product } from '@/types'
import { useProductStore } from '@/stores/product'
import { useNotion } from '@/composables/useNotion'

const productStore = useProductStore()
const { products } = storeToRefs(productStore)
const { initNotion, getDatabase } = useNotion()

onMounted(async () => {
  await initNotion()

  const test = await getDatabase()
  console.log(test)
})

let isOpen = ref<boolean>(false)
const onAddToCart = (product: Product) => {
  isOpen.value = !isOpen.value
  console.log(product)
  console.log(isOpen.value)
}
</script>

<template>
  <div>
    <h1 class="mb-2 mt-2 w-full text-center">Menu</h1>
    <div class="grid w-full grid-cols-2 gap-2 px-2">
      <ProductCard
        v-for="product in products"
        :product="product"
        :key="product.id"
        @click="onAddToCart(product)"
      />
    </div>

    <Drawer :open="isOpen">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div class="m-h-[200px]">dasadsadsadsads</div>
        <DrawerFooter>
          <Button>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
