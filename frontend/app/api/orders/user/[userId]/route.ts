import { NextRequest, NextResponse } from "next/server";

const ORDER_SERVICE_URL =
    process.env.ORDER_SERVICE_URL || process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:8082";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    const { userId } = await context.params;
    try {
        const upstream = await fetch(
            `${ORDER_SERVICE_URL}/api/orders/user/${userId}`,
            { cache: "no-store" }
        );
        const text = await upstream.text();
        return new NextResponse(text, {
            status: upstream.status,
            headers: {
                "Content-Type": upstream.headers.get("content-type") ?? "application/json",
            },
        });
    } catch (e: any) {
        return NextResponse.json(
            { message: e?.message ?? `Proxy GET /api/orders/user/${userId} failed` },
            { status: 500 }
        );
    }
}
