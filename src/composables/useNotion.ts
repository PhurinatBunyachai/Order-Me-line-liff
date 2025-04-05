import { Client } from '@notionhq/client'
import { ref } from 'vue'
import type { ProductCart, Profile, ProfileAddress } from '@/types'
type NotionProperty = {
  title?: { plain_text: string }[]
  rich_text?: { plain_text: string }[]
  number?: number
  select?: { name: string }
  multi_select?: { name: string }[]
  date?: { start: string }
  checkbox?: boolean
  email?: string
  phone_number?: string
  url?: string
}

interface NotionPage {
  id: string
  properties: Record<string, NotionProperty>
}

const token = import.meta.env.APP_NOTION_API_KEY
const databaseId = import.meta.env.APP_NOTION_DATABASE_ID

export const useNotion = () => {
  const client = ref<Client | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

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

  const getDatabase = async (): Promise<NotionPage | null> => {
    if (!client.value) {
      throw new Error('Notion client not initialized')
    }
    isLoading.value = true
    try {
      const response = await fetch(`/api/notion/databases/${databaseId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }).then((res) => res.json())
      return response as NotionPage
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
  ): Promise<NotionPage | null> => {
    if (!client.value) {
      throw new Error('Notion client not initialized')
    }

    isLoading.value = true
    try {
      const response = await fetch(`/api/notion/pages/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            'Order Name': {
              title: [
                {
                  text: {
                    content: cart.name
                  }
                }
              ]
            },
            Sweetness: {
              number: cart.sweetness
            },
            'User ID': {
              rich_text: [
                {
                  text: {
                    content: profile.userId
                  }
                }
              ]
            },
            Note: {
              rich_text: [
                {
                  text: {
                    content: cart.note
                  }
                }
              ]
            },
            Buliding: {
              rich_text: [
                {
                  text: {
                    content: profileAdress.building
                  }
                }
              ]
            },
            'Room ID': {
              rich_text: [
                {
                  text: {
                    content: profileAdress.roomId
                  }
                }
              ]
            },
            Tel: {
              rich_text: [
                {
                  text: {
                    content: profileAdress.tel
                  }
                }
              ]
            },
            'Order Date': {
              date: {
                start: new Date().toISOString()
              }
            }
          }
        })
      }).then((res) => res.json())
      return response as NotionPage
    } catch (err) {
      error.value = err as Error
      console.error('Failed to update Notion page:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    client,
    error,
    isLoading,
    initNotion,
    getDatabase,
    updateDatabase
  }
}
