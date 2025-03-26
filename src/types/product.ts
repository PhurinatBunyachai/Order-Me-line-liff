export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string | 'https://placehold.co/600x400?text=Hello+World'
  description: string
  available: boolean
}
