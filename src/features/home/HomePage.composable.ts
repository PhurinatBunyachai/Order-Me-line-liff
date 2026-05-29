import { ref, onMounted, h } from 'vue'
import { storeToRefs } from 'pinia'
import { ToastAction } from '@/components/toast'
import { useToast } from '@/components/toast/use-toast'
import type { Product, ProductCart } from '@/types'
import { useProductStore } from '@/features/home/stores/product'
import { useProfileStore } from '@/features/profile/stores/profile'
import { useCartStore } from '@/features/home/stores/cart'
import { useNotion } from '@/features/shared/composables/useNotion'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { orderFormSchema } from '@/features/home/schemas/HomePage.schema'
import { profileAddressSchema } from '@/features/profile/schemas/ProfilePage.schema'

export const useHomePage = () => {
  const { toast } = useToast()
  const productStore = useProductStore()
  const profileStore = useProfileStore()
  const cartStore = useCartStore()
  const { products } = storeToRefs(productStore)
  const { profile, profileAddress } = storeToRefs(profileStore)
  const { carts, totalPrice } = storeToRefs(cartStore)
  const { initNotion, updateDatabase, getDatabase, isLoading, isProcess } = useNotion()

  const isOpenProduct = ref<boolean>(false)
  const isOpenCart = ref<boolean>(false)
  const productSelect = ref<ProductCart>()
  const { handleSubmit, resetForm } = useForm({
    validationSchema: toTypedSchema(orderFormSchema)
  })

  const onSelectProduct = (product: Product) => {
    resetForm()
    isOpenProduct.value = !isOpenProduct.value
    productSelect.value = product
  }

  const onAddToCart = handleSubmit((values) => {
    if (productSelect.value) {
      carts.value = [
        ...carts.value,
        { ...productSelect.value, sweetness: values.sweetness, note: values.note }
      ]
    }
    onReset()
  })

  const onSubmit = async () => {
    if (!carts.value.length) return

    const isHasProfilAddress = onCheckProfileAddress()
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
          { default: () => 'Go to profile' }
        )
      })
      return
    }

    const isOpen = await onCheckStore()
    if (!isOpen) {
      toast({
        title: 'Store Closed',
        description: 'Sorry, the store is currently closed. Please try again later.'
      })
      return
    }

    for (const cart of carts.value) {
      await updateDatabase(cart, profile.value, profileAddress.value)
    }
    carts.value = []
    isOpenCart.value = false
    toast({
      title: 'Order Success',
      description: 'Your order has been placed successfully.',
      action: h(
        ToastAction,
        {
          altText: 'View Order',
          onClick: () => {
            window.location.href = '/order-history'
          }
        },
        { default: () => 'View Order' }
      )
    })
    onReset()
  }

  const onRemoveFromCart = (index: number) => {
    carts.value.splice(index, 1)
  }

  const onReset = () => {
    isOpenProduct.value = false
    productSelect.value = undefined
    resetForm()
  }

  const onCheckStore = async (): Promise<boolean> => {
    isProcess.value = true
    const response = await getDatabase('store', { page_size: 1 })
    isProcess.value = false
    return response?.results[0].properties.status.status.name.toLowerCase() === 'open'
  }

  const onCheckProfileAddress = () => {
    return profileAddressSchema.safeParse(profileAddress.value).success
  }

  const onGetMenu = async () => {
    const response = await getDatabase('product', {
      sorts: [{ property: 'id', direction: 'ascending' }]
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

  onMounted(async () => {
    await initNotion()
    await onGetMenu()
  })

  return {
    products,
    profile,
    profileAddress,
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
  }
}
