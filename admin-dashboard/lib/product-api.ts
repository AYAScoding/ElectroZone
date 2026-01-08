/* ===============================
   Product Service API
================================ */

const PRODUCT_SERVICE_URL =
  (process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000").replace(
    /\/$/,
    ""
  );

/* ===============================
   Types
================================ */

export type CategoryDto = {
  id: number;
  name: string;
  description?: string | null;
};

export type ProductCreate = {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  brand: string;
  category_id: number;
  specifications: Record<string, any>;
  image_url?: string | null;
};

export type ProductUpdate = Partial<ProductCreate>;

export type ProductDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  brand: string;
  category_id: number;
  specifications: Record<string, any>;
  image_url?: string | null;
  updated_at?: string;
};

/* ===============================
   Helpers
================================ */

async function readError(res: Response) {
  const text = await res.text().catch(() => "");
  return `${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`;
}

/* ===============================
   Categories
================================ */

export async function getCategories(): Promise<CategoryDto[]> {
  // NOTE: trailing slash matters for many FastAPI routes
  const res = await fetch(`${PRODUCT_SERVICE_URL}/categories/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GET /categories failed: ${await readError(res)}`);
  }

  return res.json();
}

export async function createCategory(payload: {
  name: string;
  description?: string;
}): Promise<CategoryDto> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/categories/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`POST /categories failed: ${await readError(res)}`);
  }

  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE /categories/${id} failed: ${await readError(res)}`);
  }
}

/* ===============================
   Products
================================ */

export async function getProducts(): Promise<ProductDto[]> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GET /products failed: ${await readError(res)}`);
  }

  return res.json();
}

export async function createProduct(payload: ProductCreate): Promise<ProductDto> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`POST /products failed: ${await readError(res)}`);
  }

  return res.json();
}

export async function updateProduct(
  id: number,
  payload: ProductUpdate
): Promise<ProductDto> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`PUT /products/${id} failed: ${await readError(res)}`);
  }

  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE /products/${id} failed: ${await readError(res)}`);
  }
}
