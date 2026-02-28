"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/types";

type ApiProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  brand?: string;
  category_id?: number;
  image_url?: string | null;
};

type ApiCategory = {
  id: number;
  name: string;
  description?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_PRODUCT_API;

function toPublicImageUrl(url: string | null | undefined) {
  if (!url) return "/placeholder.svg";

  // If it's a localhost URL pointing to a different port (like 3000), 
  // we strip the origin and try to use it as a relative path if it looks like a local file.
  if (url.includes("localhost:3000") || url.includes("127.0.0.1:3000")) {
    const parts = url.split(":3000");
    if (parts.length > 1) {
      return parts[1].startsWith("/") ? parts[1] : `/${parts[1]}`;
    }
  }

  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.includes(":\\") || url.includes("\\public\\"))
    return "/placeholder.svg";
  return url.startsWith("/") ? url : `/${url}`;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category"); // can be a category name like "Laptops"

  const [products, setProducts] = useState<Product[]>([]);

  // CHANGED: keep categories with id + name
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // CHANGED: store selected categories as category IDs (string)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [sortBy, setSortBy] = useState<string>("featured");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CHANGED: if URL has ?category=Laptops, convert it to an ID once categories are loaded
  useEffect(() => {
    if (!categoryParam || categories.length === 0) return;
    const match = categories.find(
      (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
    );
    if (match) setSelectedCategoryIds([String(match.id)]);
  }, [categoryParam, categories]);

  useEffect(() => {
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_PRODUCT_API in electrozone/.env.local");
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products?skip=0&limit=200`);
        if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
        const data: ApiProduct[] = await res.json();

        const mapped = data.map((p) => {
          const img = toPublicImageUrl(p.image_url);
          return {
            id: String(p.id),
            name: p.name,
            description: p.description ?? "",
            price: p.price,
            image: img,
            brand: p.brand ?? "",
            // Keep category_id as string so filtering works
            category: p.category_id ? String(p.category_id) : "",
            rating: 4.5,
          };
        }) as unknown as Product[];

        setProducts(mapped);

        const brandSet = new Set<string>();
        for (const p of data) if (p.brand) brandSet.add(p.brand);
        setBrands(Array.from(brandSet).sort());
      } catch (e: any) {
        setError(e?.message ?? "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!API_BASE) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories?skip=0&limit=200`);
        if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
        const data: ApiCategory[] = await res.json();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // CHANGED: toggle category by id
  const toggleCategoryId = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategoryIds([]);
    setSelectedBrands([]);
    setPriceRange([0, 3000]);
  };

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (selectedBrands.length)
      list = list.filter((p: any) => selectedBrands.includes(p.brand));

    // CHANGED: filter by category_id string
    if (selectedCategoryIds.length)
      list = list.filter((p: any) => selectedCategoryIds.includes(p.category));

    list = list.filter(
      (p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sortBy === "price-low")
      list.sort((a: any, b: any) => a.price - b.price);
    if (sortBy === "price-high")
      list.sort((a: any, b: any) => b.price - a.price);

    return list;
  }, [products, selectedBrands, selectedCategoryIds, priceRange, sortBy]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map((c) => {
              const idStr = String(c.id);
              return (
                <div key={c.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${c.id}`}
                    checked={selectedCategoryIds.includes(idStr)}
                    onCheckedChange={() => toggleCategoryId(idStr)}
                  />
                  <Label
                    htmlFor={`category-${c.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {c.name}
                  </Label>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No categories loaded
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No brands loaded</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={3000}
            step={50}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {categoryParam ? `${categoryParam}` : "All Products"}
            </h1>
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                <FilterContent />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden bg-transparent"
                    >
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Sort by:
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading && (
                <p className="text-sm text-muted-foreground">
                  Loading products…
                </p>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProducts.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="border rounded-lg overflow-hidden hover:bg-muted/30"
                    >
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <div className="font-semibold line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {p.description}
                        </div>
                        <div className="mt-2 font-medium">${p.price}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.brand}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {visibleProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No products match your filters.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
