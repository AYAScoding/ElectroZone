# Backend Integration Guide for ElectroZone Admin Dashboard

This guide explains how to connect the ElectroZone admin dashboard frontend to your backend API.

## Overview

The admin dashboard is now a **pure frontend component** with no hardcoded data. All data is passed through props, making it easy to integrate with any backend.

## Data Structure

### 1. Overview Section

**Expected Data Format:**
\`\`\`typescript
overviewData: {
  stats: {
    totalItems: { value: string, change: string }     // e.g., { value: "2,543", change: "+12%" }
    totalOrders: { value: string, change: string }    // e.g., { value: "847", change: "+8%" }
    outOfStock: { value: string, change: string }     // e.g., { value: "23", change: "+3" }
    revenue: { value: string, change: string }        // e.g., { value: "$45,320", change: "+24%" }
  }
  recentActivities: [
    {
      id: number
      action: string           // e.g., "New Order", "Product Added"
      description: string      // e.g., "Order #ORD-001 from John Doe"
      time: string            // e.g., "2 hours ago"
    }
  ]
  topProducts: [
    {
      id: number
      name: string            // Product name
      sales: number           // Number of sales
    }
  ]
}
\`\`\`

### 2. Products Section

**Expected Data Format:**
\`\`\`typescript
productsData: [
  {
    id: number
    name: string             // e.g., "Wireless Headphones"
    sku: string             // e.g., "WH-001"
    price: string           // e.g., "$79.99"
    stock: number           // e.g., 45
    category: string        // e.g., "Audio"
    status: string          // "Active" or "Out of Stock"
  }
]
\`\`\`

### 3. Collections Section

**Expected Data Format:**
\`\`\`typescript
collectionsData: [
  {
    id: number
    name: string            // e.g., "Gaming Gear"
    items: number           // Number of items in collection
    featured: boolean       // Whether collection is featured
  }
]
\`\`\`

### 4. Orders Section

**Expected Data Format:**
\`\`\`typescript
ordersData: [
  {
    id: string              // e.g., "#ORD-001"
    customer: string        // e.g., "John Doe"
    amount: string          // e.g., "$234.50"
    status: string          // "Delivered", "Shipped", "Processing", or "Pending"
    date: string            // e.g., "2025-12-02"
  }
]
\`\`\`

### 5. Analytics Section

**Expected Data Format:**
\`\`\`typescript
analyticsData: [
  {
    month: string           // e.g., "Jan", "Feb", "Mar"
    sales: number           // Sales count
    revenue: number         // Revenue amount
  }
]
\`\`\`

## Integration Steps

### Step 1: Create API Endpoints in Your Backend

Create the following endpoints:

\`\`\`
GET  /api/dashboard/overview      - Returns overview statistics
GET  /api/products                - Returns all products
POST /api/products                - Creates new product
PUT  /api/products/:id            - Updates product
DELETE /api/products/:id          - Deletes product
GET  /api/collections             - Returns all collections
POST /api/collections             - Creates new collection
PUT  /api/collections/:id         - Updates collection
DELETE /api/collections/:id       - Deletes collection
GET  /api/orders                  - Returns all orders
GET  /api/orders/:id              - Returns order details
GET  /api/analytics               - Returns analytics data
\`\`\`

### Step 2: Fetch Data in Your Frontend

Update `app/page.tsx` with your API calls:

\`\`\`typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch overview data
      const overviewResponse = await fetch('YOUR_BACKEND_URL/api/dashboard/overview')
      const overviewData = await overviewResponse.json()
      setDashboardData(prev => ({ ...prev, overview: overviewData }))

      // Fetch products
      const productsResponse = await fetch('YOUR_BACKEND_URL/api/products')
      const productsData = await productsResponse.json()
      setDashboardData(prev => ({ ...prev, products: productsData }))

      // Fetch collections
      const collectionsResponse = await fetch('YOUR_BACKEND_URL/api/collections')
      const collectionsData = await collectionsResponse.json()
      setDashboardData(prev => ({ ...prev, collections: collectionsData }))

      // Fetch orders
      const ordersResponse = await fetch('YOUR_BACKEND_URL/api/orders')
      const ordersData = await ordersResponse.json()
      setDashboardData(prev => ({ ...prev, orders: ordersData }))

      // Fetch analytics
      const analyticsResponse = await fetch('YOUR_BACKEND_URL/api/analytics')
      const analyticsData = await analyticsResponse.json()
      setDashboardData(prev => ({ ...prev, analytics: analyticsData }))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  fetchData()
}, [])
\`\`\`

### Step 3: Implement CRUD Operations

Connect the handler functions to your backend:

\`\`\`typescript
const handleAddProduct = async (productData: any) => {
  try {
    const response = await fetch('YOUR_BACKEND_URL/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    const newProduct = await response.json()
    
    // Refresh products list
    const productsResponse = await fetch('YOUR_BACKEND_URL/api/products')
    const productsData = await productsResponse.json()
    setDashboardData(prev => ({ ...prev, products: productsData }))
  } catch (error) {
    console.error("Error adding product:", error)
  }
}

const handleEditProduct = async (id: number) => {
  // Implement edit logic - you may want to open a form first
}

const handleDeleteProduct = async (id: number) => {
  try {
    await fetch(`YOUR_BACKEND_URL/api/products/${id}`, {
      method: 'DELETE'
    })
    
    // Refresh products list
    const productsResponse = await fetch('YOUR_BACKEND_URL/api/products')
    const productsData = await productsResponse.json()
    setDashboardData(prev => ({ ...prev, products: productsData }))
  } catch (error) {
    console.error("Error deleting product:", error)
  }
}
\`\`\`

## Example Backend Response Formats

### Overview Endpoint Response
\`\`\`json
{
  "stats": {
    "totalItems": { "value": "2,543", "change": "+12%" },
    "totalOrders": { "value": "847", "change": "+8%" },
    "outOfStock": { "value": "23", "change": "+3" },
    "revenue": { "value": "$45,320", "change": "+24%" }
  },
  "recentActivities": [
    {
      "id": 1,
      "action": "New Order",
      "description": "Order #ORD-001 from John Doe",
      "time": "2 hours ago"
    }
  ],
  "topProducts": [
    {
      "id": 1,
      "name": "Gaming Keyboard",
      "sales": 342
    }
  ]
}
\`\`\`

### Products Endpoint Response
\`\`\`json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "sku": "WH-001",
    "price": "$79.99",
    "stock": 45,
    "category": "Audio",
    "status": "Active"
  }
]
\`\`\`

## Authentication (Optional)

If your backend requires authentication, add headers to your fetch calls:

\`\`\`typescript
const response = await fetch('YOUR_BACKEND_URL/api/products', {
  headers: {
    'Authorization': `Bearer ${yourAuthToken}`,
    'Content-Type': 'application/json'
  }
})
\`\`\`

## Error Handling

Implement proper error handling for all API calls:

\`\`\`typescript
try {
  const response = await fetch('YOUR_BACKEND_URL/api/products')
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  const data = await response.json()
  setDashboardData(prev => ({ ...prev, products: data }))
} catch (error) {
  console.error("Error:", error)
  // Show error message to user
}
\`\`\`

## Using Environment Variables

Store your backend URL in an environment variable:

\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
\`\`\`

Then use it in your code:

\`\`\`typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
\`\`\`

## Testing

1. Start with mock data to test the UI
2. Gradually replace with real API calls
3. Test all CRUD operations
4. Verify error handling
5. Test loading states

---

Your ElectroZone admin dashboard is now ready to connect to any backend! Simply implement the endpoints with the expected data formats and connect them using the pattern shown above.
