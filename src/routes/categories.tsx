import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { categoriesQuery, productsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/categories")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery()),
      context.queryClient.ensureQueryData(productsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Gadget Categories — Laptops, Phones & Watches | CEELINKSTELEGLOBAL" },
      {
        name: "description",
        content:
          "Explore CEELINKSTELEGLOBAL by category: business laptops, MacBooks, iPhones, Apple Watches and everyday accessories.",
      },
      { property: "og:title", content: "Shop by category — CEELINKSTELEGLOBAL" },
      {
        property: "og:description",
        content: "Laptops, phones, smartwatches and accessories, all priced in Naira.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const { data: products } = useSuspenseQuery(productsQuery());

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Everything we stock, grouped so you can find your next device faster.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const items = products.filter((product) => product.category_id === category.id);
          return (
            <Link
              key={category.id}
              to="/shop"
              search={{ category: category.slug }}
              className="group flex flex-col justify-between rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lift"
            >
              <div>
                <h2 className="font-display text-xl font-bold group-hover:text-brand">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              </div>
              <p className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-brand">
                {items.length} {items.length === 1 ? "product" : "products"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
