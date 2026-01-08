"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: number; name: string };

type InitialProduct = {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  brand?: string;
  category_id?: number;
  specifications?: Record<string, any>;
  image_url?: string | null;
};

interface ProductFormProps {
  onClose: () => void;
  onSubmit?: (productData: any) => void;
  categories: Category[];
  initial?: InitialProduct | null;
}

export default function ProductForm({
  onClose,
  onSubmit,
  categories,
  initial,
}: ProductFormProps) {
  const defaultCategoryId = initial?.category_id ?? categories?.[0]?.id ?? 1;

  const [formData, setFormData] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price?.toString() ?? "",
    stock_quantity: initial?.stock_quantity?.toString() ?? "",
    brand: initial?.brand ?? "",
    category_id: String(defaultCategoryId),
    image_url: initial?.image_url ?? "",
    specificationsText: JSON.stringify(initial?.specifications ?? {}, null, 2),
  });

  const specsError = useMemo(() => {
    try {
      JSON.parse(formData.specificationsText || "{}");
      return null;
    } catch {
      return "Specifications must be valid JSON.";
    }
  }, [formData.specificationsText]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (specsError) return;

    const payload = {
      ...(initial?.id ? { id: initial.id } : {}),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      brand: formData.brand.trim(),
      category_id: Number(formData.category_id),
      specifications: JSON.parse(formData.specificationsText || "{}"),
      image_url: formData.image_url.trim() || null,
    };

    onSubmit?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {initial?.id ? "Edit Product" : "Create Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <Input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock quantity *
                </label>
                <Input
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (id={c.id})
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-red-600 mt-2">
                    No categories found. Create one first in product-service.
                    [file:12]
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <Input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications (JSON)
              </label>
              <textarea
                name="specificationsText"
                value={formData.specificationsText}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm ${
                  specsError ? "border-red-400" : "border-gray-300"
                }`}
                rows={8}
              />
              {specsError && (
                <p className="text-sm text-red-600 mt-2">{specsError}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!!specsError}
            >
              {initial?.id ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
