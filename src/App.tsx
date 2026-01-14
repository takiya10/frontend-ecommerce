import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { fetcher } from "@/lib/api-client";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Lazy Pages
const Index = lazy(() => import("./pages/Index"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Collection = lazy(() => import("./pages/Collection"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const OrderStatus = lazy(() => import("./pages/OrderStatus"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StaticPage = lazy(() => import("./pages/StaticPage"));

const queryClient = new QueryClient();

interface SiteSettingsData {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  contactEmail: string;
  instagramUrl: string;
  whatsappNumber: string;
}

const DEFAULT_SITE_INFO: SiteSettingsData = {
  siteName: "Byher",
  siteDescription: "",
  maintenanceMode: false,
  contactEmail: "",
  instagramUrl: "",
  whatsappNumber: ""
};

const AppContent = () => {
  const { user, adminUser, isAdminAuthenticated } = useAuth();
  
  const { data: siteInfo } = useQuery({
    queryKey: ['settings', 'site_info'],
    queryFn: () => fetcher<SiteSettingsData>('/settings/site_info').catch(() => DEFAULT_SITE_INFO),
    staleTime: 60000,
  });

  const isUserAdmin = user?.role === 'ADMIN' || isAdminAuthenticated;
  const showMaintenance = siteInfo?.maintenanceMode && !isUserAdmin;

  if (showMaintenance) {
    return (
      <Suspense fallback={null}>
        <Maintenance />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"></div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/collections/:slug" element={<Collection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Profile />} />
        <Route path="/order-status" element={<OrderStatus />} />
        
        {/* Admin Routes */}
        <Route path="/byher-internal-mgmt/login" element={<Login isAdminPage={true} />} />
        <Route path="/byher-internal-mgmt" element={<AdminDashboard />} />
        
        <Route path="/pages/:slug" element={<StaticPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter 
                basename={import.meta.env.BASE_URL}
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <ScrollToTop />
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
