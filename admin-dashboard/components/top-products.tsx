"use client"

interface Product {
  id: number
  name: string
  sales: number
}

interface TopProductsProps {
  products?: Product[]
}

export default function TopProducts({ products = [] }: TopProductsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No products data</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <p className="text-sm text-gray-700 font-medium truncate">{product.name}</p>
              <span className="text-sm font-bold text-green-600 flex-shrink-0 ml-2">{product.sales}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
