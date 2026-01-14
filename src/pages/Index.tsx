import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Features } from "@/components/home/Features";
import { Newsletter } from "@/components/home/Newsletter";
import { Preloader } from "@/components/layout/Preloader";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Global variable to track if preloader has played since the last hard refresh
let hasPlayedIntro = false;

const Index = () => {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();
  
  // Preloader should NOT show if:
  // 1. It has already played in this session
  // 2. The user is logged in (Buyer or Admin)
  const shouldSkipIntro = hasPlayedIntro || isAuthenticated || isAdminAuthenticated;
  
  const [isLoading, setIsLoading] = useState(!shouldSkipIntro);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    hasPlayedIntro = true;
  }, []);

  // Safety: Force loading to false after 6 seconds no matter what
  useEffect(() => {
    if (!shouldSkipIntro) {
      const timer = setTimeout(() => {
        handleLoadingComplete();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [shouldSkipIntro, handleLoadingComplete]);

  return (
    <>
      {!shouldSkipIntro && <Preloader onComplete={handleLoadingComplete} />}
      
      <div className={cn(
        "min-h-screen flex flex-col",
        isLoading ? "hidden" : "block"
      )}>
        <Header />
        
        <main className="flex-1">
          <HeroSection />
          
          <ProductGrid
            title="Best Seller"
            subtitle="Favorit Pelanggan"
            viewAllHref="/collections/best-seller"
          />
          
          <CategoryGrid />
          
          <ProductGrid
            title="New Arrival"
            subtitle="Koleksi Terbaru"
            viewAllHref="/collections/new-arrival"
          />
          
          <Features />
          
          <Newsletter />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
