import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { fetcher } from "@/lib/api-client";
import { Order, VoucherResponse, MidtransSnap } from "@/types";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherResponse | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });

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

    try {
        const order = await fetcher<Order>('/orders', {
            method: 'POST',
            body: JSON.stringify({
                ...formData,
                voucherId: appliedVoucher?.voucherId
            }) 
        });
        
        // 1. Get Snap Token
        const { snap_token } = await fetcher<{ snap_token: string }>(`/payments/snap-token/${order.id}`, {
            method: 'POST'
        });

        // 2. Open Midtrans Snap Popup
        const snap = window.snap;
        if (snap) {
            snap.pay(snap_token, {
                onSuccess: (result: unknown) => {
                    console.log('Payment success:', result);
                    toast.success("Pembayaran berhasil!");
                    void clearCart();
                    navigate("/profile");
                },
                onPending: (result: unknown) => {
                    console.log('Payment pending:', result);
                    toast.info("Pembayaran tertunda, silakan selesaikan pembayaran Anda.");
                    void clearCart();
                    navigate("/profile");
                },
                onError: (result: unknown) => {
                    console.error('Payment error:', result);
                    toast.error("Pembayaran gagal.");
                },
                onClose: () => {
                    console.log('Payment popup closed');
                    toast.info("Anda menutup jendela pembayaran sebelum selesai.");
                    void clearCart();
                    navigate("/profile");
                }
            });
        } else {
            toast.error("Sistem pembayaran sedang tidak tersedia.");
            navigate("/profile");
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal membuat pesanan";
        console.error(error);
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
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              <section>
                <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Informasi Pengiriman
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input id="firstName" required placeholder="John" value={formData.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input id="lastName" required placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" type="tel" required placeholder="08123456789" value={formData.phone} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea id="address" required placeholder="Nama jalan, nomor rumah, RT/RW" value={formData.address} onChange={handleInputChange} />
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
              </section>

              <section>
                <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Metode Pembayaran
                </h2>
                <RadioGroup defaultValue="transfer" className="space-y-3">
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex-1 cursor-pointer">Transfer Bank (BCA/Mandiri)</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="qris" id="qris" />
                    <Label htmlFor="qris" className="flex-1 cursor-pointer">QRIS (GoPay, OVO, ShopeePay)</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">Bayar di Tempat (COD)</Label>
                  </div>
                </RadioGroup>
              </section>
            </form>

            {/* Order Summary */}
            <div className="lg:pl-8">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-serif text-xl mb-6">Ringkasan Pesanan</h2>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover rounded-md"
                        />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.size} • {item.color}</p>
                      </div>
                      <p className="text-sm font-medium">
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
                  
                  {/* Voucher Input */}
                  <div className="flex gap-2 py-2">
                    <Input 
                        placeholder="Punya kode promo?" 
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
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Diskon ({appliedVoucher.code})</span>
                        <span>-{formatPrice(appliedVoucher.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full mt-6" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Bayar Sekarang"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
