import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck, Headphones, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { NGN } from "@/lib/format";
import heroAsset from "@/assets/product2.jpg.asset.json";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Tripple Gadgets — Verified Laptops, Phones & Watches in Nigeria" },
      {
        name: "description",
        content:
          "Shop MacBooks, HP EliteBooks, iPhones and Apple Watches in Naira. Honest specifications, tested devices and nationwide delivery in Nigeria.",
      },
      { property: "og:title", content: "Tripple Gadgets — Premium gadgets, honest prices" },
      {
        property: "og:description",
        content: "Verified laptops, phones and smartwatches with nationwide delivery in Nigeria.",
      },
    ],
  }),
  component: HomePage,
});

const TRUST = [
  { icon: BadgeCheck, title: "Tested before sale", copy: "Every device is checked and described exactly as it is." },
  { icon: Truck, title: "Nationwide delivery", copy: "Lagos same-day where possible, 1–3 days elsewhere." },
  { icon: ShieldCheck, title: "No hidden specs", copy: "Lock status and condition stated on every listing." },
  { icon: Headphones, title: "Real support", copy: "Talk to a human on WhatsApp before and after you buy." },
];

const REVIEWS = [
  {
    name: "Chidera N.",
    location: "Lekki, Lagos",
    quote:
      "Bought the EliteBook for my team. It arrived the same day and the specs were exactly as listed.",
  },
  {
    name: "Yusuf A.",
    location: "Abuja",
    quote:
      "They told me upfront that the iPhone was locked. That honesty is why I'll buy again.",
  },
  {
    name: "Tolu B.",
    location: "Ibadan",
    quote: "The MacBook Pro is a beast and the price beat every other seller I checked.",
  },
];

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());

  const featured = products.filter((product) => product.is_featured).slice(0, 4);
  const deals = products.filter(
    (product) => product.previous_price && product.previous_price > product.price,
  );
  const cheapest = products.length
    ? Math.min(...products.map((product) => product.price))
    : 0;

  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="space-y-6">
            <p className="eyebrow text-brand">Nigeria's gadget plug</p>
            <h1 className="text-4xl leading-[1.05] font-bold sm:text-5xl">
              Premium devices,
              <br />
              described honestly.
            </h1>
            <p className="max-w-md text-base text-ink-muted">
              MacBooks, business laptops, iPhones and Apple Watches — inspected, priced in Naira and
              delivered anywhere in Nigeria. From {NGN(cheapest)}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/shop">Shop all devices</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-brand text-brand">
                <Link to="/deals">See today's deals</Link>
              </Button>
            </div>
            <dl className="flex gap-8 pt-2 text-sm">
              <div>
                <dt className="text-ink-muted">Devices listed</dt>
                <dd className="font-display text-xl font-bold">{products.length}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Delivery</dt>
                <dd className="font-display text-xl font-bold">Nationwide</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Support</dt>
                <dd className="font-display text-xl font-bold">WhatsApp</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-sidebar-border">
              <img
                src={heroAsset.url}
                alt="MacBook Pro 16-inch available at Tripple Gadgets"
                className="aspect-4/3 w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 rounded-lg border border-sidebar-border bg-card px-4 py-3 text-card-foreground shadow-lift">
              <p className="eyebrow text-muted-foreground">In stock now</p>
              <p className="font-display text-sm font-bold">MacBook Pro M1 Max · 64GB</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="size-5 shrink-0 text-brand" />
              <div>
                <h2 className="text-sm font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-brand">Browse</p>
            <h2 className="mt-1 text-2xl font-bold">Shop by category</h2>
          </div>
          <Link to="/categories" className="text-sm font-medium hover:text-brand">
            All categories
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const count = products.filter((p) => p.category_id === category.id).length;
            return (
              <Link
                key={category.id}
                to="/shop"
                search={{ category: category.slug }}
                className="group rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-card"
              >
                <h3 className="font-display text-lg font-bold group-hover:text-brand">
                  {category.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-4 text-xs font-semibold text-brand">
                  {count} {count === 1 ? "product" : "products"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-brand">Handpicked</p>
            <h2 className="mt-1 text-2xl font-bold">Featured products</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium hover:text-brand">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {deals.length ? (
        <section className="container-page pb-14">
          <div className="rounded-xl bg-ink p-6 text-ink-foreground md:p-10">
            <p className="eyebrow text-brand">Price drop</p>
            <h2 className="mt-1 text-2xl font-bold">Deals worth your Naira</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {deals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-page pb-14">
        <p className="eyebrow text-brand">Customers</p>
        <h2 className="mt-1 text-2xl font-bold">What buyers say</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <blockquote
              key={review.name}
              className="rounded-lg border border-border bg-card p-6 shadow-card"
            >
              <p className="text-sm leading-relaxed">“{review.quote}”</p>
              <footer className="mt-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{review.name}</span> ·{" "}
                {review.location}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="container-page pb-4">
        <div className="rounded-xl border border-border bg-card p-6 md:flex md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-xl font-bold">Get new stock alerts first</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Drop your email and we'll tell you when fresh devices land.
            </p>
          </div>
          <form
            className="mt-5 flex gap-2 md:mt-0 md:w-96"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input type="email" required placeholder="you@email.com" aria-label="Email address" />
            <Button type="submit">Notify me</Button>
          </form>
        </div>
      </section>
    </>
  );
}
