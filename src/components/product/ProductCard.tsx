import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import productPlaceholder from "@/assets/product-1.jpg";
import { useState } from "react";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Determine image source - Robust check
  let primaryImage = productPlaceholder;
  let secondaryImage = null; // For hover effect

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    primaryImage = typeof firstImg === 'string' ? firstImg : (firstImg.url || productPlaceholder);

    // Check for a second image for hover effect
    if (product.images.length > 1) {
      const secondImg = product.images[1];
      secondaryImage = typeof secondImg === 'string' ? secondImg : secondImg.url;
    }
  } else if (product.image) {
    primaryImage = product.image;
  }

  // Determine stock status
  const actualInStock = product.stock !== undefined ? product.stock > 0 : (product.inStock ?? true);
  const isOutOfStock = !actualInStock;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const displayBadge = isOutOfStock ? "soldout" : product.badge;

  return (
    <article
      className={cn("group product-card relative flex flex-col gap-3", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block relative">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted/20">
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 ease-out",
              isHovered && secondaryImage ? "opacity-0" : "opacity-100",
              isHovered && !secondaryImage ? "scale-105" : "scale-100" // Zoom if no swap
            )}
            loading="lazy"
          />

          {/* Secondary Image (Hover Swap) */}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              )}
              loading="lazy"
            />
          )}

          {/* Badge (Top Left) */}
          {displayBadge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant={displayBadge} className="shadow-sm backdrop-blur-[2px] bg-white/90 text-foreground border-white/20">
                {displayBadge === "sale" && `${discount}% OFF`}
                {displayBadge === "new" && "New Arrival"}
                {displayBadge === "soldout" && "Sold Out"}
                {displayBadge === "bestseller" && "Best Seller"}
              </Badge>
            </div>
          )}

          {/* Floating Actions Overlay */}

          {/* Wishlist (Top Right - Visible on Hover) */}
          <button
            className={cn(
              "absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white hover:scale-110",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 lg:opacity-0" // Always hidden on mobile until tap? Usually keep hover logic for desktop
            )}
            onClick={(e) => {
              e.preventDefault();
              // Wishlist logic
            }}
          >
            <Heart className="h-4 w-4 text-foreground/80" />
          </button>

          {/* Quick Add (Bottom - Slide Up) */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-transform duration-300 z-10",
            isHovered ? "translate-y-0" : "translate-y-full"
          )}>
            <Button
              variant="cart"
              size="sm"
              className="w-full shadow-md font-medium"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
            >
              {isOutOfStock ? "Habis" : "Pilih Varian"}
            </Button>
          </div>
        </div>
      </Link>

      {/* Minimal Product Info */}
      <div className="space-y-1 px-1">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-serif text-[15px] leading-tight text-foreground/90 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-sm font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>


        {/* Colors (Optional: Only show if > 1) */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full border border-black/10 shadow-[0_0_0_1px_rgba(255,255,255,1)]", // Subtle ring
                )}
                style={{ backgroundColor: typeof color === 'string' ? color : color.hex }}
                title={typeof color === 'string' ? color : color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground self-center">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </article>
  );
}
