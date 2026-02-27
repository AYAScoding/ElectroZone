import { NextRequest, NextResponse } from "next/server";

const ORDER_SERVICE_URL =
    process.env.ORDER_SERVICE_URL || "http://localhost:8082";

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await req.text();

    // The client sends JSON-encoded string e.g. '"SHIPPED"' — strip the quotes for Spring
    const raw = body.trim().replace(/^"|"$/g, "");

    try {
        const upstream = await fetch(
            `${ORDER_SERVICE_URL}/api/orders/${id}/status`,
            {
                method: "PUT",
                headers: { "Content-Type": "text/plain" },
                body: raw,
            }
        );

        const text = await upstream.text();
        return new NextResponse(text, {
            status: upstream.status,
            headers: {
                "Content-Type":
                    upstream.headers.get("content-type") ?? "application/json",
            },
        });
    } catch (e: any) {
        return NextResponse.json(
            { message: e?.message ?? `Proxy PUT /api/orders/${id}/status failed` },
            { status: 500 }
        );
    }
}
