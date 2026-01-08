import type { NextApiRequest, NextApiResponse } from "next";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:8082";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/user/${userId}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}
