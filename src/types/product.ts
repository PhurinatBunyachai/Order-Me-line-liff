export interface Product {
  id: number
  name: string
  price: number
  category?: string
  image: string
  description: string
  available: boolean
}

export interface ProductCart extends Product {
  sweetness?: 100 | 75 | 50 | 25 | 0
  note?: string
  quantity?: number
}
