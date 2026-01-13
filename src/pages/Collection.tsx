import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const PLACEHOLDER_IMAGES = [product1, product2, product3, product4];

const collectionNames: Record<string, string> = {
  // ... (keep existing names if needed or fetch from backend category name)
  all: "Semua Produk",
  outfit: "Outfit",
  hijab: "Hijab",
  accessories: "Accessories",
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
];

export default function Collection() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState("featured");
  
  // Fetch products from API
  const { data: fetchedProducts, isLoading, error } = useQuery({
    queryKey: ['products', slug, sortBy],
    queryFn: () => fetcher<Product[]>(`/products?category=${slug || 'all'}&sort=${sortBy}`),
  });

  const products = fetchedProducts || [];

  const collectionName = collectionNames[slug || "all"] || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Koleksi");
  
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-12 text-center text-red-500">
          Gagal memuat produk. Silakan coba lagi.
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1" key={slug || 'all'}>
        {/* Breadcrumb */}
        <nav className="container mx-auto py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-foreground">{collectionName}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="container mx-auto pb-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
            {collectionName}
          </h1>
          <p className="text-muted-foreground">{products.length} produk ditemukan untuk "{slug || 'all'}"</p>
        </header>

        {/* Toolbar */}
        <div className="container mx-auto pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className="container mx-auto pb-16">
          {isLoading ? (
             <div className={`grid ${gridClass[gridCols]} gap-4 md:gap-6`}>
               {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
             </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              className={`grid ${gridClass[gridCols]} gap-4 md:gap-6`}
            >
              {products.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground mb-4">Tidak ada produk ditemukan di koleksi ini.</p>
                  <Link to="/">
                    <Button variant="outline">Kembali Belanja</Button>
                  </Link>
                </div>
              ) : products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3 },
                    },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
