import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { fetcher } from "@/lib/api-client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Clock, Package, Truck, ArrowLeft } from "lucide-react";
import { Order } from "@/types";

export default function OrderStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const email = searchParams.get("email");

  const { data: order, isLoading } = useQuery({
    queryKey: ['guest-order', orderId],
    queryFn: () => fetcher<Order>(`/orders/${orderId}?email=${email}`),
    enabled: !!orderId && !!email,
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center font-serif text-xl animate-pulse">Checking order status...</div>;

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Order Not Found</h1>
      <p className="text-muted-foreground mb-8">Maaf, kami tidak dapat menemukan pesanan dengan detail tersebut.</p>
      <Link to="/"><Button>Back to Shop</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-3xl font-bold">Terima Kasih!</h1>
            <p className="text-muted-foreground mt-2">Pesanan Anda telah kami terima.</p>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm uppercase tracking-widest">Detail Pesanan</CardTitle>
                <span className="font-mono text-xs">{order.id.split('-')[0].toUpperCase()}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-sm text-muted-foreground">Status Pembayaran</span>
                <Badge variant={order.status === 'PAID' ? 'default' : 'outline'} className="uppercase font-bold">
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Item Dipesan</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <Truck className="h-4 w-4" /> Alamat Pengiriman
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="font-bold text-foreground">{order.shippingName}</p>
              <p>{order.shippingPhone}</p>
              <p className="mt-2">{order.shippingAddress}, {order.shippingCity}, {order.shippingPostal}</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link to="/">
              <Button variant="ghost" className="text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" /> Lanjut Belanja
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
