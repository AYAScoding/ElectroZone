import { NextResponse } from "next/server";

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const upstream = await fetch(`${ORDER_SERVICE_URL}/api/orders/${id}/pay`, {
      method: "POST",
      cache: "no-store",
    });

    const text = await upstream.text();

    // Spring returns a raw string client secret (not an object) [file:78]
    // Normalize to JSON so frontend can always do res.json().
    if (!upstream.ok) {
      return NextResponse.json(
        { message: text || "Payment failed" },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ clientSecret: text }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Proxy POST /api/orders/[id]/pay failed" },
      { status: 500 }
    );
  }
}
