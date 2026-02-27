"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductForm from "../product-form";
import { useTheme } from "../admin-dashboard";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  category: string;
  status: string;
}

interface CategoryUi {
  id: number;
  name: string;
}

interface ProductManagementProps {
  products?: Product[];
  categories?: CategoryUi[];
  onAddProduct?: (payload: any) => Promise<void> | void;
  onEditProduct?: (id: number, payload: any) => Promise<void> | void;
  onDeleteProduct?: (id: number) => Promise<void> | void;
}

const colorMap = {
  green: { bg: "bg-green-600", hover: "hover:bg-green-700" },
  blue: { bg: "bg-blue-600", hover: "hover:bg-blue-700" },
  red: { bg: "bg-red-600", hover: "hover:bg-red-700" },
  orange: { bg: "bg-orange-600", hover: "hover:bg-orange-700" },
};

export default function ProductManagement({
  products = [],
  categories = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isDarkMode, accentColor, t } = useTheme();
  const colors =
    colorMap[accentColor as keyof typeof colorMap] || colorMap.green;

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const openAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    setError(null);
    setBusyId(id);
    try {
      await onDeleteProduct?.(id);
    } catch (e: any) {
      setError(e?.message ?? "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (payload: any) => {
    setError(null);
    try {
      if (editing?.id) {
        await onEditProduct?.(editing.id, payload);
      } else {
        await onAddProduct?.(payload);
      }
    } catch (e: any) {
      setError(e?.message ?? "Save failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("productManagement")}
          </h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your product inventory
          </p>
        </div>
        <Button
          onClick={openAdd}
          className={`${colors.bg} ${colors.hover} text-white gap-2`}
        >
          <Plus size={18} />
          {t("addNewProduct")}
        </Button>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <ProductForm
          categories={categories}
          initial={
            editing
              ? {
                id: editing.id,
                name: editing.name,
                // These fields aren’t in the table model; the parent edit handler will fetch by id later if you want.
              }
              : null
          }
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder={t("searchProducts")}
            className={`pl-10 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""
              }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-foreground/70"
              >
                {t("name")}
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-foreground/70"
              >
                {t("sku")}
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-foreground/70"
              >
                {t("price")}
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-foreground/70"
              >
                {t("stock")}
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-foreground/70"
              >
                {t("category")}
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-foreground/70"
              >
                {t("status")}
              </th>
              <th
                className={`px-6 py-3 text-center text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className={`px-6 py-8 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {t("noProducts")}
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border transition-colors hover:bg-muted/30"
                >
                  <td
                    className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {p.name}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {p.sku}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {p.price}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {p.stock}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                          : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        disabled={busyId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                          ? "hover:bg-red-900 text-gray-400 hover:text-red-400"
                          : "hover:bg-red-100 text-gray-600 hover:text-red-600"
                          } ${busyId === p.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
