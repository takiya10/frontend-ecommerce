import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Package, MapPin, Settings, LogOut, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { User, Order, Address } from "@/types";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // --- DATA FETCHING ---
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetcher<User>('/users/profile'),
    enabled: isAuthenticated,
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetcher<Order[]>('/orders'),
    enabled: isAuthenticated,
  });

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => fetcher<Address[]>('/address'),
    enabled: isAuthenticated,
  });

  // --- MUTATIONS ---
  const addAddressMutation = useMutation({
    mutationFn: (data: Partial<Address>) => fetcher<Address>('/address', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success("Alamat berhasil ditambahkan");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => fetcher(`/address/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success("Alamat dihapus");
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // --- HANDLERS ---
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePayOrder = async (orderId: string) => {
    try {
      const { snap_token } = await fetcher<{ snap_token: string }>(`/payments/snap-token/${orderId}`, {
        method: 'POST'
      });

      if (window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Pembayaran berhasil!");
          },
          onPending: () => {
            toast.info("Pembayaran masih tertunda.");
          },
          onClose: () => {
            toast.info("Jendela pembayaran ditutup.");
          }
        });
      }
    } catch (error) {
      toast.error("Gagal memulai pembayaran.");
    }
  };

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    addAddressMutation.mutate(data as unknown as Partial<Address>);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto py-8 lg:py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <Card>
              <CardHeader className="text-center border-b pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle>{profile?.name || user?.email}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button variant="ghost" className="justify-start rounded-none h-12" onClick={() => setActiveTab("overview")}>
                    <UserIcon className="mr-3 h-4 w-4" /> Profil
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12" onClick={() => setActiveTab("orders")}>
                    <Package className="mr-3 h-4 w-4" /> Pesanan Saya
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12" onClick={() => setActiveTab("addresses")}>
                    <MapPin className="mr-3 h-4 w-4" /> Alamat
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-12 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-3 h-4 w-4" /> Keluar
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              
              {/* OVERVIEW */}
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>Detail akun dan informasi login Anda.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Nama Lengkap</Label>
                      <Input defaultValue={profile?.name || ""} readOnly className="bg-muted" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input defaultValue={user?.email || ""} readOnly className="bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ORDERS */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Pesanan</CardTitle>
                    <CardDescription>Lihat status dan riwayat pembelian Anda.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Belum ada pesanan.</p>
                      ) : (
                        orders?.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4 border-b pb-2">
                              <div>
                                <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {order.status}
                                </span>
                                <p className="font-bold mt-1">{formatPrice(order.totalAmount)}</p>
                                {order.status === 'PENDING' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="mt-2 h-7 text-xs border-primary text-primary hover:bg-primary hover:text-white"
                                    onClick={() => handlePayOrder(order.id)}
                                  >
                                    Bayar Sekarang
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                  <img 
                                    src={item.product.images?.[0]?.url || "/placeholder.jpg"} 
                                    className="w-12 h-12 object-cover rounded" 
                                  />
                                  <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-muted-foreground">{item.quantity} x {formatPrice(item.price)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ADDRESSES */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Buku Alamat</CardTitle>
                    <CardDescription>Kelola alamat pengiriman Anda.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Address Form */}
                    <form onSubmit={handleAddAddress} className="border p-4 rounded-lg bg-accent/20 space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Tambah Alamat Baru
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input name="firstName" placeholder="Nama Depan" required />
                        <Input name="lastName" placeholder="Nama Belakang" required />
                      </div>
                      <Input name="phone" placeholder="Nomor Telepon" required />
                      <Input name="addressLine" placeholder="Alamat Lengkap" required />
                      <div className="grid grid-cols-2 gap-4">
                        <Input name="city" placeholder="Kota" required />
                        <Input name="postalCode" placeholder="Kode Pos" required />
                      </div>
                      <input type="hidden" name="email" value={user?.email || ""} />
                      <Button type="submit" size="sm">Simpan Alamat</Button>
                    </form>

                    {/* Address List */}
                    <div className="grid gap-4">
                      {addresses?.map((addr) => (
                        <div key={addr.id} className="flex justify-between items-center border p-4 rounded-lg">
                          <div>
                            <p className="font-bold">{addr.firstName} {addr.lastName}</p>
                            <p className="text-sm">{addr.addressLine}</p>
                            <p className="text-sm text-muted-foreground">
                              {addr.city}, {addr.postalCode} | {addr.phone}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => deleteAddressMutation.mutate(addr.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
