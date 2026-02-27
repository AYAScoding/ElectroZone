"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/contexts/auth-context";
import { Package, ChevronLeft } from "lucide-react";

type OrderDto = {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderDate?: string;
};

type ProductDto = {
  id: number;
  name: string;
  price: number;
  image_url?: string | null;
};

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082";

const PRODUCT_SERVICE_URL = (
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000"
).replace(/\/$/, "");

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [productsById, setProductsById] = useState<Record<number, ProductDto>>(
    {}
  );
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login?redirect=/dashboard/orders");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoadingOrders(true);
      try {
        // 1) Load orders
        const ordersRes = await fetch(
          `/api/orders/user/${user.id}`,
          { cache: "no-store" }
        );
        if (!ordersRes.ok) {
          setOrders([]);
          setProductsById({});
          return;
        }
        const loadedOrders: OrderDto[] = await ordersRes.json();
        setOrders(loadedOrders);

        // 2) Load products once, then index by id
        const productsRes = await fetch(`${PRODUCT_SERVICE_URL}/products/`, {
          cache: "no-store",
        });
        if (!productsRes.ok) {
          setProductsById({});
          return;
        }
        const products: ProductDto[] = await productsRes.json();
        const map: Record<number, ProductDto> = {};
        for (const p of products) map[p.id] = p;
        setProductsById(map);
      } finally {
        setLoadingOrders(false);
      }
    };

    load();
  }, [user]);

  const ordersWithProduct = useMemo(() => {
    return orders.map((o) => ({
      order: o,
      product: productsById[o.productId],
    }));
  }, [orders, productsById]);

  if (isLoading || !user) return null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">
          View and track your purchases
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>View and track your purchases</CardDescription>
          </CardHeader>

          <CardContent>
            {loadingOrders ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading orders...
              </div>
            ) : ordersWithProduct.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
                </p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {ordersWithProduct.map(({ order: o, product }) => (
                  <div key={o.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex gap-4">
                        {product?.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-16 w-16 rounded object-cover border"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded border bg-muted" />
                        )}

                        <div>
                          <div className="text-sm text-muted-foreground">
                            {new Intl.DateTimeFormat("en-EN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                              timeZone: "Europe/Istanbul",
                            }).format(new Date(o.orderDate || Date.now()))}
                          </div>

                          <div className="mt-2 text-sm">
                            <div className="font-medium">
                              {product
                                ? product.name
                                : `Product #${o.productId}`}
                            </div>
                            <div className="text-muted-foreground">
                              Qty: {o.quantity}
                              {product
                                ? ` · Unit: ${formatMoney(product.price)}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatMoney(Number(o.totalAmount ?? 0))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Order: {o.status} · Payment: {o.paymentStatus}
                        </div>
                      </div>
                    </div>

                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
