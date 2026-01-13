import { ShoppingBag, Search, User, Menu, X, Heart, ChevronRight, Calculator, Calendar, CreditCard, Settings, Smile, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import logoImage from "@/assets/logo.png";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import { Product } from "@/types";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import product1 from "@/assets/product-1.jpg";

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
  const { user, isAuthenticated, logout } = useAuth();
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // Wait 500ms after last keystroke
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => fetcher<Product[]>(`/products?search=${debouncedSearch}`),
    enabled: debouncedSearch.length > 0,
  });

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

  const handleLogout = () => {
    logout();
    navigate("/login");
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

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="icon" size="icon" className="text-nav-foreground">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem disabled>
                      {user?.name || user?.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="icon" size="icon" className="text-nav-foreground">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

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
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch} shouldFilter={false}>
        <CommandInput 
          placeholder="Cari produk (misal: dress, taupe)..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
               <div className="flex items-center justify-center py-4">
                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
               </div>
            ) : (
               "Produk tidak ditemukan."
            )}
          </CommandEmpty>
          
          {searchResults && searchResults.length > 0 && (
            <CommandGroup heading="Produk">
              {searchResults.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => {
                    console.log("Header Search: Clicked product", product.slug);
                    runCommand(() => navigate(`/products/${product.slug}`));
                  }}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent rounded-sm transition-colors"
                >
                  <img 
                    src={product.images?.[0]?.url || product1} 
                    alt={product.name} 
                    className="w-10 h-12 object-cover rounded shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{formatPrice(product.price)}</span>
                  </div>
                </div>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          <CommandGroup heading="Navigasi">
            <CommandItem value="shop-all" onSelect={() => runCommand(() => navigate("/collections/all"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Belanja Semua</span>
            </CommandItem>
            <CommandItem value="nav-wishlist" onSelect={() => runCommand(() => navigate("/wishlist"))}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </CommandItem>
            <CommandItem value="nav-journal" onSelect={() => runCommand(() => navigate("/journal"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Journal</span>
            </CommandItem>
            <CommandItem value="nav-login" onSelect={() => runCommand(() => navigate("/login"))}>
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
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center py-3 px-4 text-foreground font-medium hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </Link>
                  <button
                    className="w-full flex items-center py-3 px-4 text-red-500 font-medium hover:bg-accent rounded-md transition-colors text-left"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center py-3 px-4 text-foreground font-medium hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Masuk
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
