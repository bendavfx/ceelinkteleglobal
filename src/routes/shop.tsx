import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AVAILABILITY_LABEL,
  categoriesQuery,
  productsQuery,
  type Availability,
} from "@/lib/catalog";
import { NGN } from "@/lib/format";

type ShopSearch = {
  q?: string | undefined;
  category?: string | undefined;
  brand?: string | undefined;
  availability?: string | undefined;
  sort?: string | undefined;
  max?: number | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    brand: typeof search["brand"] === "string" ? search["brand"] : undefined,
    availability:
      typeof search["availability"] === "string" ? search["availability"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    max: Number.isFinite(Number(search["max"])) && search["max"] !== undefined
      ? Number(search["max"])
      : undefined,
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Shop All Gadgets — Tripple Gadgets Nigeria" },
      {
        name: "description",
        content:
          "Browse every laptop, phone and smartwatch in stock. Filter by category, brand, price and availability, all priced in Naira.",
      },
      { property: "og:title", content: "Shop all gadgets — Tripple Gadgets" },
      {
        property: "og:description",
        content: "Filter laptops, phones and watches by brand, price and availability.",
      },
    ],
  }),
  component: ShopPage,
});

const PAGE_SIZE = 8;

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const [visible, setVisible] = useState(PAGE_SIZE);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[],
    [products],
  );
  const maxPrice = useMemo(
    () => products.reduce((max, p) => Math.max(max, p.price), 0),
    [products],
  );

  const setSearch = (patch: Partial<ShopSearch>) => {
    setVisible(PAGE_SIZE);
    navigate({ search: (prev) => ({ ...prev, ...patch }) });
  };

  const categoryId = categories.find((c) => c.slug === search.category)?.id;

  const filtered = useMemo(() => {
    const query = (search.q ?? "").trim().toLowerCase();
    const result = products.filter((product) => {
      if (query && !`${product.name} ${product.brand ?? ""}`.toLowerCase().includes(query))
        return false;
      if (categoryId && product.category_id !== categoryId) return false;
      if (search.brand && product.brand !== search.brand) return false;
      if (search.availability && product.availability !== search.availability) return false;
      if (search.max && product.price > search.max) return false;
      return true;
    });

    switch (search.sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "popular":
        return [...result].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
      default:
        return [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  }, [products, search, categoryId]);

  const hasFilters =
    search.q || search.category || search.brand || search.availability || search.max;

  return (
    <div className="container-page py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">Shop</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop all gadgets</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} available
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={search.sort ?? "newest"} onValueChange={(sort) => setSearch({ sort })}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-lg border border-border bg-card p-5 h-fit">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-brand" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wider">Filters</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shop-search">Search</Label>
            <Input
              id="shop-search"
              value={search.q ?? ""}
              placeholder="MacBook, iPhone…"
              onChange={(event) => setSearch({ q: event.target.value || undefined })}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={search.category ?? "all"}
              onValueChange={(value) =>
                setSearch({ category: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Brand</Label>
            <Select
              value={search.brand ?? "all"}
              onValueChange={(value) => setSearch({ brand: value === "all" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Availability</Label>
            <Select
              value={search.availability ?? "all"}
              onValueChange={(value) =>
                setSearch({ availability: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any availability</SelectItem>
                {(Object.keys(AVAILABILITY_LABEL) as Availability[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {AVAILABILITY_LABEL[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-price">Max price: {NGN(search.max ?? maxPrice)}</Label>
            <input
              id="max-price"
              type="range"
              min={50000}
              max={maxPrice}
              step={10000}
              value={search.max ?? maxPrice}
              onChange={(event) => setSearch({ max: Number(event.target.value) })}
              className="w-full accent-brand"
            />
          </div>

          {hasFilters ? (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate({ search: { sort: search.sort } })}
            >
              <X className="size-4" /> Clear filters
            </Button>
          ) : null}
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <h2 className="font-display text-lg font-bold">No products match those filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your price range or clearing the filters.
              </p>
              <Button className="mt-5" onClick={() => navigate({ search: {} })}>
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.slice(0, visible).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {visible < filtered.length ? (
                <div className="mt-8 text-center">
                  <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more products
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
