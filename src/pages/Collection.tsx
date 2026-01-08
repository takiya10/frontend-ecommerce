import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard, Product, formatPrice } from "@/components/product/ProductCard";
import { motion } from "framer-motion";
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
    inStock: true,
    colors: ["#8B7355", "#F5E6D3", "#C4A77D"],
  },
  {
    id: "2",
    name: "Sage Piping Dress with Belt",
    slug: "sage-piping-dress",
    price: 389000,
    image: product2,
    badge: "new",
    inStock: true,
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
    inStock: false,
    colors: ["#D4A5A5", "#8B7355", "#F5E6D3"],
  },
  {
    id: "4",
    name: "Embroidered Cream Elegant Dress",
    slug: "embroidered-cream-elegant-dress",
    price: 549000,
    image: product4,
    inStock: true,
    colors: ["#F5E6D3", "#E8D5C4"],
  },
  {
    id: "5",
    name: "Classic Taupe Abaya Set",
    slug: "classic-taupe-abaya-set",
    price: 479000,
    image: product1,
    badge: "new",
    inStock: true,
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
    inStock: false,
    colors: ["#8B9A6B"],
  },
  {
    id: "7",
    name: "Blush Pink Prayer Set",
    slug: "blush-pink-prayer-set",
    price: 359000,
    image: product3,
    inStock: true,
    colors: ["#D4A5A5", "#F5E6D3"],
  },
  {
    id: "8",
    name: "Ivory Lace Detail Dress",
    slug: "ivory-lace-detail-dress",
    price: 599000,
    image: product4,
    badge: "bestseller",
    inStock: false,
    colors: ["#F5E6D3"],
  },
];

const collectionNames: Record<string, string> = {
  "best-seller": "Best Seller",
  "best-seller-hijab": "Best Seller Hijab",
  "best-seller-outfit": "Best Seller Outfit",
  "best-seller-syari": "Best Seller Syari",
  "new-arrival": "New Arrival",
  "ramadan-2026": "Ramadan 2026",
  hijab: "Hijab",
  "paris-series": "Paris Series",
  "voal-series": "Voal Series",
  "rayon-series": "Rayon Series",
  "viscose-series": "Viscose Series",
  "tencel-series": "Tencel Series",
  "silk-series": "Silk Series",
  "jersey-series": "Jersey Series",
  "ceruty-series": "Ceruty Series",
  syari: "Syari",
  collaboration: "Collaboration",
  "byher-x-cut-syifa": "Byher x Cut Syifa",
  "byher-x-hamidah": "Byher x Hamidah",
  "byher-x-lesti-kejora": "Byher x Lesti Kejora",
  "byher-x-bianca": "Byher x Bianca",
  "byher-x-julia": "Byher x Julia",
  "byher-x-heidy": "Byher x Heidy",
  "byher-x-shadeera": "Byher x Shadeera",
  "byher-x-nashwa": "Byher x Nashwa",
  "byher-x-antik": "Byher x Antik",
  "byher-x-nadzira-shafa": "Byher x Nadzira Shafa",
  "byher-x-yure-zalina": "Byher x Yure Zalina",
  "byher-x-sindy-mutmaina": "Byher x Sindy Mutmaina",
  "byher-x-vebby": "Byher x Vebby",
  outfit: "Outfit",
  "prayer-set": "Prayer Set",
  accessories: "Accessories",
  "clearance-sale": "Clearance Sale",
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
  const priceBounds = useMemo(() => {
    const prices = products.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, []);
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: true });
  const [priceRange, setPriceRange] = useState({
    min: priceBounds.min,
    max: priceBounds.max,
  });

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };
  const inStockCount = products.filter((product) => product.inStock !== false).length;
  const outOfStockCount = products.filter((product) => product.inStock === false).length;
  const animationKey = `${availability.inStock}-${availability.outOfStock}-${priceRange.min}-${priceRange.max}-${gridCols}`;
  const filteredProducts = products.filter((product) => {
    const isOutOfStock = product.inStock === false;
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }
    if (availability.inStock && availability.outOfStock) {
      return true;
    }
    if (availability.inStock) {
      return !isOutOfStock;
    }
    if (availability.outOfStock) {
      return isOutOfStock;
    }
    return true;
  });

  const handleMinPrice = (value: number) => {
    setPriceRange((prev) => ({
      min: Math.min(value, prev.max),
      max: prev.max,
    }));
  };

  const handleMaxPrice = (value: number) => {
    setPriceRange((prev) => ({
      min: prev.min,
      max: Math.max(value, prev.min),
    }));
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-background p-5">
                <div>
                  <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    Availability
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={availability.inStock}
                        onChange={(event) =>
                          setAvailability((prev) => ({ ...prev, inStock: event.target.checked }))
                        }
                      />
                      In Stock ({inStockCount})
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={availability.outOfStock}
                        onChange={(event) =>
                          setAvailability((prev) => ({ ...prev, outOfStock: event.target.checked }))
                        }
                      />
                      Out of Stock ({outOfStockCount})
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    Price
                  </p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={priceRange.min}
                        min={priceBounds.min}
                        max={priceRange.max}
                        onChange={(event) => handleMinPrice(Number(event.target.value))}
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={priceRange.max}
                        min={priceRange.min}
                        max={priceBounds.max}
                        onChange={(event) => handleMaxPrice(Number(event.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange.min}
                        onChange={(event) => handleMinPrice(Number(event.target.value))}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange.max}
                        onChange={(event) => handleMaxPrice(Number(event.target.value))}
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <motion.div
              key={animationKey}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className={`grid ${gridClass[gridCols]} gap-4 md:gap-6`}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <ProductCard product={product} className="animate-fade-in" />
                </motion.div>
              ))}
            </motion.div>
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
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-medium">Availability</p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={availability.inStock}
                        onChange={(event) =>
                          setAvailability((prev) => ({ ...prev, inStock: event.target.checked }))
                        }
                      />
                      In Stock ({inStockCount})
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={availability.outOfStock}
                        onChange={(event) =>
                          setAvailability((prev) => ({ ...prev, outOfStock: event.target.checked }))
                        }
                      />
                      Out of Stock ({outOfStockCount})
                    </label>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Price</p>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={priceRange.min}
                        min={priceBounds.min}
                        max={priceRange.max}
                        onChange={(event) => handleMinPrice(Number(event.target.value))}
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={priceRange.max}
                        min={priceRange.min}
                        max={priceBounds.max}
                        onChange={(event) => handleMaxPrice(Number(event.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange.min}
                        onChange={(event) => handleMinPrice(Number(event.target.value))}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min={priceBounds.min}
                        max={priceBounds.max}
                        value={priceRange.max}
                        onChange={(event) => handleMaxPrice(Number(event.target.value))}
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
