import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { AvailabilityBadge } from "@/components/store/AvailabilityBadge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { isPurchasable, type Product } from "@/lib/catalog";
import { NGN } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const buyable = isPurchasable(product.availability);
  const discount =
    product.previous_price && product.previous_price > product.price
      ? Math.round(((product.previous_price - product.price) / product.previous_price) * 100)
      : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label={product.name}
          className="block h-full w-full"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                !buyable && "opacity-70 saturate-50",
              )}
            />
          ) : null}
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          <AvailabilityBadge availability={product.availability} />
          {discount ? (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-brand-foreground">
              -{discount}%
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={has(product.slug) ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/90 text-foreground shadow-card transition-colors hover:bg-card"
        >
          <Heart className={cn("size-4", has(product.slug) && "fill-destructive text-destructive")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          {product.brand ? (
            <p className="eyebrow text-muted-foreground">{product.brand}</p>
          ) : null}
          <h3 className="text-base leading-snug font-semibold">
            <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-brand">
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold">{NGN(product.price)}</span>
            {product.previous_price && product.previous_price > product.price ? (
              <span className="text-sm text-muted-foreground line-through">
                {NGN(product.previous_price)}
              </span>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!buyable}
              onClick={() => {
                add({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image_url,
                  preorder: product.availability === "preorder",
                });
                toast.success("Added to cart", { description: product.name });
              }}
            >
              <ShoppingCart className="size-4" />
              {product.availability === "preorder" ? "Pre-order" : "Add to cart"}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/product/$slug" params={{ slug: product.slug }}>
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
