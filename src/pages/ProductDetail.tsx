import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Minus, Plus, Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
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
    
    const transformedImages = (fetchedProduct.images && Array.isArray(fetchedProduct.images) && fetchedProduct.images.length > 0)
      ? fetchedProduct.images.map((img: string | ProductImage) => typeof img === 'string' ? img : img.url).filter(Boolean)
      : PLACEHOLDER_IMAGES;

    return {
      ...fetchedProduct,
      images: transformedImages as unknown as ProductImage[], // Temporary cast to match Product interface
      colors: (fetchedProduct.colors && fetchedProduct.colors.length > 0)
         ? fetchedProduct.colors
         : [
            { name: "Default", hex: "#8B7355" },
            { name: "Cream", hex: "#F5E6D3" }
         ],
      sizes: (fetchedProduct.sizes && fetchedProduct.sizes.length > 0)
         ? fetchedProduct.sizes
         : ["S", "M", "L", "XL"],
      originalPrice: (fetchedProduct.price || 0) * 1.1,
      badge: "new"
    } as Product;
  }, [fetchedProduct]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);

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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-12 px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
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
        <main className="flex-1 container mx-auto py-12 text-center px-4">
          <h2 className="text-2xl font-bold text-red-500">Produk tidak ditemukan</h2>
          <p className="text-muted-foreground mt-2">Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link to="/">
             <Button className="mt-6">Kembali ke Beranda</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" key={slug}>
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="container mx-auto py-4 px-4 lg:px-0">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li>
                <Link to={`/collections/${product.category?.slug || 'all'}`} className="hover:text-foreground">
                    {product.category?.name || 'Koleksi'}
                </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-foreground truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <section className="container mx-auto pb-16 px-4 lg:px-0">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted relative">
                {product.images && product.images[selectedImage] && (
                  <img
                    src={typeof product.images[selectedImage] === 'string' ? (product.images[selectedImage] as string) : (product.images[selectedImage] as unknown as ProductImage).url}
                    alt={product.name}
                    className="product-card-image w-full h-full object-cover"
                  />
                )}
                {product.badge && (
                  <Badge variant={product.badge} className="absolute top-4 left-4">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images?.map((img: string | ProductImage, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-24 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={typeof img === 'string' ? img : img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge variant="sale">{discount}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-medium mb-3">Warna: {selectedColor?.name || ""}</h3>
                <div className="flex gap-3">
                  {product.colors?.map((color: ProductColor) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor?.hex === color.hex
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Ukuran</h3>
                  <button className="text-sm text-primary hover:underline">
                    Panduan Ukuran
                  </button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes?.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-md border-2 font-medium transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-medium mb-3">Jumlah</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Stok: {product.stock ?? 0}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="cart" size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
                  {product.stock === 0 ? "Habis" : "Tambah ke Keranjang"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className={cn(
                    "border border-border",
                    inWishlist && "text-red-500 hover:text-red-600 border-red-200 bg-red-50"
                  )}
                  onClick={handleToggleWishlist}
                >
                  <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                </Button>
                <Button variant="ghost" size="lg" className="border border-border">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="hero" size="lg" className="w-full" onClick={handleBuyNow} disabled={product.stock === 0}>
                Beli Sekarang
              </Button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Gratis Ongkir</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">30 Hari Retur</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Pembayaran Aman</p>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-medium mb-3">Deskripsi</h3>
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-0">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts?.map((item: Product) => (
                <ProductCard 
                  key={item.id} 
                  product={item} 
                />
              ))}
              {(!relatedProducts || relatedProducts.length === 0) && (
                <p className="col-span-full text-muted-foreground text-center">Tidak ada produk terkait.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
