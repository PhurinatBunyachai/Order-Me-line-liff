import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotion } from '@/features/shared/composables/useNotion'
import { useProfileStore } from '@/features/profile/stores/profile'

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

export const useOrderHistoryPage = () => {
  const { initNotion, getDatabase, isLoading } = useNotion()
  const profileStore = useProfileStore()
  const { profile } = storeToRefs(profileStore)
  const orders = ref<OrderItem[]>([])

  const fetchOrders = async () => {
    try {
      const response = await getDatabase('order-history', {
        filter: {
          property: 'user_id',
          rich_text: { equals: profile.value.userId }
        }
      })
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
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  onMounted(async () => {
    await initNotion()
    await fetchOrders()
  })

  return { orders, isLoading, fetchOrders, formatDate }
}
