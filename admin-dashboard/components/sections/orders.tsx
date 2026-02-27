"use client";

import { useState } from "react";
import { Eye, X, Package, User, CreditCard, MapPin, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, ORDER_STATUSES } from "@/lib/order-api";

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
  // extra fields passed from page.tsx (raw order data)
  raw?: {
    userId: string;
    productId: string | number;
    quantity: number;
    paymentStatus: string;
    paymentMethod: string;
    shippingAddress: string;
  };
}

interface OrdersProps {
  orders?: Order[];
  onViewOrder?: (id: string) => void;
  onStatusUpdate?: (id: string, newStatus: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  SHIPPED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status.toUpperCase()] ?? STATUS_COLORS.PENDING;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${cls}`}>
      {STATUS_LABELS[status.toUpperCase()] ?? status}
    </span>
  );
}

export default function Orders({ orders = [], onStatusUpdate }: OrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setStatusError(null);
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      // Optimistically update local state
      const updated = { ...selectedOrder, status: newStatus };
      setSelectedOrder(updated);
      onStatusUpdate?.(selectedOrder.id, newStatus);
    } catch (e: any) {
      setStatusError("Failed to update status: " + e.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["Order ID", "Customer", "Amount", "Status", "Date", "Action"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-foreground/70">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                  <td className="px-6 py-4 text-sm"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => { setSelectedOrder(order); setStatusError(null); }}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 gap-2"
                    >
                      <Eye size={16} />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Slide-in detail panel ─── */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSelectedOrder(null)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col border-l border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-foreground">Order #{selectedOrder.id}</h2>
                <p className="text-sm text-muted-foreground">{selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <User size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Customer</p>
                  <p className="text-sm font-semibold text-foreground">{selectedOrder.customer}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CreditCard size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Order Total</p>
                  <p className="text-lg font-bold text-foreground">{selectedOrder.amount}</p>
                </div>
              </div>

              {/* Product & Quantity */}
              {selectedOrder.raw && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Package size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Product</p>
                      <p className="text-sm font-semibold text-foreground">Product #{selectedOrder.raw.productId}</p>
                      <p className="text-xs text-muted-foreground">Qty: {selectedOrder.raw.quantity}</p>
                      streams                    </div>
                  </div>

                  {selectedOrder.raw.shippingAddress && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <MapPin size={18} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Shipping Address</p>
                        <p className="text-sm font-semibold text-foreground">{selectedOrder.raw.shippingAddress}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Hash size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Payment</p>
                      <p className="text-sm font-semibold text-foreground capitalize">{selectedOrder.raw.paymentMethod || "—"}</p>
                      <p className="text-xs text-muted-foreground">Status: {selectedOrder.raw.paymentStatus || "—"}</p>
                    </div>
                  </div>
                </>
              )}

              {/* ── Status Change ── */}
              <div className="rounded-xl border border-border p-4 bg-muted/50 space-y-3">
                <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Update Order Status</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedOrder.status} />
                  <span className="text-gray-400 dark:text-gray-500 text-xs">→</span>
                  <select
                    className="flex-1 text-sm rounded-lg border border-border bg-card text-foreground px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue=""
                    onChange={(e) => { if (e.target.value) handleStatusChange(e.target.value); e.target.value = ""; }}
                    disabled={updatingStatus}
                  >
                    <option value="">— Change to —</option>
                    {ORDER_STATUSES.filter((s) => s !== selectedOrder.status.toUpperCase()).map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                {updatingStatus && <p className="text-xs text-blue-500">Updating…</p>}
                {statusError && <p className="text-xs text-red-500">{statusError}</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
