import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from "@/hooks/useSiteSettings";

const footerLinks = {
  shop: [
    { label: "New Arrival", href: "/collections/new-arrival" },
    { label: "Best Seller", href: "/collections/best-seller" },
    { label: "Hijab", href: "/collections/hijab" },
    { label: "Outfit", href: "/collections/outfit" },
    { label: "Prayer Set", href: "/collections/prayer-set" },
    { label: "Sale", href: "/collections/sale" },
  ],
  help: [
    { label: "Cara Order", href: "/pages/cara-order" },
    { label: "Pengiriman", href: "/pages/pengiriman" },
    { label: "Pengembalian", href: "/pages/pengembalian" },
    { label: "FAQ", href: "/pages/faq" },
    { label: "Hubungi Kami", href: "/pages/kontak" },
  ],
  about: [
    { label: "Tentang Kami", href: "/pages/tentang-kami" },
    { label: "Karir", href: "/pages/karir" },
    { label: "Kebijakan Privasi", href: "/pages/privasi" },
    { label: "Syarat & Ketentuan", href: "/pages/syarat-ketentuan" },
  ],
};

export function Footer() {
  const { data: settings } = useSiteSettings();
  const config = settings || DEFAULT_SITE_SETTINGS;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <img src={logoImage} alt={config.siteName} className="h-14 brightness-0 invert" />
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80 leading-relaxed">
              {config.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={`https://instagram.com/${config.instagramUrl.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Bantuan</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{config.whatsappNumber}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{config.contactEmail}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} {config.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
