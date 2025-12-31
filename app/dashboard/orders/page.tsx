"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/contexts/auth-context";
import { Package, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082"; // [file:2]

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login?redirect=/dashboard/orders");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch(
          `${ORDER_SERVICE_URL}/api/orders/user/${user.id}`
        );
        if (!res.ok) {
          setOrders([]);
          return;
        }
        setOrders(await res.json());
      } finally {
        setLoadingOrders(false);
      }
    };

    load();
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold mb-8">Order History</h1>

          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>View and track your purchases</CardDescription>
            </CardHeader>

            <CardContent>
              {loadingOrders ? (
                <div className="py-12 text-center text-muted-foreground">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No orders yet</p>
                  <p className="text-sm mb-4">
                    Start shopping to see your orders here
                  </p>
                  <Button asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">Order #{o.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              o.orderDate || Date.now()
                            ).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${Number(o.totalAmount ?? 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {o.status} · {o.paymentStatus}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="text-sm text-muted-foreground">
                        Product: {String(o.productId)} · Qty:{" "}
                        {String(o.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
