import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard, Product } from "@/components/product/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products: Product[] = [
  {
    id: "1",
    name: "Floure Embroidery Set Dessert Taupe L-XL Series",
    slug: "floure-embroidery-set-dessert-taupe",
    price: 429000,
    originalPrice: 459000,
    image: product1,
    badge: "sale",
    colors: ["#8B7355", "#F5E6D3", "#C4A77D"],
  },
  {
    id: "2",
    name: "Sage Piping Dress with Belt",
    slug: "sage-piping-dress",
    price: 389000,
    image: product2,
    badge: "new",
    colors: ["#8B9A6B", "#C4A77D", "#2F2F2F"],
  },
  {
    id: "3",
    name: "Dusty Rose Modest Set",
    slug: "dusty-rose-modest-set",
    price: 419000,
    originalPrice: 439000,
    image: product3,
    badge: "bestseller",
    colors: ["#D4A5A5", "#8B7355", "#F5E6D3"],
  },
  {
    id: "4",
    name: "Embroidered Cream Elegant Dress",
    slug: "embroidered-cream-elegant-dress",
    price: 549000,
    image: product4,
    colors: ["#F5E6D3", "#E8D5C4"],
  },
  {
    id: "5",
    name: "Classic Taupe Abaya Set",
    slug: "classic-taupe-abaya-set",
    price: 479000,
    image: product1,
    badge: "new",
    colors: ["#8B7355", "#2F2F2F"],
  },
  {
    id: "6",
    name: "Olive Premium Dress",
    slug: "olive-premium-dress",
    price: 399000,
    originalPrice: 449000,
    image: product2,
    badge: "sale",
    colors: ["#8B9A6B"],
  },
  {
    id: "7",
    name: "Blush Pink Prayer Set",
    slug: "blush-pink-prayer-set",
    price: 359000,
    image: product3,
    colors: ["#D4A5A5", "#F5E6D3"],
  },
  {
    id: "8",
    name: "Ivory Lace Detail Dress",
    slug: "ivory-lace-detail-dress",
    price: 599000,
    image: product4,
    badge: "bestseller",
    colors: ["#F5E6D3"],
  },
];

const collectionNames: Record<string, string> = {
  "best-seller": "Best Seller",
  "new-arrival": "New Arrival",
  hijab: "Hijab",
  outfit: "Outfit",
  "prayer-set": "Prayer Set",
  accessories: "Accessories",
  sale: "Sale",
  all: "Semua Produk",
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
  { value: "bestselling", label: "Terlaris" },
];

export default function Collection() {
  const { slug } = useParams();
  const collectionName = collectionNames[slug || "all"] || "Koleksi";
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
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
          <p className="text-muted-foreground">{products.length} produk</p>
        </header>

        {/* Toolbar */}
        <div className="container mx-auto pb-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGridCols(2)}
                className={cn(gridCols === 2 && "bg-accent")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGridCols(3)}
                className={cn(gridCols === 3 && "bg-accent")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGridCols(4)}
                className={cn(gridCols === 4 && "bg-accent")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

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
          <div className={`grid ${gridClass[gridCols]} gap-4 md:gap-6`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="animate-fade-in"
              />
            ))}
          </div>
        </section>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <>
            <div
              className="fixed inset-0 bg-foreground/50 z-50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background z-50 lg:hidden p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">Filter</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                Filter options coming soon...
              </p>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
