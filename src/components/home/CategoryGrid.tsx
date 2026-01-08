import { Link } from "react-router-dom";
import categoryAccessories from "@/assets/category-accessories.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const categories = [
  {
    id: "1",
    name: "Hijab",
    image: product3,
    href: "/collections/hijab",
  },
  {
    id: "2",
    name: "Outfit",
    image: product2,
    href: "/collections/outfit",
  },
  {
    id: "3",
    name: "Accessories",
    image: categoryAccessories,
    href: "/collections/accessories",
  },
];

export function CategoryGrid() {
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
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <img
                src={category.image}
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
          ))}
        </div>
      </div>
    </section>
  );
}
