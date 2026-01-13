import { ShoppingBag, Search, User, Menu, X, Heart, ChevronRight, Calculator, Calendar, CreditCard, Settings, Smile } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

// Mock products for search
const mockProducts = [
  {
    id: "1",
    name: "Floure Embroidery Set Dessert Taupe L-XL Series",
    slug: "floure-embroidery-set-dessert-taupe",
    price: 429000,
    image: product1,
  },
  {
    id: "2",
    name: "Sage Piping Dress with Belt",
    slug: "sage-piping-dress",
    price: 389000,
    image: product2,
  },
  {
    id: "3",
    name: "Dusty Rose Modest Set",
    slug: "dusty-rose-modest-set",
    price: 419000,
    image: product3,
  },
  {
    id: "4",
    name: "Embroidered Cream Elegant Dress",
    slug: "embroidered-cream-elegant-dress",
    price: 549000,
    image: product4,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/collections/all" },
  { label: "Journal", href: "/journal" },
  { label: "Store Location", href: "/store-location" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearch((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpenSearch(false);
    command();
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-announcement text-announcement-foreground py-2 overflow-hidden">
        <div className="marquee flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-xs font-medium tracking-wide">
              EXCLUSIVE PRICE ONLY ON WEBSITE • Free Shipping • Free Returns •
            </span>
          ))}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-nav">
        <div className="container mx-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-14 lg:hidden">
            <Button
              variant="icon"
              size="icon"
              className="text-nav-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Byher" className="h-10 brightness-0 invert" />
            </Link>

            <div className="flex items-center gap-2">
              <Button 
                variant="icon" 
                size="icon" 
                className="text-nav-foreground"
                onClick={() => setOpenSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/cart">
                <Button variant="icon" size="icon" className="text-nav-foreground relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-sale text-sale-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-14">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Byher" className="h-12 brightness-0 invert" />
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <Button variant="nav" size="sm">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="icon" 
                size="icon" 
                className="text-nav-foreground"
                onClick={() => setOpenSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/login">
                <Button variant="icon" size="icon" className="text-nav-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="icon" size="icon" className="text-nav-foreground relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-sale text-sale-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="icon" size="icon" className="text-nav-foreground relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-sale text-sale-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Command Dialog */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput 
          placeholder="Cari produk..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
          
          <CommandGroup heading="Produk">
            {mockProducts.map((product) => (
              <CommandItem 
                key={product.id} 
                onSelect={() => runCommand(() => navigate(`/products/${product.slug}`))}
                className="flex items-center gap-3 p-2"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-10 h-12 object-cover rounded shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{formatPrice(product.price)}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigasi">
            <CommandItem onSelect={() => runCommand(() => navigate("/collections/all"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Belanja Semua</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/wishlist"))}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/journal"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Journal</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/login"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Masuk / Daftar</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/50 z-50 lg:hidden transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background z-50 lg:hidden transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <img src={logoImage} alt="Byher" className="h-10 brightness-0 invert" />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-3 px-4 text-foreground font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border mt-4 pt-4 space-y-1">
              <Link
                to="/wishlist"
                className="flex items-center py-3 px-4 text-foreground font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-2 bg-sale text-sale-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
               <Link
                to="/login"
                className="flex items-center py-3 px-4 text-foreground font-medium hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="mr-2 h-5 w-5" />
                Masuk
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
