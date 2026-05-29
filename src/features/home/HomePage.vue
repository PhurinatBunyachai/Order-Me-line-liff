<script setup lang="ts">
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/drawer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/select'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { ProductCard } from '@/features/home/components/product-card'
import { Loader2, ShoppingCart } from 'lucide-vue-next'
import { Field } from 'vee-validate'
import { useHomePage } from './HomePage.composable'

const {
  products,
  carts,
  totalPrice,
  isLoading,
  isProcess,
  isOpenProduct,
  isOpenCart,
  productSelect,
  onSelectProduct,
  onAddToCart,
  onSubmit,
  onRemoveFromCart,
  onReset
} = useHomePage()
</script>

<template>
  <div>
    <h1 class="mb-2 mt-2 w-full text-center">Menu</h1>
    <div class="container h-[calc(100vh-10rem)] overflow-y-auto">
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
    </div>

    <div class="absolute bottom-0 min-w-full">
      <div
        class="fixed bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center rounded-t-lg bg-primary p-4 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
        @click="isOpenCart = true"
      >
        <template v-if="isLoading">
          <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading
        </template>
        <template v-if="!isLoading">
          <ShoppingCart class="mr-2 h-5 w-5" />
          <span>My Cart ({{ totalPrice }} THB)</span>
        </template>
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
              <label for="level" class="text-sm"
                >Sweetness <span class="text-red-500">*</span>
              </label>
              <Field name="sweetness" v-slot="{ componentField, errorMessage }">
                <Select id="level" v-bind="componentField">
                  <SelectTrigger :class="errorMessage && 'border-red-500'">
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
                <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
              </Field>
            </div>
            <div class="grid w-full max-w-sm items-center gap-1">
              <label for="note" class="text-sm">Note</label>
              <Field name="note" v-slot="{ componentField, errorMessage }">
                <Input
                  id="note"
                  type="text"
                  placeholder="Note"
                  v-bind="componentField"
                  :class="errorMessage && 'border-red-500'"
                />
                <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
              </Field>
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
          <Button @click="$router.push('/order-history')" class="mt-2 w-full" variant="outline">
            View Order History
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
