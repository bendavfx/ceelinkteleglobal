import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart";
import { NGN } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Tripple Gadgets" },
      {
        name: "description",
        content: "Review the gadgets in your cart, adjust quantities and see your Naira subtotal.",
      },
      { property: "og:title", content: "Your cart — Tripple Gadgets" },
      { property: "og:description", content: "Review your selected devices before checkout." },
    ],
  }),
  component: CartPage,
});

const DELIVERY_FEE = 5000;

function CartPage() {
  const { lines, subtotal, setQuantity, remove, ready } = useCart();

  if (!ready) {
    return (
      <div className="container-page py-12">
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add a device and it will stay here, even if you close the tab.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-card"
            >
              <Link
                to="/product/$slug"
                params={{ slug: line.slug }}
                className="size-24 shrink-0 overflow-hidden rounded-md bg-muted"
              >
                {line.image ? (
                  <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                ) : null}
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to="/product/$slug"
                      params={{ slug: line.slug }}
                      className="font-semibold hover:text-brand"
                    >
                      {line.name}
                    </Link>
                    {line.preorder ? (
                      <p className="text-xs font-semibold text-warning-foreground">Pre-order item</p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => remove(line.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-input">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-9 text-center text-sm font-semibold">{line.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <span className="font-display font-bold">{NGN(line.price * line.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{NGN(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery (estimate)</dt>
              <dd className="font-semibold">{NGN(DELIVERY_FEE)}</dd>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display font-bold">{NGN(subtotal + DELIVERY_FEE)}</dd>
            </div>
          </dl>
          <Button className="mt-6 w-full" disabled>
            Checkout (coming next)
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Secure Paystack checkout is being wired up. Message us on WhatsApp to complete an order
            today.
          </p>
          <Button variant="outline" className="mt-4 w-full" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
