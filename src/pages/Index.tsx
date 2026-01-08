import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductGrid } from "@/components/home/ProductGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Features } from "@/components/home/Features";
import { Newsletter } from "@/components/home/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSlider />
        
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
  );
};

export default Index;
