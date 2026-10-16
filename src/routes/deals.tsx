import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { productsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/deals")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQuery());
  },
  head: () => ({
    meta: [
      { title: "Gadget Deals & Price Drops — CEELINKSTELEGLOBAL Nigeria" },
      {
        name: "description",
        content:
          "Current price drops on laptops, phones and smartwatches at CEELINKSTELEGLOBAL. Limited units, real discounts, Naira prices.",
      },
      { property: "og:title", content: "Deals & price drops — CEELINKSTELEGLOBAL" },
      {
        property: "og:description",
        content: "Discounted laptops, phones and watches while stock lasts.",
      },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const deals = products.filter(
    (product) => product.previous_price && product.previous_price > product.price,
  );

  return (
    <div className="container-page py-12">
      <p className="eyebrow text-brand">Limited units</p>
      <h1 className="mt-1 text-3xl font-bold">Deals & price drops</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Devices currently selling below their usual price. When a unit goes, the deal goes with it.
      </p>

      {deals.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
          <h2 className="font-display text-lg font-bold">No active deals right now</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            New price drops land regularly — check the full shop in the meantime.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/shop">Browse all products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
