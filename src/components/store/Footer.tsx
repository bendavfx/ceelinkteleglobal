import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";

const SHOP_LINKS = [
  { to: "/shop", label: "All products" },
  { to: "/categories", label: "Categories" },
  { to: "/deals", label: "Deals" },
  { to: "/cart", label: "Cart" },
] as const;

const INFO_LINKS = [
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
  { to: "/delivery", label: "Delivery information" },
  { to: "/refund-policy", label: "Refund policy" },
] as const;

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy policy" },
  { to: "/terms", label: "Terms & conditions" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-brand font-display text-sm font-bold text-brand-foreground">
              TG
            </span>
            <span className="font-display text-base font-bold">CEELINKSTELEGLOBAL</span>
          </div>
          <p className="max-w-xs text-sm text-ink-muted">
            {"WE BUY • WE SELL • WE SWAP!"}
          </p>
        </div>

        <div>
          <h2 className="eyebrow text-brand">Shop</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SHOP_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ink-muted transition-colors hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">Information</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...INFO_LINKS, ...LEGAL_LINKS].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-ink-muted transition-colors hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">Reach us</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex items-start gap-2"><Mail className="mt-0.5 size-4 shrink-0 text-brand" /><Link to="/contact" className="hover:text-brand">Contact the store</Link></li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              Lagos, Nigeria
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CEELINKSTELEGLOBAL. All rights reserved.</p>
          <p>Prices in Nigerian Naira (₦). Order requests are confirmed by the seller.</p>
        </div>
      </div>
    </footer>
  );
}
