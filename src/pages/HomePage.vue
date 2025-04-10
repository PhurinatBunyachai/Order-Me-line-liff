<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
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
import { useProfileStore } from '@/stores/profile'
import { useNotion } from '@/composables/useNotion'
import { Loader2 } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
const { toast } = useToast()
const productStore = useProductStore()
const profileStore = useProfileStore()
const { products } = storeToRefs(productStore)
const { profile, profileAddress } = storeToRefs(profileStore)
const { initNotion, updateDatabase, getDatabase, isLoading, isProcess, error } = useNotion()

onMounted(async () => {
  await initNotion()
  await onGetMenu()
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

  const isHasProfilAddress = await onCheckProfileAddress()
  if (!isHasProfilAddress) {
    toast({
      title: 'Please fill your address',
      description: 'Please fill in your delivery address before placing an order.',
      action: h(
        ToastAction,
        {
          altText: 'Go to profile',
          onClick: () => {
            window.location.href = '/profile'
          }
        },
        {
          default: () => 'Go to profile'
        }
      )
    })
    return
  }

  const isOpen = await onCheckStore()
  if (!isOpen) {
    alert('Store is closed')
    return
  }
  for (let cart of carts.value) {
    await updateDatabase(cart, profile.value, profileAddress.value)
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

const onCheckStore = async (): Promise<boolean> => {
  const response = await getDatabase({
    page_size: 1
  })
  return response?.results[0].properties.status.status.name.toLowerCase() === 'open'
}
const onCheckProfileAddress = () => {
  if (profileAddress.value.building && profileAddress.value.roomId && profileAddress.value.tel) {
    return true
  }
  return false
}
const onGetMenu = async () => {
  const response = await getDatabase({
    sorts: [
      {
        property: 'id',
        direction: 'ascending'
      }
    ]
  })
  const productResult = response?.results.map((result) => ({
    id: result.properties.id.unique_id.number,
    name: result.properties.name.rich_text[0].plain_text,
    price: result.properties.price.number,
    image: result.properties.image.files[0]?.file.url,
    description: result.properties.description.rich_text[0].plain_text,
    available: result.properties.available.status.name.toLowerCase() === 'open'
  }))
  products.value = productResult as Product[]
}
</script>

<template>
  <div>
    <h1 class="mb-2 mt-2 w-full text-center">Menu</h1>
    {{ error }}
    <div class="grid w-full grid-cols-2 gap-2 px-2">
      <template v-if="isLoading">
        <div
          v-for="n in 8"
          :key="n"
          class="h-[180px] w-[180px] animate-pulse rounded-lg bg-gray-200"
        ></div>
      </template>
      <template v-else>
        <ProductCard
          v-for="product in products"
          :product="product"
          :carts="carts"
          :key="product.id"
          @click="onSelectProduct(product)"
        />
      </template>
    </div>

    <div class="absolute bottom-0 min-w-full">
      <div
        class="fixed bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center rounded-t-lg bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
        @click="isOpenCart = true"
      >
        <!-- <ShoppingCart class="mr-2 h-5 w-5" /> -->
        <span>My Cart ({{ totalPrice }} THB)</span>
      </div>
    </div>

    <Drawer v-model:open="isOpenProduct">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{{ productSelect?.name }}</DrawerTitle>
          <DrawerDescription>{{ productSelect?.description }}</DrawerDescription>
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
    <Drawer v-model:open="isOpenCart">
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
                <span v-if="cart.note" class="text-sm text-gray-600"> Note: {{ cart.note }} </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold">{{ cart.price }} THB</span>
                <Button
                  :disabled="isProcess"
                  variant="outline"
                  size="sm"
                  @click="onRemoveFromCart(index)"
                  >Remove</Button
                >
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button :disabled="!totalPrice || isProcess" @click="onSubmit">
            <Loader2 v-if="isProcess" class="mr-2 h-4 w-4 animate-spin" />
            Submit Order
          </Button>
          <Button :disabled="isProcess" @click="isOpenCart = false" variant="outline">
            <Loader2 v-if="isProcess" class="mr-2 h-4 w-4 animate-spin" />
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
