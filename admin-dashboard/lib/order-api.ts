const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082"

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
  const res = await fetch("/api/orders", { cache: "no-store" })
  if (!res.ok) throw new Error(`GET /api/orders failed: ${await readError(res)}`)
  return res.json()
}

export async function getOrderById(id: string | number): Promise<OrderDto> {
  const res = await fetch(`${ORDER_SERVICE_URL}/api/orders/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error(`GET /api/orders/${id} failed: ${await readError(res)}`)
  return res.json()
}

export async function updateOrderStatus(id: string | number, status: string): Promise<OrderDto> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(status),
  })
  if (!res.ok) throw new Error(`PUT /api/orders/${id}/status failed: ${await readError(res)}`)
  return res.json()
}

export const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
