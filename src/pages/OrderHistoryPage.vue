<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotion } from '@/composables/useNotion'
import { useProfileStore } from '@/stores/profile'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

interface OrderItem {
  id: string
  order_name: string
  order_date: string
  sweetness: number
  note: string
  building: string
  room_id: string
  tel: string
  status: string
}

const { initNotion, getDatabase, isLoading } = useNotion()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const orders = ref<OrderItem[]>([])

onMounted(async () => {
  await initNotion()
  await fetchOrders()
})

const fetchOrders = async () => {
  try {
    // Query orders for the current user
    const response = await getDatabase('order-history', {
      filter: {
        property: 'user_id',
        rich_text: {
          equals: profile.value.userId
        }
      }
    })
    console.log(response)
    if (response && response.results) {
      const orderResult = response.results.map((result) => {
        const properties = result.properties
        return {
          id: result.id,
          order_name: properties.order_name?.title[0]?.plain_text,
          order_date: properties.order_date?.date?.start || '',
          sweetness: properties.sweetness?.number || 0,
          note: properties.note?.rich_text?.[0]?.text?.content || '',
          building: properties.buliding?.rich_text?.[0]?.text?.content || '',
          room_id: properties.room_id?.rich_text?.[0]?.text?.content || '',
          tel: properties.tel?.rich_text?.[0]?.text?.content || '',
          status: properties.status?.status?.name
        }
      })
      orders.value = orderResult as OrderItem[]
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Order History</h1>
      <Button @click="$router.push('/')" variant="outline" size="sm">Back to Home</Button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-10">
      <Loader2 class="mr-2 h-8 w-8 animate-spin" />
      <span>Loading orders...</span>
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
