import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/components/product/ProductCard";
import { toast } from "sonner";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Floure Embroidery Set Dessert Taupe L-XL Series",
    slug: "floure-embroidery-set-dessert-taupe",
    price: 429000,
    image: product1,
    size: "L-XL",
    color: "Dessert Taupe",
    quantity: 1,
  },
  {
    id: "2",
    name: "Sage Piping Dress with Belt",
    slug: "sage-piping-dress",
    price: 389000,
    image: product2,
    size: "S-M",
    color: "Sage",
    quantity: 2,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500000 ? 0 : 25000;
  const total = subtotal + shipping;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    toast.success("Produk dihapus dari keranjang");
  };

  const applyPromo = () => {
    if (!promoCode.trim()) return;
    toast.info("Kode promo tidak valid");
    setPromoCode("");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-serif text-2xl md:text-3xl mb-2">
              Keranjang Kosong
            </h1>
            <p className="text-muted-foreground mb-6">
              Belum ada produk di keranjang Anda
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
            Keranjang Belanja
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                >
                  <Link to={`/products/${item.slug}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 md:w-32 md:h-36 object-cover rounded-md"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.slug}`}
                      className="font-medium text-sm md:text-base hover:text-primary line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.color} • {item.size}
                    </p>
                    <p className="font-semibold mt-2">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-serif text-xl mb-6">Ringkasan Pesanan</h2>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Kode Promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={applyPromo}>
                    Terapkan
                  </Button>
                </div>

                {/* Summary */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {subtotal < 500000 && (
                    <p className="text-xs text-muted-foreground">
                      Belanja {formatPrice(500000 - subtotal)} lagi untuk gratis
                      ongkir!
                    </p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border font-semibold text-base">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout">
                  <Button variant="hero" className="w-full mt-6" size="lg">
                    Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Harga termasuk pajak. Ongkir dihitung saat checkout.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
