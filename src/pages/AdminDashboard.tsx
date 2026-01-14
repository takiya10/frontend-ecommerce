import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users as UsersIcon, 
  Plus, 
  Search, 
  MoreVertical, 
  TrendingUp, 
  DollarSign, 
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Trash2,
  Edit,
  Save,
  ChevronRight,
  Globe,
  MessageCircle,
  Instagram,
  ShieldCheck,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import { User, Order, Product, Category, AdminStats } from "@/types";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const CATEGORY_DATA = [
  { name: 'Hijab', value: 400 },
  { name: 'Outfit', value: 300 },
  { name: 'Accessories', value: 300 },
];

const COLORS = ['#8B7355', '#D8A7B1', '#2C3E50', '#95A5A6'];

interface Banner {
  id: number;
  url: string;
  title: string;
  subtitle: string;
  highlight: string;
}

interface NavItemProps {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  color: string;
}

export default function AdminDashboard() {
  const { adminUser, isAdminAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!authLoading) {
      if (!isAdminAuthenticated || adminUser?.role !== 'ADMIN') {
        toast.error("Akses ditolak. Halaman khusus Admin.");
        navigate("/byher-internal-mgmt/login");
      }
    }
  }, [isAdminAuthenticated, adminUser, navigate, authLoading]);

  // --- DATA FETCHING ---
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => fetcher<AdminStats>('/admin/stats'),
    enabled: !!adminUser && adminUser.role === 'ADMIN',
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => fetcher<Product[]>('/products'),
    enabled: !!adminUser && adminUser.role === 'ADMIN',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetcher<Category[]>('/categories'),
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => fetcher<Order[]>('/admin/orders'),
    enabled: !!adminUser && adminUser.role === 'ADMIN',
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetcher<User[]>('/admin/users'),
    enabled: !!adminUser && adminUser.role === 'ADMIN',
  });

  if (authLoading || !adminUser) return null;

  const NavItem = ({ value, label, icon: Icon }: NavItemProps) => (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg",
        activeTab === value 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="mr-3 h-5 w-5" />
      {isSidebarOpen && label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}
      <aside className={cn(
        "bg-card border-r transition-all duration-300 flex flex-col z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tighter">Byher</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Management</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className={cn("text-[10px] font-bold text-muted-foreground uppercase px-4 mb-2", !isSidebarOpen && "hidden")}>Main</p>
          <NavItem value="overview" label="Dashboard" icon={LayoutDashboard} />
          <NavItem value="orders" label="Orders" icon={ShoppingBag} />
          
          <p className={cn("text-[10px] font-bold text-muted-foreground uppercase px-4 mt-6 mb-2", !isSidebarOpen && "hidden")}>Catalog</p>
          <NavItem value="products" label="Products" icon={Package} />
          <NavItem value="users" label="Customers" icon={UsersIcon} />
          
          <p className={cn("text-[10px] font-bold text-muted-foreground uppercase px-4 mt-6 mb-2", !isSidebarOpen && "hidden")}>Storefront</p>
          <NavItem value="cms" label="Hero Banners" icon={ImageIcon} />
          <NavItem value="settings" label="Site Settings" icon={Settings} />
        </nav>

        <div className="p-4 mt-auto border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-lg"
            onClick={() => { logout(true); navigate("/byher-internal-mgmt/login"); }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {isSidebarOpen && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-widest font-bold">Portal</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-xs uppercase tracking-widest font-bold text-foreground">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
              <Eye className="mr-2 h-4 w-4" /> Visit Store
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{adminUser?.name || "Admin"}</p>
                <p className="text-[10px] text-primary font-bold uppercase mt-1">Super Admin</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
                {adminUser?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Gross Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} trend="+12.5%" color="bg-blue-500" />
                <StatCard title="Total Customers" value={stats?.totalUsers || 0} icon={UsersIcon} trend="+5.2%" color="bg-purple-500" />
                <StatCard title="Orders Placed" value={stats?.totalOrders || 0} icon={ShoppingBag} trend="+18.3%" color="bg-orange-500" />
                <StatCard title="Total Inventory" value={stats?.totalProducts || 0} icon={Package} trend="Stable" color="bg-emerald-500" />
              </div>
              
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RecentOrders orders={orders?.slice(0, 8)} />
                </div>
                <div className="space-y-6">
                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-sm">Sales Trend</CardTitle></CardHeader>
                    <CardContent className="h-[200px] p-0 pb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B7355" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#8B7355" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="revenue" stroke="#8B7355" fillOpacity={1} fill="url(#colorRev)" />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value) => formatPrice(Number(value))}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader><CardTitle className="text-sm">Categories</CardTitle></CardHeader>
                    <CardContent className="h-[180px] p-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={CATEGORY_DATA}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {CATEGORY_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && <ProductManagement products={products} categories={categories} />}
          {activeTab === "orders" && <OrderManagement orders={orders} />}
          {activeTab === "users" && <CustomerManagement users={users} />}
          {activeTab === "cms" && <CMSBannerManagement />}
          {activeTab === "settings" && <SiteSettings />}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm relative overflow-hidden group">
      <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg text-white shadow-sm", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2">{trend}</span>
          <p className="text-[10px] text-muted-foreground">than last month</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductManagement({ products, categories }: { products?: Product[], categories?: Category[] }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const initialFormState = {
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    images: [{ url: "", color: "" }],
    variants: [{ size: "All Size", color: "Original", hex: "#8B7355", stock: 0 }]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Helper: Get unique colors defined in variants for image mapping
  const definedColors = Array.from(new Set(
    formData.variants
      .filter((v: { color: string }) => v.color && v.color.trim() !== "")
      .map((v: { color: string, hex: string }) => JSON.stringify({ name: v.color, hex: v.hex }))
  )).map((s: string) => JSON.parse(s) as { name: string, hex: string });

  const mutation = useMutation({
    mutationFn: (data: typeof initialFormState) => {
      // Transform unified variants back to backend schema
      const transformedVariants: { name: string, value: string, hex: string, stock: number }[] = [];
      
      const uniqueColors = new Map<string, string>();
      const uniqueSizes = new Set<string>();
      let totalStock = 0;

      data.variants.forEach((v) => {
        if (v.color) uniqueColors.set(v.color, v.hex);
        if (v.size) uniqueSizes.add(v.size);
        totalStock += Number(v.stock || 0);
      });

      uniqueColors.forEach((hex, name) => {
        transformedVariants.push({ name: 'Color', value: name, hex, stock: 0 });
      });
      uniqueSizes.forEach(size => {
        transformedVariants.push({ name: 'Size', value: size, hex: "", stock: 0 });
      });

      const payload = {
        ...data,
        stock: totalStock,
        images: data.images.filter((img) => img.url.trim() !== ""),
        variants: transformedVariants,
      };
      
      return editingProduct 
        ? fetcher(`/products/${editingProduct.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
        : fetcher('/products', { method: 'POST', body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData(initialFormState);
      toast.success(editingProduct ? "Product updated" : "Product created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save product");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetcher(`/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Product deleted");
    }
  });

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    
    // Reverse transform backend data to unified UI structure
    const colors = p.variants?.filter(v => v.name === 'Color') || [];
    const sizes = p.variants?.filter(v => v.name === 'Size') || [];
    
    const unifiedVariants = colors.length > 0 ? colors.map((c, i) => ({
      color: c.value,
      hex: c.hex || "",
      size: sizes[i]?.value || (sizes[0]?.value || "All Size"),
      stock: Math.floor(p.stock / (colors.length || 1))
    })) : [{ size: "All Size", color: "Original", hex: "#8B7355", stock: p.stock }];

    setFormData({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId,
      images: p.images?.length ? p.images.map(img => ({ url: img.url, color: img.color || "" })) : [{ url: "", color: "" }],
      variants: unifiedVariants
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Inventory</h2>
          <p className="text-sm text-muted-foreground">Manage your boutique collection and stock levels.</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setFormData(initialFormState); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Product
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden border">
                      {p.images?.[0] ? <img src={p.images[0].url} className="h-full w-full object-cover" /> : <ImageIcon className="h-full w-full p-3 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline" className="font-normal capitalize">{p.category?.name}</Badge></TableCell>
                  <TableCell className="font-semibold">{formatPrice(p.price)}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-bold",
                      p.stock < 5 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {p.stock} total
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PRO PRODUCT MODAL */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
            <DialogDescription>Setup your product options and images here.</DialogDescription>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-12 gap-8 py-4">
            {/* Left: Info & Variants */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-bold">Product Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} placeholder="e.g. Pashmina Silk Premium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase font-bold">Price (IDR)</Label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase font-bold">Category</Label>
                    <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})}>
                      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-bold">Variants (Size & Color combinations)</Label>
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setFormData({...formData, variants: [...formData.variants, {size: "", color: "", hex: "", stock: 0}]})}>
                    <Plus className="mr-1 h-3 w-3" /> Add Row
                  </Button>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="h-8">
                        <TableHead className="text-[10px] uppercase font-bold">Size</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold">Color Name</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold">Hex</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold w-20">Stock</TableHead>
                        <TableHead className="w-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.variants.map((v: { size: string, color: string, hex: string, stock: number }, i: number) => (
                        <TableRow key={i} className="group">
                          <TableCell className="p-2"><Input className="h-8 text-xs border-none bg-transparent focus-visible:bg-white" placeholder="XL" value={v.size} onChange={e => {
                            const nv = [...formData.variants]; nv[i] = { ...nv[i], size: e.target.value }; setFormData({...formData, variants: nv});
                          }} /></TableCell>
                          <TableCell className="p-2"><Input className="h-8 text-xs border-none bg-transparent focus-visible:bg-white" placeholder="Red" value={v.color} onChange={e => {
                            const nv = [...formData.variants]; nv[i] = { ...nv[i], color: e.target.value }; setFormData({...formData, variants: nv});
                          }} /></TableCell>
                          <TableCell className="p-2">
                            <div className="flex items-center gap-2">
                              <Input className="h-8 text-[10px] border-none bg-transparent focus-visible:bg-white font-mono w-16" placeholder="#FF0000" value={v.hex} onChange={e => {
                                const nv = [...formData.variants]; nv[i] = { ...nv[i], hex: e.target.value }; setFormData({...formData, variants: nv});
                              }} />
                              {v.hex && <div className="w-3 h-3 rounded-full border shadow-sm" style={{backgroundColor: v.hex}} />}
                            </div>
                          </TableCell>
                          <TableCell className="p-2"><Input type="number" className="h-8 text-xs border-none bg-transparent focus-visible:bg-white" value={v.stock} onChange={e => {
                            const nv = [...formData.variants]; nv[i] = { ...nv[i], stock: Number(e.target.value) }; setFormData({...formData, variants: nv});
                          }} /></TableCell>
                          <TableCell className="p-2 text-right">
                            <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, idx: number) => idx !== i)})}>
                              <X className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Right: Images */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase font-bold text-primary">Product Images</Label>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setFormData({...formData, images: [...formData.images, {url: "", color: ""}]})}>
                    <Plus className="mr-1 h-3 w-3" /> Add Image Slot
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.images.map((img: { url: string, color: string }, i: number) => (
                    <Card key={i} className="border shadow-none overflow-hidden bg-muted/5">
                      <div className="p-3 space-y-3">
                        <div className="flex gap-2">
                          <Input className="text-xs" placeholder="Paste image URL here..." value={img.url} onChange={e => {
                            const ni = [...formData.images]; ni[i] = { ...ni[i], url: e.target.value }; setFormData({...formData, images: ni});
                          }} />
                          <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0 text-destructive" onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">Link to Color:</span>
                          <Select value={img.color} onValueChange={v => {
                            const ni = [...formData.images]; ni[i] = { ...ni[i], color: v }; setFormData({...formData, images: ni});
                          }}>
                            <SelectTrigger className="h-7 text-[10px] bg-white"><SelectValue placeholder="Select variant color" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">General (No Color)</SelectItem>
                              {definedColors.map((c: { name: string, hex: string }) => (
                                <SelectItem key={c.name} value={c.name}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.hex}} />
                                    {c.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {img.url && (
                          <div className="aspect-[4/3] rounded bg-muted overflow-hidden border">
                            <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button className="px-8" disabled={mutation.isPending} onClick={() => mutation.mutate(formData)}>
              {mutation.isPending ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Finalize & Publish</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderManagement({ orders }: { orders?: Order[] }) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      fetcher(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order status updated");
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales & Operations</h2>
          <p className="text-sm text-muted-foreground">Manage order fullfillment and track customer payments.</p>
        </div>
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none font-bold px-4 py-1.5 h-auto">
          {orders?.filter(o => o.status === 'PENDING').length || 0} Pending
        </Badge>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map(o => (
                <TableRow key={o.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-[10px] uppercase font-bold text-primary">#{o.id.split('-')[0]}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{o.user?.name || "Guest Buyer"}</span>
                      <span className="text-[10px] text-muted-foreground">{o.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {o.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="h-7 w-7 rounded-full border-2 border-background bg-muted overflow-hidden">
                          <img src={item.product?.images?.[0]?.url || "/placeholder.svg"} className="h-full w-full object-cover" alt="Product" />
                        </div>
                      ))}
                      {o.items.length > 3 && (
                        <div className="h-7 w-7 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[8px] font-bold">
                          +{o.items.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-sm">{formatPrice(o.totalAmount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-full text-[9px] uppercase font-bold px-2.5 py-0.5",
                      o.status === 'PAID' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none" : 
                      o.status === 'PENDING' ? "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none" : 
                      "bg-red-100 text-red-700 hover:bg-red-100 border-none"
                    )}>
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateMutation.mutate({ id: o.id, status: 'PAID' })}>Set as Paid</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateMutation.mutate({ id: o.id, status: 'SHIPPED' })}>Set as Shipped</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateMutation.mutate({ id: o.id, status: 'CANCELLED' })}>Cancel Order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerManagement({ users }: { users?: User[] }) {
  const queryClient = useQueryClient();
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string, role: string }) => 
      fetcher(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("User role updated");
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Community</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage registered customers and their privileges.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 h-auto font-bold text-primary border-primary/20 bg-primary/5">
          {users?.length || 0} Total Members
        </Badge>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map(u => (
                <TableRow key={u.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                      {u.email[0].toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{u.name || "Guest Buyer"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'ADMIN' ? 'secondary' : 'outline'} className="text-[10px] uppercase font-bold tracking-widest px-3">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(u.createdAt!).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest">Update Privileges</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ id: u.id, role: 'ADMIN' })}>
                          <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ id: u.id, role: 'USER' })}>
                          <UsersIcon className="mr-2 h-4 w-4" /> Make Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CMSBannerManagement() {
  const queryClient = useQueryClient();
  const { data: remoteBanners, isLoading } = useQuery({
    queryKey: ['settings', 'hero_banners'],
    queryFn: () => fetcher<Banner[]>('/settings/hero_banners'),
  });

  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    if (remoteBanners) setBanners(remoteBanners);
  }, [remoteBanners]);

  const saveMutation = useMutation({
    mutationFn: (newBanners: Banner[]) => 
      fetcher('/settings/hero_banners', { method: 'POST', body: JSON.stringify({ value: newBanners }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'hero_banners'] });
      toast.success("Hero section updated globally!");
    },
  });

  const addBanner = () => {
    if (banners.length < 5) {
      setBanners([...banners, { id: Date.now(), url: "", title: "", subtitle: "", highlight: "" }]);
    } else {
      toast.error("Maximum 5 banners allowed");
    }
  };

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading CMS data...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Storefront CMS</h3>
          <p className="text-sm text-muted-foreground">Customize the high-impact visual banners on your homepage.</p>
        </div>
        <Button onClick={addBanner} disabled={banners.length >= 5} variant="secondary">
          <Plus className="mr-2 h-4 w-4" /> Add Banner Slide
        </Button>
      </div>

      <div className="grid gap-8">
        {banners.map((banner, index) => (
          <Card key={banner.id} className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-primary/20 w-full" />
            <CardHeader className="bg-muted/30 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Banner Slide #{index + 1}</CardTitle>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-red-50" onClick={() => setBanners(banners.filter(b => b.id !== banner.id))}>
                <Trash2 className="h-4 w-4 mr-2" /> Remove Slide
              </Button>
            </CardHeader>
            <CardContent className="pt-8 grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                <div className="grid gap-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">Banner Image URL</Label>
                  <Input placeholder="https://source.unsplash.com/..." value={banner.url} onChange={e => {
                    const nb = [...banners];
                    nb[index] = { ...nb[index], url: e.target.value };
                    setBanners(nb);
                  }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest font-bold">Main Title</Label>
                    <Input placeholder="e.g. New Year" value={banner.title} onChange={e => {
                      const nb = [...banners];
                      nb[index] = { ...nb[index], title: e.target.value };
                      setBanners(nb);
                    }} />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs uppercase tracking-widest font-bold">Subtitle</Label>
                    <Input placeholder="e.g. 2026 Collection" value={banner.subtitle} onChange={e => {
                      const nb = [...banners];
                      nb[index] = { ...nb[index], subtitle: e.target.value };
                      setBanners(nb);
                    }} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">Highlight Text (Accent)</Label>
                  <Input placeholder="e.g. SALE" value={banner.highlight} onChange={e => {
                    const nb = [...banners];
                    nb[index] = { ...nb[index], highlight: e.target.value };
                    setBanners(nb);
                  }} />
                </div>
              </div>
              <div className="aspect-[16/9] bg-muted rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border group relative overflow-hidden shadow-inner">
                {banner.url ? (
                  <>
                    <img src={banner.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold uppercase tracking-[0.3em]">Live Preview</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-xs text-muted-foreground font-medium">1920 x 1080 Recommended</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end sticky bottom-8 pt-4">
        <Button size="lg" className="px-16 py-8 text-lg font-serif shadow-xl hover:shadow-2xl transition-all" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate(banners)}>
          {saveMutation.isPending ? "Syncing..." : <><Save className="mr-3 h-6 w-6" /> Deploy Changes</>}
        </Button>
      </div>
    </div>
  );
}

interface SiteSettingsData {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  contactEmail: string;
  instagramUrl: string;
  whatsappNumber: string;
}

function SiteSettings() {
  const queryClient = useQueryClient();
  const { data: siteInfo, isLoading } = useQuery({
    queryKey: ['settings', 'site_info'],
    queryFn: () => fetcher<SiteSettingsData>('/settings/site_info'),
  });

  const [settings, setSettings] = useState<SiteSettingsData>({
    siteName: "Byher Boutique",
    siteDescription: "Premium Modest Fashion",
    maintenanceMode: false,
    contactEmail: "hello@byher.id",
    instagramUrl: "@byher.official",
    whatsappNumber: "+628123456789"
  });

  useEffect(() => {
    if (siteInfo) setSettings(siteInfo);
  }, [siteInfo]);

  const saveMutation = useMutation({
    mutationFn: (val: SiteSettingsData) => fetcher('/settings/site_info', { method: 'POST', body: JSON.stringify({ value: val }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'site_info'] });
      toast.success("Site settings updated");
    }
  });

  if (isLoading) return <div className="p-12 text-center">Loading site info...</div>;

  return (
    <div className="max-w-4xl space-y-10 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">Site Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage your brand's global presence and technical settings.</p>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="text-sm font-bold flex items-center"><Globe className="mr-2 h-4 w-4" /> Brand Identity</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Store Name</Label>
                <Input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Support Email</Label>
                <Input value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Brand Slogan/Description</Label>
              <Textarea value={settings.siteDescription} onChange={e => setSettings({...settings, siteDescription: e.target.value})} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="text-sm font-bold flex items-center"><MessageCircle className="mr-2 h-4 w-4" /> Social & Support</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="flex items-center"><Instagram className="mr-2 h-3 w-3" /> Instagram Handle</Label>
                <Input value={settings.instagramUrl} onChange={e => setSettings({...settings, instagramUrl: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center"><MessageCircle className="mr-2 h-3 w-3" /> WhatsApp Number</Label>
                <Input value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm border-orange-100 bg-orange-50/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full text-orange-600"><Settings className="h-6 w-6" /></div>
              <div>
                <p className="font-bold text-sm text-orange-900">Maintenance Mode</p>
                <p className="text-xs text-orange-700">When enabled, customers will see a 'Coming Soon' page.</p>
              </div>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={v => setSettings({...settings, maintenanceMode: v})} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" className="px-12" onClick={() => saveMutation.mutate(settings)}>
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}

function RecentOrders({ orders }: { orders?: Order[] }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/10">
        <CardTitle className="text-lg">Real-time Orders</CardTitle>
        <CardDescription>Track every transaction as it happens.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className="group cursor-pointer hover:bg-muted/20">
                <TableCell className="font-mono text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary transition-colors">{order.id.split('-')[0]}</TableCell>
                <TableCell className="text-xs font-medium">{order.user?.name || order.user?.email}</TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                    order.status === 'PAID' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-sm">{formatPrice(order.totalAmount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
