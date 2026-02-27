export interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  description: string
  specs: Record<string, string>
  inStock: boolean
  warranty: string
  trending?: boolean
  featured?: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role?: "customer" | "admin"
  addresses: Address[]
  createdAt: string
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  createdAt: string
  shippingAddress: Address
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}
