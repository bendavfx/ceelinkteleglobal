import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";

import { AvailabilityBadge } from "@/components/store/AvailabilityBadge";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart";
import { isPurchasable, productQuery, productsQuery } from "@/lib/catalog";
import { NGN, whatsappLink } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — Tripple Gadgets" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const description =
      product.short_description ?? `${product.name} available at Tripple Gadgets Nigeria.`;
    return {
      meta: [
        { title: `${product.name} — ${NGN(product.price)} | Tripple Gadgets` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} — Tripple Gadgets` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery());
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const gallery = product.gallery.length
    ? product.gallery
    : product.image_url
      ? [product.image_url]
      : [];
  const buyable = isPurchasable(product.availability);
  const related = products
    .filter((item) => item.id !== product.id && item.category_id === product.category_id)
    .slice(0, 4);

  const addToCart = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image_url,
        preorder: product.availability === "preorder",
      },
      quantity,
    );
    toast.success("Added to cart", { description: `${quantity} × ${product.name}` });
  };

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link to="/shop" className="hover:text-brand">
          Shop
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {gallery[activeImage] ? (
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="aspect-4/3 w-full object-cover"
              />
            ) : null}
          </div>
          {gallery.length > 1 ? (
            <div className="flex gap-3">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "size-20 overflow-hidden rounded-md border",
                    index === activeImage ? "border-brand" : "border-border",
                  )}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AvailabilityBadge availability={product.availability} />
              {product.brand ? (
                <span className="eyebrow text-muted-foreground">{product.brand}</span>
              ) : null}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.short_description ? (
              <p className="text-muted-foreground">{product.short_description}</p>
            ) : null}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">{NGN(product.price)}</span>
            {product.previous_price && product.previous_price > product.price ? (
              <span className="text-lg text-muted-foreground line-through">
                {NGN(product.previous_price)}
              </span>
            ) : null}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border border-input">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <Button className="flex-1 min-w-40" disabled={!buyable} onClick={addToCart}>
                <ShoppingCart className="size-4" />
                {product.availability === "preorder" ? "Pre-order now" : "Add to cart"}
              </Button>
              <Button
                variant="outline"
                onClick={() => toggle(product.slug)}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={cn("size-4", has(product.slug) && "fill-destructive text-destructive")}
                />
                Wishlist
              </Button>
            </div>

            {!buyable ? (
              <p className="rounded-md border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                This item is currently unavailable. Message us on WhatsApp and we'll tell you when
                it's back.
              </p>
            ) : null}

            <Button variant="secondary" className="w-full" asChild>
              <a
                href={whatsappLink(`Hello Tripple Gadgets, I'm interested in: ${product.name}`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                Enquire on WhatsApp
              </a>
            </Button>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-card p-5 text-sm">
            <p className="flex items-start gap-2">
              <Truck className="mt-0.5 size-4 shrink-0 text-brand" />
              Delivery within Lagos in 24 hours, 1–3 working days nationwide.
            </p>
            <p className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
              {product.warranty ?? "Inspected before dispatch. Condition stated exactly as it is."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold">Description</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
          {product.condition_note ? (
            <div className="mt-5 rounded-lg border border-brand/40 bg-brand/10 p-4 text-sm">
              <h3 className="eyebrow text-brand-foreground">Condition & status</h3>
              <p className="mt-2">{product.condition_note}</p>
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="text-xl font-bold">Specifications</h2>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
            {product.specifications.map((spec) => (
              <li key={spec} className="px-4 py-3 text-sm">
                {spec}
              </li>
            ))}
            <li className="px-4 py-3 text-sm text-muted-foreground">
              Units available: {product.stock}
            </li>
          </ul>
        </section>
      </div>

      {related.length ? (
        <section className="mt-14">
          <h2 className="text-xl font-bold">Related products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
