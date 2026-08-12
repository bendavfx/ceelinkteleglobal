import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageCheck, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Tripple Gadgets — Trusted Gadget Store in Nigeria" },
      {
        name: "description",
        content:
          "Tripple Gadgets sells verified laptops, phones and wearables across Nigeria with honest condition reports and nationwide delivery.",
      },
      { property: "og:title", content: "About Tripple Gadgets" },
      {
        property: "og:description",
        content: "Verified devices, honest condition reports, nationwide delivery in Nigeria.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Every device inspected",
    body: "Battery health, screen, ports and performance are checked before a product goes live on the site.",
  },
  {
    icon: CheckCircle2,
    title: "Honest availability",
    body: "If it is sold out, we say sold out. Availability on the site mirrors what is physically in the store.",
  },
  {
    icon: PackageCheck,
    title: "Careful delivery",
    body: "Devices ship padded and sealed, with 24-hour delivery in Lagos and 1–3 days nationwide.",
  },
  {
    icon: Users,
    title: "Real human support",
    body: "One WhatsApp message reaches a person who knows the stock, not a bot script.",
  },
];

function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-3xl">
        <p className="eyebrow text-brand">Since 2019</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Gadgets you can trust, priced in Naira
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tripple Gadgets started as a small counter selling business laptops to students and
          freelancers in Lagos. Today we supply premium laptops, iPhones and wearables to customers
          in every state — with the same rule we began with: describe the device exactly as it is.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {VALUES.map((value) => (
          <div key={value.title} className="rounded-lg border border-border bg-card p-6">
            <value.icon className="size-6 text-brand" />
            <h2 className="mt-4 font-display text-lg font-bold">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 rounded-xl bg-ink p-8 text-ink-foreground sm:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-bold text-brand">5,000+</p>
          <p className="mt-1 text-sm text-ink-muted">Devices delivered nationwide</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold text-brand">36</p>
          <p className="mt-1 text-sm text-ink-muted">States we ship to</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold text-brand">24 hrs</p>
          <p className="mt-1 text-sm text-ink-muted">Lagos delivery window</p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/shop">Browse the store</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Talk to us</Link>
        </Button>
      </div>
    </div>
  );
}
