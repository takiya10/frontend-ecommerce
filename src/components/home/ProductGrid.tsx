import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard, Product } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

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
];

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
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

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
        <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="animate-fade-in"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
