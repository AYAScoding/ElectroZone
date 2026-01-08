import { NextResponse } from "next/server";

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${ORDER_SERVICE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Proxy POST /api/orders failed" },
      { status: 500 }
    );
  }
}
