import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Minus, Plus, Heart, Share2, Truck, RotateCcw, Shield, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductColor, ProductImage } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

const PLACEHOLDER_IMAGES = [product1, product2];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: fetchedProduct, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetcher<Product>(`/products/${slug}`),
    enabled: !!slug,
    retry: 1,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: () => fetcher<Product[]>(`/products/related/${slug}`),
    enabled: !!slug,
  });

  const product = useMemo<Product | null>(() => {
    if (!fetchedProduct) return null;

    // Extract unique colors from variants
    const colorVariants = fetchedProduct.variants?.filter(v => v.name.toLowerCase() === 'color') || [];
    const derivedColors = colorVariants.map(v => ({
      name: v.value,
      hex: v.hex || "#8B7355"
    }));

    // Extract unique sizes from variants
    const sizeVariants = fetchedProduct.variants?.filter(v => v.name.toLowerCase() === 'size') || [];
    const derivedSizes = Array.from(new Set(sizeVariants.map(v => v.value)));

    const normalizedImages: ProductImage[] = (fetchedProduct.images || []).map((img: ProductImage | string) => {
      if (typeof img === 'string') {
        return {
          id: Math.random().toString(),
          url: img,
          productId: fetchedProduct.id,
          color: null
        };
      }
      return {
        id: img.id,
        url: img.url,
        productId: img.productId || fetchedProduct.id,
        color: img.color || null
      };
    });

    return {
      ...fetchedProduct,
      images: normalizedImages,
      colors: derivedColors.length > 0 ? derivedColors : [{ name: "Default", hex: "#8B7355" }],
      sizes: derivedSizes.length > 0 ? derivedSizes : ["All Size"],
      originalPrice: (fetchedProduct.price || 0) * 1.1,
      badge: "new"
    } as Product;
  }, [fetchedProduct]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Auto-switch image when color is selected
  useEffect(() => {
    if (selectedColor && product?.images) {
      const colorImageIndex = product.images.findIndex(img =>
        img.color && img.color.trim().toLowerCase() === selectedColor.name.toLowerCase()
      );

      if (colorImageIndex !== -1) {
        setSelectedImage(colorImageIndex);
      }
    }
  }, [selectedColor, product]);

  // Reset local state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(null);
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product]);

  const discount = useMemo(() => {
    if (!product?.originalPrice || !product?.price) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }, [product?.price, product?.originalPrice]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: typeof product.images?.[0] === 'string' ? (product.images[0] as string) : (product.images?.[0] as unknown as ProductImage)?.url || PLACEHOLDER_IMAGES[0],
        inStock: (product.stock || 0) > 0,
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Silakan pilih ukuran terlebih dahulu");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: typeof product.images?.[0] === 'string' ? (product.images[0] as string) : (product.images?.[0] as unknown as ProductImage)?.url || PLACEHOLDER_IMAGES[0],
      size: selectedSize,
      color: selectedColor?.name || "Default",
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Silakan pilih ukuran terlebih dahulu");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: typeof product.images?.[0] === 'string' ? (product.images[0] as string) : (product.images?.[0] as unknown as ProductImage)?.url || PLACEHOLDER_IMAGES[0],
      size: selectedSize,
      color: selectedColor?.name || "Default",
      quantity: quantity
    });

    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto py-12 px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <div className="space-y-6 pt-8">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-24 text-center px-4">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-3xl font-serif text-foreground">Produk Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Maaf, produk yang Anda cari mungkin sudah tidak tersedia.</p>
            <Link to="/">
              <Button className="mt-4 px-8 rounded-full">Kembali ke Beranda</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in" key={slug}>
      <Header />

      <main className="flex-1">
        {/* Breadcrumb - Clean & Minimal */}
        <div className="border-b border-border/40">
          <nav className="container mx-auto py-4 px-6">
            <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <ChevronRight className="h-3 w-3" />
              <li>
                <Link to={`/collections/${product.category?.slug || 'all'}`} className="hover:text-primary transition-colors">
                  {product.category?.name || 'Koleksi'}
                </Link>
              </li>
              <ChevronRight className="h-3 w-3" />
              <li className="text-foreground truncate max-w-[150px]">{product.name}</li>
            </ol>
          </nav>
        </div>

        <section className="container mx-auto px-0 lg:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 pt-6 pb-20">

            {/* Sticky Images Section (Left, 7 Cols) */}
            <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24 lg:h-fit">
              <div className="relative overflow-hidden bg-muted/20 lg:rounded-2xl w-full">
                {/* Main Image with constrained height for "Balanced Look" */}
                {product.images && product.images[selectedImage] && (
                  <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[80vh] w-full">
                    <img
                      src={product.images[selectedImage].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Floating Badge */}
                {product.badge && (
                  <div className="absolute top-6 left-6">
                    <Badge className="backdrop-blur-md bg-white/80 text-foreground border-white/20 px-3 py-1 font-sans font-bold tracking-wider shadow-sm">
                      {product.badge === 'sale' ? `${discount}% OFF` : product.badge?.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto px-4 lg:px-0 pb-2 scrollbar-hide">
                {product.images?.map((img: ProductImage, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "shrink-0 w-20 h-24 lg:w-24 lg:h-32 rounded-lg overflow-hidden border-2 transition-all duration-300",
                      selectedImage === i
                        ? "border-primary opacity-100 ring-2 ring-primary/10"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section (Right, 5 Cols) */}
            <div className="lg:col-span-5 px-6 lg:px-0 pt-8 lg:pt-0 space-y-8">

              {/* Header Info */}
              <div className="space-y-4 border-b border-border/50 pb-6">
                <h1 className="font-serif text-4xl lg:text-5xl text-foreground font-medium leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-sans font-semibold text-foreground tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through decoration-zinc-400">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                  Color: <span className="text-foreground">{selectedColor?.name}</span>
                </span>
                <div className="flex gap-3">
                  {product.colors?.map((color: ProductColor) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border transition-all duration-300 relative",
                        selectedColor?.hex === color.hex
                          ? "ring-1 ring-offset-2 ring-foreground border-transparent"
                          : "border-border/50 hover:border-foreground/50"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Size</span>
                  <button className="text-xs underline text-muted-foreground hover:text-foreground transition-colors">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 rounded-lg border text-sm font-medium transition-all duration-200",
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background shadow-md"
                          : "border-border hover:border-foreground/50 bg-transparent text-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4">
                <div className="flex gap-4 p-4 border rounded-xl bg-muted/30">
                  <span className="text-sm font-medium text-muted-foreground self-center">Quantity</span>
                  <div className="flex items-center gap-4 ml-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="default"
                    size="xl"
                    className="flex-1 rounded-full text-base font-medium h-14"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang - " + formatPrice(product.price * quantity)}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-14 w-14 rounded-full border-border hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors",
                      inWishlist && "text-red-500 bg-red-50 border-red-200"
                    )}
                    onClick={handleToggleWishlist}
                  >
                    <Heart className={cn("h-6 w-6", inWishlist && "fill-current")} />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 text-center">
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-foreground" />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Free Shipping</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-foreground" />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Free Returns</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-foreground" />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Secure Pay</p>
                  </div>
                </div>
              </div>

              {/* Description Tabs style */}
              <div className="pt-8 border-t border-border">
                <div className="space-y-4">
                  <h3 className="font-serif text-xl border-l-4 border-primary pl-4">Product Details</h3>
                  <div className="prose prose-sm text-muted-foreground max-w-none leading-relaxed">
                    <p>{product.description || "No description available."}</p>

                    <ul className="list-disc pl-5 space-y-1 pt-4">
                      <li>Premium material quality</li>
                      <li>Designed for comfort and style</li>
                      <li>Authentic Byher design</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products - Modern Grid */}
        <section className="py-20 bg-muted/10 border-t border-border/20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                You May Also Like
              </h2>
              <Link to="/collections/all">
                <Button variant="link" className="text-foreground tracking-widest uppercase text-xs font-bold">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {relatedProducts?.slice(0, 4).map((item: Product) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ))}
              {(!relatedProducts || relatedProducts.length === 0) && (
                <p className="col-span-full text-muted-foreground text-center italic">No related products found.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
