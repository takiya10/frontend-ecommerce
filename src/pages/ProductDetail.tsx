import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Minus, Plus, Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/home/ProductGrid";
import { toast } from "sonner";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

const product = {
  id: "1",
  name: "Floure Embroidery Set Dessert Taupe L-XL Series",
  slug: "floure-embroidery-set-dessert-taupe",
  price: 429000,
  originalPrice: 459000,
  images: [product1, product2],
  badge: "sale" as const,
  description: `Set lengkap dengan detail bordir yang elegan. Dibuat dari bahan premium yang nyaman dipakai seharian.

Fitur:
• Bahan premium breathable
• Detail bordir eksklusif
• Cutting yang flattering
• Cocok untuk acara formal maupun casual`,
  sizes: ["S-M", "L-XL"],
  colors: [
    { name: "Dessert Taupe", hex: "#8B7355" },
    { name: "Cream", hex: "#F5E6D3" },
    { name: "Sage", hex: "#8B9A6B" },
  ],
  stock: 15,
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Silakan pilih ukuran terlebih dahulu");
      return;
    }
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Silakan pilih ukuran terlebih dahulu");
      return;
    }
    // Navigate to checkout
    toast.success("Menuju halaman checkout...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="container mx-auto py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li><Link to="/collections/outfit" className="hover:text-foreground">Outfit</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-foreground truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <section className="container mx-auto pb-16">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <Badge variant={product.badge} className="absolute top-4 left-4">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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
                <h3 className="font-medium mb-3">Warna: {selectedColor.name}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor.hex === color.hex
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
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
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
                    Stok: {product.stock}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="cart" size="lg" className="flex-1" onClick={handleAddToCart}>
                  Tambah ke Keranjang
                </Button>
                <Button variant="ghost" size="lg" className="border border-border">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="lg" className="border border-border">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="hero" size="lg" className="w-full" onClick={handleBuyNow}>
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
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <ProductGrid
          title="Produk Terkait"
          subtitle="Anda mungkin juga suka"
          viewAllHref="/collections/outfit"
        />
      </main>

      <Footer />
    </div>
  );
}
