"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/types";

type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  brand: string;
  category_id: number;
  specifications: Record<string, any> | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
};

function toPublicImageUrl(url: string | null | undefined) {
  if (!url) return "/placeholder.svg";

  // If it's a localhost URL pointing to a different port (like 3000), 
  // we strip the origin and try to use it as a relative path.
  if (url.includes("localhost:3000") || url.includes("127.0.0.1:3000")) {
    const parts = url.split(":3000");
    if (parts.length > 1) {
      return parts[1].startsWith("/") ? parts[1] : `/${parts[1]}`;
    }
  }

  // If backend returns an absolute URL (e.g. from cloud storage), keep it.
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // Otherwise treat it as a path to Next.js public/ (must start with /).
  return url.startsWith("/") ? url : `/${url}`;
}

function flattenSpecs(
  specs: Record<string, any> | null | undefined
): Record<string, string> {
  if (!specs) return {};
  // Your backend examples sometimes look like:
  // { "additionalProp1": { ... } }
  const maybeNested = (specs as any).additionalProp1;
  const src =
    maybeNested && typeof maybeNested === "object" ? maybeNested : specs;

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(src)) {
    if (v === null || v === undefined) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}

function mapApiToUiProduct(api: ApiProduct): Product {
  const mainImage = toPublicImageUrl(api.image_url);

  const specs = flattenSpecs(api.specifications);

  return {
    // Keep your UI happy even if backend doesn't provide these fields
    id: String(api.id),
    name: api.name,
    description: api.description,
    price: api.price,
    brand: api.brand,

    // These are UI-specific fields in your current page:
    image: mainImage,
    images: [mainImage], // you can extend this later if backend supports multiple images
    category: String(api.category_id),
    specs,
    warranty: "Manufacturer warranty",

    // Your UI expects these:
    inStock: api.stock_quantity > 0,
    rating: 4.5,
    reviews: 0,
    originalPrice: undefined,
  } as unknown as Product;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id;
      if (!id) return;

      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_API;
        if (!baseUrl) {
          throw new Error(
            "NEXT_PUBLIC_PRODUCT_API is missing. Add it to .env.local"
          );
        }

        const res = await fetch(`${baseUrl}/products/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch product. Status: ${res.status}`);
        }

        const data: ApiProduct = await res.json();
        setProduct(mapApiToUiProduct(data));
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Could not load product</h1>
            <p className="text-muted-foreground mb-4">
              Check that your API is running and that{" "}
              <code className="bg-muted px-2 py-1 rounded">
                NEXT_PUBLIC_API_URL
              </code>{" "}
              is set.
            </p>
            <Button onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const mockReviews = [
    {
      id: "1",
      userName: "John D.",
      rating: 5,
      comment:
        "Absolutely love this product! Exceeded my expectations in every way.",
      date: "2 weeks ago",
    },
    {
      id: "2",
      userName: "Sarah M.",
      rating: 4,
      comment: "Great quality and fast shipping. Would definitely recommend.",
      date: "1 month ago",
    },
    {
      id: "3",
      userName: "Mike R.",
      rating: 5,
      comment: "Best purchase I've made this year. Worth every penny!",
      date: "1 month ago",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Product Details */}
          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={
                    product.images?.[selectedImage] ||
                    product.image ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.originalPrice && (
                  <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {(product.images || [product.image]).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.brand}
                </p>
                <h1 className="text-3xl font-bold mb-4 text-balance">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  {product.inStock ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      In Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-600"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={!product.inStock}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">
                      On orders over $50
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.warranty}</p>
                    <p className="text-xs text-muted-foreground">
                      Manufacturer warranty
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">30-Day Returns</p>
                    <p className="text-xs text-muted-foreground">
                      Easy return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="specs" className="mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Technical Specifications
                  </h3>
                  <div className="grid gap-4">
                    {Object.entries(product.specs || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b last:border-0"
                      >
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>

                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {review.userName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-muted text-muted"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
