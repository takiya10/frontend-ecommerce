import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import { fetcher } from "@/lib/api-client";
import { Order, VoucherResponse } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Address } from "@/types";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherResponse | null>(null);
  
  // --- Address Logic ---
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showGuestForm, setShowGuestForm] = useState(!isAuthenticated);

  const { data: addresses } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: () => fetcher<Address[]>('/address'),
    enabled: isAuthenticated,
  });

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ')[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });

  // Effect to sync initial state if auth changes during checkout
  useEffect(() => {
    if (isAuthenticated && !selectedAddressId && addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setShowGuestForm(false);
    }
  }, [isAuthenticated, addresses, selectedAddressId]);

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const total = subtotal + shippingCost - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleApplyVoucher = async () => {
    if (!promoCode.trim()) return;
    try {
        const result = await fetcher<VoucherResponse>('/vouchers/validate', {
            method: 'POST',
            body: JSON.stringify({ code: promoCode, orderAmount: subtotal })
        });
        setAppliedVoucher(result);
        toast.success(`Voucher ${result.code} berhasil dipasang!`);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Kode promo tidak valid";
        toast.error(message);
        setAppliedVoucher(null);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let checkoutData = {};
    if (isAuthenticated && !showGuestForm && selectedAddressId) {
      const addr = addresses?.find(a => a.id === selectedAddressId);
      checkoutData = {
        firstName: addr?.firstName,
        lastName: addr?.lastName,
        email: addr?.email,
        phone: addr?.phone,
        address: addr?.addressLine,
        city: addr?.city,
        postalCode: addr?.postalCode,
      };
    } else {
      checkoutData = formData;
    }

    try {
        const order = await fetcher<Order>('/orders', {
            method: 'POST',
            body: JSON.stringify({
                ...checkoutData,
                items: !isAuthenticated || showGuestForm ? items.map(i => ({ 
                  productId: i.productId, 
                  quantity: i.quantity,
                  size: i.size,
                  color: i.color
                })) : undefined,
                voucherId: appliedVoucher?.voucherId
            }) 
        });
        
        const { snap_token } = await fetcher<{ snap_token: string }>(`/payments/snap-token/${order.id}`, {
            method: 'POST'
        });

        const snap = window.snap;
        if (snap) {
            snap.pay(snap_token, {
                onSuccess: (result: unknown) => {
                    console.log("Payment success:", result);
                    toast.success("Pembayaran berhasil!");
                    void clearCart();
                    // If guest, show a guest-order-status page instead of /profile
                    navigate(isAuthenticated ? "/profile?tab=orders" : `/order-status?id=${order.id}&email=${(checkoutData as Record<string, string>).email}`);
                },
                onPending: (result: unknown) => {
                    console.log("Payment pending:", result);
                    toast.info("Pembayaran tertunda.");
                    void clearCart();
                    navigate(isAuthenticated ? "/profile?tab=orders" : `/order-status?id=${order.id}&email=${(checkoutData as Record<string, string>).email}`);
                },
                onError: (result: unknown) => {
                    console.error("Payment error:", result);
                    toast.error("Pembayaran gagal.");
                },
                onClose: () => {
                    toast.info("Jendela pembayaran ditutup.");
                    void clearCart();
                    navigate(isAuthenticated ? "/profile?tab=orders" : "/");
                }
            });
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal membuat pesanan";
        toast.error(message);
    } finally {
        setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0 hover:pl-2 transition-all"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Keranjang
          </Button>

          <h1 className="font-serif text-3xl md:text-4xl mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="space-y-8">
              {!isAuthenticated && (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="pt-6">
                    <p className="text-sm mb-4">Sudah punya akun? Login untuk menggunakan alamat yang tersimpan.</p>
                    <Button variant="outline" size="sm" onClick={() => navigate("/login?redirect=checkout")}>Sign In</Button>
                  </CardContent>
                </Card>
              )}

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
                <section>
                  <h2 className="text-xl font-medium mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Truck className="h-5 w-5" /> Informasi Pengiriman</span>
                    {isAuthenticated && addresses && addresses.length > 0 && (
                      <Button type="button" variant="link" className="text-xs h-auto p-0" onClick={() => setShowGuestForm(!showGuestForm)}>
                        {showGuestForm ? "Pilih dari Alamat Saya" : "Gunakan Alamat Baru"}
                      </Button>
                    )}
                  </h2>

                  {isAuthenticated && !showGuestForm && addresses && addresses.length > 0 ? (
                    <div className="grid gap-3">
                      {addresses.map((addr) => (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all relative group",
                            selectedAddressId === addr.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/50"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-sm">{addr.firstName} {addr.lastName}</p>
                            {addr.isDefault && <Badge variant="outline" className="text-[9px] uppercase font-bold">Utama</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{addr.phone}</p>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {addr.addressLine}, {addr.city} {addr.postalCode}
                          </p>
                          {selectedAddressId === addr.id && <div className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nama Depan</Label>
                          <Input id="firstName" required placeholder="Nama depan" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nama Belakang</Label>
                          <Input id="lastName" required placeholder="Nama belakang" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Konfirmasi</Label>
                        <Input id="email" type="email" required placeholder="email@anda.com" value={formData.email} onChange={handleInputChange} />
                        <p className="text-[10px] text-muted-foreground">Detail pesanan akan dikirim ke email ini.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon (WhatsApp)</Label>
                        <Input id="phone" type="tel" required placeholder="08..." value={formData.phone} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <Textarea id="address" required placeholder="Nama jalan, gedung, no rumah" value={formData.address} onChange={handleInputChange} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Kota / Kabupaten</Label>
                          <Input id="city" required value={formData.city} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Kode Pos</Label>
                          <Input id="postalCode" required value={formData.postalCode} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section>
                  <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Metode Pembayaran
                  </h2>
                  <div className="p-4 bg-muted/20 rounded-lg border border-dashed text-center">
                    <p className="text-sm text-muted-foreground">Pembayaran akan diproses aman melalui Midtrans Snap.</p>
                  </div>
                </section>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:pl-8">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24 shadow-sm">
                <h2 className="font-serif text-xl mb-6">Ringkasan Pesanan</h2>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{item.size} • {item.color}</p>
                      </div>
                      <p className="text-sm font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex gap-2 py-2">
                    <Input 
                        placeholder="Kode promo?" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="h-9 text-xs"
                        disabled={!!appliedVoucher}
                    />
                    {appliedVoucher ? (
                        <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => {setAppliedVoucher(null); setPromoCode("");}}>Hapus</Button>
                    ) : (
                        <Button variant="outline" size="sm" className="h-9 text-xs" onClick={handleApplyVoucher}>Pasang</Button>
                    )}
                  </div>

                  {appliedVoucher && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Diskon ({appliedVoucher.code})</span>
                        <span>-{formatPrice(appliedVoucher.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-border mt-2">
                    <span>Total Tagihan</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full mt-8 py-7 text-base font-bold shadow-lg shadow-primary/20" 
                  disabled={isProcessing || (!showGuestForm && !selectedAddressId)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses Pesanan...
                    </>
                  ) : (
                    "Lanjutkan Pembayaran"
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-medium">Secure SSL Transaction</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
