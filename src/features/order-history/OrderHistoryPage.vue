<script setup lang="ts">
import { Button } from '@/components/button'
import { RefreshCw } from 'lucide-vue-next'
import { useOrderHistoryPage } from './OrderHistoryPage.composable'

const { orders, isLoading, fetchOrders, formatDate } = useOrderHistoryPage()
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold">Order History</h1>
        <RefreshCw
          @click="fetchOrders"
          class="i-lucide-refresh-cw h-4 w-4"
          :class="{ 'animate-spin': isLoading }"
        />
      </div>
      <Button @click="$router.push('/')" variant="outline" size="sm">Back to Home</Button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center">
      <div class="w-full space-y-3">
        <div
          v-for="n in 5"
          :key="n"
          class="h-[8rem] w-full animate-pulse rounded-md bg-gray-200"
        ></div>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="rounded-lg border border-dashed p-8 text-center">
      <p class="text-gray-500">You don't have any orders yet.</p>
      <Button @click="$router.push('/')" class="mt-4">Place an Order</Button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ order.order_name }}</h3>
          <span
            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            :class="{
              'bg-gray-600 text-white': order.status === 'Not started',
              'bg-blue-600 text-white': order.status === 'In progress',
              'bg-green-600 text-white': order.status === 'Done',
              'bg-red-600 text-white': order.status === 'Cancelled'
            }"
            >{{ order.status }}</span
          >
        </div>

        <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="font-medium">Sweetness:</span>
            {{ order.sweetness }}%
          </div>
          <div v-if="order.note">
            <span class="font-medium">Note:</span>
            {{ order.note }}
          </div>
        </div>

        <div class="mt-3 border-t pt-3 text-sm text-gray-600">
          <div>Delivery to: {{ order.building }} Room {{ order.room_id }}</div>
          <div>Tel: {{ order.tel }}</div>
          <div>Order Date: {{ formatDate(order.order_date) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
