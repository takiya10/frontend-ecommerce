import { ShoppingBag, Search, User, Menu, X, Heart, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import logoImage from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/collections/all" },
  { label: "Journal", href: "/journal" },
  { label: "Store Location", href: "/store-location" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
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
              <Button variant="icon" size="icon" className="text-nav-foreground">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="icon" size="icon" className="text-nav-foreground relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sale text-sale-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
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
              <Button variant="icon" size="icon" className="text-nav-foreground">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="icon" size="icon" className="text-nav-foreground">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="icon" size="icon" className="text-nav-foreground">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="icon" size="icon" className="text-nav-foreground relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sale text-sale-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
          </nav>
        </div>
      </div>
    </header>
  );
}
