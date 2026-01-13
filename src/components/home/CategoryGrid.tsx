import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import categoryAccessories from "@/assets/category-accessories.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

// Fallback images map based on slugs
const CATEGORY_IMAGES: Record<string, string> = {
  "hijab": product3,
  "outfit": product2,
  "accessories": categoryAccessories,
};

export function CategoryGrid() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetcher<Category[]>("/categories"),
  });

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container mx-auto">
           <div className="text-center mb-8">
             <Skeleton className="h-4 w-32 mx-auto mb-2" />
             <Skeleton className="h-10 w-48 mx-auto" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
             {[1, 2, 3].map((i) => (
               <Skeleton key={i} className="aspect-[4/5] md:aspect-[3/4] rounded-lg" />
             ))}
           </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
       <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container mx-auto text-center text-red-500">
          Failed to load categories. Please try again later.
        </div>
      </section>
    );
  }

  const displayCategories = categories || [];

  return (
    <section className="py-12 lg:py-16 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
            Shop by Category
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Koleksi Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {displayCategories.map((category, index) => {
            // Determine image source: API image (if we add it later) or local fallback
            const imageSrc = CATEGORY_IMAGES[category.slug.toLowerCase()] || product3;
            
            return (
              <Link
                key={category.id}
                to={`/collections/${category.slug}`}
                className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <img
                  src={imageSrc}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-medium">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm mt-1 group-hover:underline">
                    Lihat Koleksi →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
