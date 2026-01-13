import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/components/product/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-serif text-2xl md:text-3xl mb-2">
              Wishlist Kosong
            </h1>
            <p className="text-muted-foreground mb-6">
              Belum ada produk yang Anda simpan
            </p>
            <Link to="/">
              <Button variant="hero" size="lg">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto py-8 lg:py-12">
          <h1 className="font-serif text-3xl md:text-4xl mb-8">
            Wishlist Saya
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <article
                key={item.id}
                className="group relative bg-card rounded-lg border border-border overflow-hidden"
              >
                <Link to={`/products/${item.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <span className="bg-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Stok Habis
                      </span>
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <Link
                    to={`/products/${item.slug}`}
                    className="block font-medium text-base hover:text-primary line-clamp-1 mb-1"
                  >
                    {item.name}
                  </Link>
                  <p className="font-semibold text-lg mb-4">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex gap-2">
                    <Link to={`/products/${item.slug}`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Lihat Produk
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive border border-border"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
