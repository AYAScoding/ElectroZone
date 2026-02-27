"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AdminDashboard from "@/components/admin-dashboard";
import { getAllOrders } from "@/lib/order-api";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "@/lib/product-api";
import { getAllUsers, updateUserRole, deleteUser, UserDto } from "@/lib/user-api";

type DashboardState = {
  overview: any;
  products: any[];
  categories: Array<{
    id: number;
    name: string;
    items?: number;
    featured?: boolean;
  }>;
  collections: any[]; // we’ll reuse categories as collections
  orders: any[];
  users: UserDto[];
  analytics: any[];
};

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardState>({
    overview: undefined,
    products: [],
    categories: [],
    collections: [],
    orders: [],
    users: [],
    analytics: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [categoriesRaw, productsRaw, ordersRaw, usersRaw] = await Promise.all([
        getCategories(),
        getProducts(),
        getAllOrders(),
        getAllUsers(),
      ]);

      const catNameById = new Map<number, string>(
        categoriesRaw.map((c) => [c.id, c.name])
      ); // [file:12]
      const productCountByCategory = new Map<number, number>();
      for (const p of productsRaw) {
        const cid = Number(p.category_id);
        productCountByCategory.set(
          cid,
          (productCountByCategory.get(cid) ?? 0) + 1
        );
      }

      const categoriesUi = categoriesRaw.map((c) => ({
        id: c.id,
        name: c.name,
        items: productCountByCategory.get(c.id) ?? 0,
        featured: false,
      })); // [file:12]

      const productsUi = productsRaw.map((p: any) => ({
        id: Number(p.id),
        name: String(p.name ?? ""),
        sku: `ID-${p.id}`,
        price: `$${Number(p.price ?? 0).toFixed(2)}`,
        stock: Number(p.stock_quantity ?? 0), // [file:12]
        category:
          catNameById.get(Number(p.category_id)) ?? `Category ${p.category_id}`, // [file:12]
        status: Number(p.stock_quantity ?? 0) > 0 ? "Active" : "Out of Stock",
      })); // [file:12]

      // Build lookup: userId (string) → user name
      const userNameById = new Map<string, string>(
        usersRaw.map((u: any) => [String(u._id), u.name || u.email || "Unknown"])
      );

      const ordersUi = ordersRaw.map((o: any) => ({
        id: String(o.id),
        customer: userNameById.get(String(o.userId)) ?? `User ${o.userId}`,
        amount: `$${Number(o.totalAmount ?? 0).toFixed(2)}`,
        status: String(o.status ?? "PENDING"),
        date: new Date(o.orderDate ?? Date.now()).toISOString().slice(0, 10),
        raw: {
          userId: String(o.userId),
          productId: o.productId,
          quantity: o.quantity,
          paymentStatus: o.paymentStatus ?? "",
          paymentMethod: o.paymentMethod ?? "",
          shippingAddress: o.shippingAddress ?? "",
        },
      }));

      // Calculate Recent Activity (latest 5 orders)
      const recentActivities = [...ordersRaw]
        .sort((a: any, b: any) => new Date(b.orderDate || 0).getTime() - new Date(a.orderDate || 0).getTime())
        .slice(0, 5)
        .map((o: any) => ({
          id: Number(o.id),
          action: "New Order",
          description: `Order #${o.id} placed by ${userNameById.get(String(o.userId)) || `User ${o.userId}`}`,
          time: new Date(o.orderDate || Date.now()).toLocaleString(),
        }));

      // Calculate Top Products
      const productSalesMap = new Map<number, number>();
      for (const o of ordersRaw) {
        const pid = Number(o.productId);
        productSalesMap.set(pid, (productSalesMap.get(pid) ?? 0) + (o.quantity ?? 1));
      }

      const topProducts = Array.from(productSalesMap.entries())
        .map(([pid, sales]) => {
          const product = productsRaw.find((p: any) => Number(p.id) === pid);
          return {
            id: pid,
            name: product ? product.name : `Product #${pid}`,
            sales: sales,
          };
        })
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      const totalItems = productsUi.length;
      const totalOrders = ordersUi.length;
      const outOfStock = productsUi.filter((p) => p.status !== "Active").length;
      const revenueNumber = ordersRaw.reduce(
        (sum: number, o: any) => sum + Number(o.totalAmount ?? 0),
        0
      ); // [file:2]

      const overview = {
        stats: {
          totalItems: { value: String(totalItems), change: "+0%" },
          totalOrders: { value: String(totalOrders), change: "+0%" },
          outOfStock: { value: String(outOfStock), change: "0" },
          revenue: { value: `$${revenueNumber.toFixed(2)}`, change: "+0%" },
        },
        recentActivities,
        topProducts,
      };

      setDashboardData((prev) => ({
        ...prev,
        overview,
        products: productsUi,
        categories: categoriesUi,
        collections: categoriesUi, // reuse categories for Collections tab
        orders: ordersUi,
        users: usersRaw,
      }));
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ===== Products CRUD =====
  const handleAddProduct = async (productPayload: any) => {
    await createProduct(productPayload); // [file:12]
    await loadAll();
  };

  const handleEditProduct = async (id: number, payload?: any) => {
    // payload includes id + full fields from ProductForm, we send update to PUT /products/{id} [file:12]
    if (!payload) return;
    const { id: _ignore, ...update } = payload;
    await updateProduct(id, update); // [file:12]
    await loadAll();
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id); // [file:12]
    await loadAll();
  };

  // ===== Categories as "Collections" =====
  const handleAddCollection = async () => {
    const name = prompt("New category name?");
    if (!name) return;
    const description = prompt("Category description? (optional)") || "";
    await createCategory({ name, description }); // [file:12]
    await loadAll();
  };

  const handleEditCollection = async (id: number) => {
    alert(
      "Edit category not implemented yet (product-service README doesn’t list PUT /categories/{id})."
    ); // [file:12]
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id); // [file:12]
    await loadAll();
  };

  const handleViewOrder = async (_id: string) => {
    // Handled inline by the Orders component panel
  };

  const handleOrderStatusUpdate = (id: string, newStatus: string) => {
    setDashboardData((prev) => ({
      ...prev,
      orders: prev.orders.map((o: any) =>
        String(o.id) === id ? { ...o, status: newStatus } : o
      ),
    }));
  };

  const categoriesForForm = useMemo(
    () => dashboardData.categories.map((c) => ({ id: c.id, name: c.name })),
    [dashboardData.categories]
  );

  const handleUpdateUserRole = async (id: string, role: "customer" | "admin") => {
    try {
      await updateUserRole(id, role);
      await loadAll(); // refresh
      toast.success("User role updated successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update user role");
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      await loadAll(); // refresh
      toast.success("User deleted successfully");
    } catch (e: any) {
      console.error(e);
      const errorMessage = e?.message || "Failed to delete user";
      if (errorMessage.includes("Cannot delete your own account")) {
        toast.error("You cannot delete your own account!");
      } else {
        toast.error("Failed to delete user. Please try again.");
      }
    }
  }

  return (
    <div>
      {loading && <div className="p-4 text-sm text-gray-500">Loading…</div>}
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      <AdminDashboard
        overviewData={dashboardData.overview}
        productsData={dashboardData.products}
        categoriesData={categoriesForForm}
        collectionsData={dashboardData.collections}
        ordersData={dashboardData.orders}
        usersData={dashboardData.users}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddCollection={handleAddCollection}
        onEditCollection={handleEditCollection}
        onDeleteCollection={handleDeleteCollection}
        onViewOrder={handleViewOrder}
        onUpdateUserRole={handleUpdateUserRole}
        onDeleteUser={handleDeleteUser}
        onOrderStatusUpdate={handleOrderStatusUpdate}
      />
    </div>
  );
}
