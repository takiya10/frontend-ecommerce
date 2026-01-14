import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User as UserIcon, Package, MapPin, Settings, LogOut, Plus, Trash2, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatPrice, cn } from "@/lib/utils";
import { User, Order, Address } from "@/types";

export default function Profile() {
  const { user, adminUser, logout, isAuthenticated, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  // Effective user data (either regular user or admin)
  const currentUser = adminUser || user;
  const isAnyAuthenticated = isAuthenticated || isAdminAuthenticated;

  // Get tab from URL or default to overview
  const activeTab = searchParams.get("tab") || "overview";

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // --- DATA FETCHING ---
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: () => fetcher<User>('/users/profile'),
    enabled: isAnyAuthenticated,
  });

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', currentUser?.id],
    queryFn: () => fetcher<Order[]>('/orders'),
    enabled: isAnyAuthenticated && !isAdminAuthenticated, // Admins check orders in dashboard
  });

  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ['addresses', currentUser?.id],
    queryFn: () => fetcher<Address[]>('/address'),
    enabled: isAnyAuthenticated,
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
    if (!isAnyAuthenticated) {
      navigate("/login");
    }
  }, [isAnyAuthenticated, navigate]);

  if (!isAnyAuthenticated || !currentUser) {
    return null;
  }

  // --- HANDLERS ---
  const handleLogout = () => {
    logout(isAdminAuthenticated);
    navigate("/");
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
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1 container mx-auto py-8 lg:py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="text-center bg-card border-b pb-8 pt-10">
                <div className="relative inline-block mx-auto mb-4">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background shadow-sm">
                    <UserIcon className="h-12 w-12 text-primary" />
                  </div>
                  {isAdminAuthenticated && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-md">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <CardTitle className="font-serif text-xl">{profile?.name || currentUser.name || "User"}</CardTitle>
                <CardDescription className="text-xs tracking-wider uppercase mt-1">{currentUser.email}</CardDescription>
                {isAdminAuthenticated && <Badge className="mt-3 bg-primary/10 text-primary hover:bg-primary/10 border-primary/20">Administrator</Badge>}
              </CardHeader>
              <CardContent className="p-2 bg-card">
                <nav className="space-y-1">
                  <SidebarButton 
                    active={activeTab === "overview"} 
                    onClick={() => setActiveTab("overview")} 
                    icon={UserIcon} 
                    label="Profil Saya" 
                  />
                  {!isAdminAuthenticated && (
                    <SidebarButton 
                      active={activeTab === "orders"} 
                      onClick={() => setActiveTab("orders")} 
                      icon={Package} 
                      label="Pesanan Saya" 
                    />
                  )}
                  <SidebarButton 
                    active={activeTab === "addresses"} 
                    onClick={() => setActiveTab("addresses")} 
                    icon={MapPin} 
                    label="Daftar Alamat" 
                  />
                  {isAdminAuthenticated && (
                    <SidebarButton 
                      active={false} 
                      onClick={() => navigate("/byher-internal-mgmt")} 
                      icon={Settings} 
                      label="Admin Dashboard" 
                    />
                  )}
                  <div className="pt-2 mt-2 border-t border-border">
                    <SidebarButton 
                      active={false} 
                      onClick={handleLogout} 
                      icon={LogOut} 
                      label="Keluar" 
                      variant="destructive"
                    />
                  </div>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Tabs value={activeTab} className="w-full">
              
              {/* OVERVIEW */}
              <TabsContent value="overview" className="mt-0 animate-fade-in">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Informasi Akun</CardTitle>
                    <CardDescription>Kelola informasi dasar dan keamanan akun Anda.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Nama Lengkap</Label>
                        <Input value={profile?.name || ""} readOnly className="bg-muted/50 border-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Alamat Email</Label>
                        <Input value={currentUser.email} readOnly className="bg-muted/50 border-none" />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => toast.info("Fitur ganti password akan segera hadir")}>Ganti Password</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ORDERS */}
              <TabsContent value="orders" className="mt-0 animate-fade-in">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Riwayat Belanja</CardTitle>
                    <CardDescription>Pantau status pengiriman dan riwayat pembelian Anda.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {isOrdersLoading ? (
                        <div className="py-12 text-center animate-pulse text-muted-foreground italic">Memuat pesanan...</div>
                      ) : orders?.length === 0 ? (
                        <div className="py-12 text-center">
                          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                          <p className="text-muted-foreground">Belum ada transaksi.</p>
                          <Button variant="link" onClick={() => navigate("/")}>Mulai Belanja</Button>
                        </div>
                      ) : (
                        orders?.map((order) => (
                          <div key={order.id} className="border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap justify-between items-center gap-4 bg-muted/30 px-6 py-4 border-b">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</p>
                                  <p className="font-mono text-sm uppercase">#{order.id.slice(0, 8)}</p>
                                </div>
                                <div className="h-8 w-[1px] bg-border" />
                                <div>
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Tanggal</p>
                                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Total</p>
                                  <p className="font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                                </div>
                                <Badge variant={order.status === 'PAID' ? 'default' : 'outline'} className="uppercase text-[10px] px-3 py-1">
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-6 space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                  <img 
                                    src={item.product.images?.[0]?.url || "/placeholder.svg"} 
                                    className="w-16 h-20 object-cover rounded-lg shadow-sm border" 
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{item.quantity} x {formatPrice(item.price)}</p>
                                  </div>
                                </div>
                              ))}
                              {order.status === 'PENDING' && (
                                <div className="pt-4 flex justify-end">
                                  <Button size="sm" className="px-8 font-bold" onClick={() => handlePayOrder(order.id)}>Bayar Sekarang</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ADDRESSES */}
              <TabsContent value="addresses" className="mt-0 animate-fade-in">
                <div className="grid gap-8 lg:grid-cols-3">
                  <Card className="lg:col-span-2 border-none shadow-sm h-fit">
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl">Buku Alamat</CardTitle>
                      <CardDescription>Alamat yang tersimpan untuk checkout lebih cepat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {isAddressesLoading ? (
                          <div className="py-8 text-center animate-pulse text-muted-foreground">Memuat alamat...</div>
                        ) : addresses?.length === 0 ? (
                          <div className="py-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                            Belum ada alamat tersimpan.
                          </div>
                        ) : (
                          addresses?.map((addr) => (
                            <div key={addr.id} className="flex justify-between items-start border rounded-xl p-5 bg-card hover:border-primary/30 transition-colors group relative">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm">{addr.firstName} {addr.lastName}</p>
                                  {addr.isDefault && <Badge variant="secondary" className="text-[8px] h-4 uppercase">Utama</Badge>}
                                </div>
                                <p className="text-xs text-muted-foreground">{addr.phone}</p>
                                <p className="text-sm leading-relaxed mt-2 text-foreground/80">
                                  {addr.addressLine}<br />
                                  {addr.city}, {addr.postalCode}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-colors"
                                onClick={() => deleteAddressMutation.mutate(addr.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm h-fit">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-widest font-bold">Tambah Alamat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold">Nama Depan</Label>
                            <Input name="firstName" placeholder="Nama depan" required className="text-xs h-9" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold">Nama Belakang</Label>
                            <Input name="lastName" placeholder="Nama belakang" required className="text-xs h-9" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Nomor Telepon (WhatsApp)</Label>
                          <Input name="phone" placeholder="08..." required className="text-xs h-9" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Alamat Lengkap</Label>
                          <Input name="addressLine" placeholder="Nama jalan, gedung, no rumah" required className="text-xs h-9" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold">Kota / Kabupaten</Label>
                            <Input name="city" placeholder="Kota" required className="text-xs h-9" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold">Kode Pos</Label>
                            <Input name="postalCode" placeholder="Kode Pos" required className="text-xs h-9" />
                          </div>
                        </div>
                        <input type="hidden" name="email" value={currentUser.email} />
                        <Button type="submit" size="sm" className="w-full font-bold mt-2" disabled={addAddressMutation.isPending}>
                          {addAddressMutation.isPending ? "Menyimpan..." : "Simpan Alamat"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface SidebarButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  variant?: "default" | "destructive";
}

function SidebarButton({ active, onClick, icon: Icon, label, variant }: SidebarButtonProps) {
  return (
    <Button 
      variant="ghost" 
      onClick={onClick}
      className={cn(
        "w-full justify-start h-11 px-4 rounded-lg transition-all font-medium",
        active 
          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
          : variant === "destructive" 
            ? "text-destructive hover:bg-destructive/10" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("mr-3 h-4 w-4", active ? "text-primary-foreground" : "")} />
      {label}
    </Button>
  );
}
