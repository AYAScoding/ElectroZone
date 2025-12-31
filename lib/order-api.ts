const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082" // [file:2]

export type OrderDto = {
  id: string | number
  userId: string | number
  productId: string | number
  quantity: number
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: string
  orderDate?: string
}

async function readError(res: Response) {
  const text = await res.text().catch(() => "")
  return `${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`
}

export async function getAllOrders(): Promise<OrderDto[]> {
  const res = await fetch(`${ORDER_SERVICE_URL}/api/orders`, { cache: "no-store" }) // [file:2]
  if (!res.ok) throw new Error(`GET /api/orders failed: ${await readError(res)}`) // [file:2]
  return res.json()
}
