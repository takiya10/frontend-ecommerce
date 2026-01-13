import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import productPlaceholder from "@/assets/product-1.jpg";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // Determine image source - Very robust check
  let displayImage = productPlaceholder;
  
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    displayImage = typeof firstImg === 'string' ? firstImg : (firstImg.url || productPlaceholder);
  } else if (product.image) {
    displayImage = product.image;
  }

  // Determine stock status
  const actualInStock = product.stock !== undefined ? product.stock > 0 : (product.inStock ?? true);
  const isOutOfStock = !actualInStock;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  
  const displayBadge = isOutOfStock ? "soldout" : product.badge;

  return (
    <article className={cn("group product-card", className)}>
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <img
            src={displayImage}
            alt={product.name}
            className="product-card-image w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Badge */}
          {displayBadge && (
            <div className="absolute top-3 left-3">
              <Badge variant={displayBadge}>
                {displayBadge === "sale" && `${discount}% OFF`}
                {displayBadge === "new" && "New"}
                {displayBadge === "soldout" && "Sold Out"}
                {displayBadge === "bestseller" && "Best Seller"}
              </Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist logic could go here or handled by parent
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              variant="cart"
              size="sm"
              className="w-full"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic could go here
              }}
            >
              {isOutOfStock ? "Habis" : "Tambah ke Keranjang"}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className={cn("text-xs font-medium", isOutOfStock ? "text-destructive" : "text-emerald-600")}>
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>
          
          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 pt-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: typeof color === 'string' ? color : color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}