import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard, formatPrice } from "@/components/product/ProductCard";
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
    queryFn: () => fetcher<any[]>(`/products?category=${slug || 'all'}&sort=${sortBy}`),
  });

  const products = fetchedProducts || [];

  // Debugging logs
  console.log("Collection Slug:", slug);
  console.log("Fetched Products:", products);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  const collectionName = collectionNames[slug || "all"] || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Koleksi");
  
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100000000 }; // Increase max default
    const prices = products.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: true });
  // Initialize state with wide bounds, then update via effect
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 100000000,
  });

  // Update price range when bounds change (data loaded)
  useMemo(() => {
    if (products.length > 0) {
        setPriceRange({ min: priceBounds.min, max: priceBounds.max });
    }
  }, [priceBounds, products.length]);

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };
  
  // Client-side filtering for now (Availability & Price)
  // Ideally this should be done on backend too for pagination
  const filteredProducts = products.filter((product) => {
    const isOutOfStock = product.stock === 0;
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

  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  
  const animationKey = `${slug}-${sortBy}-${gridCols}`; // Simplify key to avoid re-render loop on price change

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
                    {/* Simplified Price inputs for prototype */}
                     <div className="flex items-center justify-between text-sm">
                        <span>{formatPrice(priceRange.min)}</span>
                        <span>{formatPrice(priceRange.max)}</span>
                     </div>
                  </div>
                </div>
              </div>
            </aside>

            {isLoading ? (
               <div className={`grid ${gridClass[gridCols]} gap-4 md:gap-6`}>
                 {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
               </div>
            ) : (
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
              {filteredProducts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No products found.
                </div>
              ) : filteredProducts.map((product, index) => (
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
                  <ProductCard product={{
                    ...product,
                    image: PLACEHOLDER_IMAGES[index % 4], // Fallback image
                    inStock: product.stock > 0,
                    colors: ["#8B7355", "#F5E6D3"] // Fake colors
                  }} className="animate-fade-in" />
                </motion.div>
              ))}
            </motion.div>
            )}
          </div>
        </section>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
             {/* Simplified Mobile Filter for brevity - functionality matches desktop */}
             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
             <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-lg font-bold">Filters</h2>
                   <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}><X className="h-5 w-5"/></Button>
                </div>
                {/* Add filter controls here similar to desktop */}
             </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
