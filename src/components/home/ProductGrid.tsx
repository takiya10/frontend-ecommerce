import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { cubicBezier, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";

// Fallback images (since backend doesn't serve images yet)
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const PLACEHOLDER_IMAGES = [product1, product2, product3, product4];

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  title,
  subtitle,
  showViewAll = true,
  viewAllHref = "/collections/all",
  columns = 4,
}: ProductGridProps) {
  // Determine query based on viewAllHref
  const collectionSlug = viewAllHref.split('/').pop() || 'all';
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'grid', collectionSlug],
    queryFn: () => fetcher<Product[]>(`/products?category=${collectionSlug}&sort=${collectionSlug === 'new-arrival' ? 'newest' : 'featured'}`),
  });

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
  };

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
          </div>
        </div>
      </section>
    );
  }

  const displayProducts = products?.slice(0, 4) || [];

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              {subtitle && (
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  {title}
                </h2>
              )}
            </div>
            {showViewAll && (
              <Link to={viewAllHref}>
                <Button variant="ghost" className="group">
                  Lihat Semua
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        <motion.div
          className={`grid ${gridCols[columns]} gap-4 md:gap-6`}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          {displayProducts.map((product, index) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={{
                ...product,
                image: PLACEHOLDER_IMAGES[index % 4], // Fallback image
                originalPrice: product.price * 1.1, // Fake original price for demo
                inStock: product.stock > 0,
                colors: [
                  { name: "Dessert Taupe", hex: "#8B7355" }, 
                  { name: "Cream", hex: "#F5E6D3" }
                ] // Correct ProductColor format
              }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
