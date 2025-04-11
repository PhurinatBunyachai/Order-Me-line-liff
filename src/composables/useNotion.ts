import { Client } from '@notionhq/client'
import { ref } from 'vue'
import type { ProductCart, Profile, ProfileAddress, NotionResponse } from '@/types'

const token = import.meta.env.APP_NOTION_API_KEY
const orderDatabaseId = import.meta.env.APP_NOTION_DATABASE_ID
const storeDatabaseId = import.meta.env.APP_NOTION_STORE_INFO_DATABASE_ID
const productDatabaseId = import.meta.env.APP_NOTION_PRODUCT_DATABASE_ID
const apiBaseUrl = import.meta.env.APP_BACKEND_PORT

export const useNotion = () => {
  const client = ref<Client | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  const isProcess = ref(false)

  const initNotion = () => {
    try {
      client.value = new Client({
        auth: token
      })
      error.value = null
    } catch (err) {
      error.value = err as Error
      console.error('Failed to initialize Notion client:', err)
    }
  }

  const getDatabase = async (
    type: string,
    query: Record<string, unknown>
  ): Promise<NotionResponse | null> => {
    if (!client.value) {
      throw new Error('Notion client not initialized')
    }

    isLoading.value = true
    try {
      const response = await fetch(`${apiBaseUrl}/notion/database`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ type: type, query: { ...query } })
      }).then((res) => res.json())
      return response
    } catch (err) {
      error.value = err as Error
      console.error('Failed to get Notion page:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateDatabase = async (
    cart: ProductCart,
    profile: Profile,
    profileAdress: ProfileAddress
  ): Promise<NotionResponse | null> => {
    if (!client.value) {
      throw new Error('Notion client not initialized')
    }

    isProcess.value = true
    try {
      const response = await fetch(`${apiBaseUrl}/notion/page`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          pageObj: {
            parent: { type: 'database_id', database_id: orderDatabaseId },
            properties: {
              order_name: {
                title: [
                  {
                    text: {
                      content: cart.name
                    }
                  }
                ]
              },
              sweetness: {
                number: cart.sweetness
              },
              user_id: {
                rich_text: [
                  {
                    text: {
                      content: profile.userId
                    }
                  }
                ]
              },
              note: {
                rich_text: [
                  {
                    text: {
                      content: cart.note
                    }
                  }
                ]
              },
              buliding: {
                rich_text: [
                  {
                    text: {
                      content: profileAdress.building
                    }
                  }
                ]
              },
              room_id: {
                rich_text: [
                  {
                    text: {
                      content: profileAdress.roomId
                    }
                  }
                ]
              },
              tel: {
                rich_text: [
                  {
                    text: {
                      content: profileAdress.tel
                    }
                  }
                ]
              },
              order_date: {
                date: {
                  start: new Date().toISOString()
                }
              }
            }
          }
        })
      }).then((res) => res.json())
      return response as NotionResponse
    } catch (err) {
      error.value = err as Error
      console.error('Failed to update Notion page:', err)
      return null
    } finally {
      isProcess.value = false
    }
  }

  return {
    client,
    error,
    isLoading,
    isProcess,
    initNotion,
    getDatabase,
    updateDatabase,
    storeDatabaseId,
    productDatabaseId,
    orderDatabaseId
  }
}
