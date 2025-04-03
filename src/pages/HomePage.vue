<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product'
import type { Product, ProductCart } from '@/types'
import { useProductStore } from '@/stores/product'
import { useNotion } from '@/composables/useNotion'

const productStore = useProductStore()
const { products } = storeToRefs(productStore)
const { initNotion, updateDatabase } = useNotion()

onMounted(async () => {
  await initNotion()
})

const isOpenProduct = ref<boolean>(false)
const isOpenCart = ref<boolean>(false)
const productSelect = ref<ProductCart>()
const totalPrice = computed(() => carts.value.reduce((acc, cart) => acc + cart.price, 0))
let carts = ref<ProductCart[]>([])
let level = ref()
let note = ref('')

const onSelectProduct = (product: Product) => {
  isOpenProduct.value = !isOpenProduct.value
  productSelect.value = product
}

const onAddToCart = () => {
  isOpenProduct.value = false
  if (productSelect.value) {
    carts.value = [
      ...carts.value,
      { ...productSelect.value, sweetness: level.value, note: note.value }
    ]
  }
  onReset()
}
const onSubmit = async () => {
  if (!carts.value.length) {
    return
  }
  for (let cart of carts.value) {
    await updateDatabase(cart)
  }
  carts.value = []
  isOpenCart.value = false
  await onReset
}
const onRemoveFromCart = (index: number) => {
  carts.value.splice(index, 1)
}
const onReset = () => {
  isOpenProduct.value = false
  productSelect.value = undefined
  level.value = undefined
  note.value = ''
}
</script>

<template>
  <div>
    <h1 class="mb-2 mt-2 w-full text-center">Menu</h1>
    <div class="grid w-full grid-cols-2 gap-2 px-2">
      <ProductCard
        v-for="product in products"
        :product="product"
        :carts="carts"
        :key="product.id"
        @click="onSelectProduct(product)"
      />
    </div>

    <div class="absolute bottom-0 min-w-full">
      <div
        class="fixed bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
        @click="isOpenCart = true"
      >
        <ShoppingCart class="mr-2 h-5 w-5" />
        <span>My Cart ({{ totalPrice }} THB)</span>
      </div>
    </div>

    <Drawer :open="isOpenProduct">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{{ productSelect?.name }}</DrawerTitle>
          <DrawerDescription>เราใช้เมล็ดคั่วกลางทุกแก้ว</DrawerDescription>
        </DrawerHeader>
        <div class="m-h-[500px] px-4">
          <div class="flex flex-col">
            <div class="mb-2 grid w-full max-w-sm items-center gap-1">
              <label for="level" class="text-sm">Sweetness</label>
              <Select id="level" v-model="level">
                <SelectTrigger>
                  <SelectValue placeholder="Select a Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Level</SelectLabel>
                    <SelectItem :value="100"> 100 % </SelectItem>
                    <SelectItem :value="75"> 75 % </SelectItem>
                    <SelectItem :value="50"> 50 % </SelectItem>
                    <SelectItem :value="25"> 25 % </SelectItem>
                    <SelectItem :value="0"> 0 % </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="grid w-full max-w-sm items-center gap-1">
              <label for="note" class="text-sm">Note</label>
              <Input id="note" type="text" placeholder="Note" v-model="note" />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button @click="onAddToCart">Add To Cart ({{ productSelect?.price }} THB)</Button>
          <Button @click="onReset" variant="outline">Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    <Drawer :open="isOpenCart">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>My Cart</DrawerTitle>
          <DrawerDescription>Total: {{ totalPrice }} THB</DrawerDescription>
        </DrawerHeader>
        <div class="m-h-[500px] px-4">
          <div class="flex flex-col gap-4">
            <div
              v-for="(cart, index) in carts"
              :key="cart.id"
              class="flex items-center justify-between rounded-lg border p-4"
            >
              <div class="flex flex-col">
                <span class="font-semibold">{{ cart.name }}</span>
                <span class="text-sm text-gray-600">Sweetness: {{ cart.sweetness }} %</span>
                <span v-if="cart.note" class="text-sm text-gray-600">Note: {{ cart.note }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold">{{ cart.price }} THB</span>
                <Button variant="outline" size="sm" @click="onRemoveFromCart(index)">Remove</Button>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button :disabled="!totalPrice" @click="onSubmit">Submit Order</Button>
          <Button @click="isOpenCart = false" variant="outline">Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
