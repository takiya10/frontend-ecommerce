import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StaticPage from "./pages/StaticPage";

import { AuthProvider } from "@/contexts/AuthContext";
import { Preloader } from "@/components/layout/Preloader";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Preloader onComplete={handleLoadingComplete} />
              
              <div className={cn(
                "transition-opacity duration-1000 ease-in-out",
                isLoading ? "opacity-0 h-screen overflow-hidden" : "opacity-100"
              )}>
                <Toaster />
                <Sonner />
                <BrowserRouter 
                  basename={import.meta.env.BASE_URL}
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
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
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/pages/:slug" element={<StaticPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
