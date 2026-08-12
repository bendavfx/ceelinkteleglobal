import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Tripple Gadgets" },
      {
        name: "description",
        content:
          "The terms that apply when you buy from Tripple Gadgets: pricing, availability, warranty, pre-orders and liability.",
      },
      { property: "og:title", content: "Terms & conditions — Tripple Gadgets" },
      {
        property: "og:description",
        content: "Pricing, availability, warranty and pre-order terms.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & conditions"
      intro="By placing an order with Tripple Gadgets you agree to the terms below."
      sections={[
        {
          heading: "Pricing",
          body: (
            <p>
              All prices are in Nigerian Naira and include VAT where applicable. Prices can change
              without notice, but the price shown when your order is confirmed is the price you pay.
            </p>
          ),
        },
        {
          heading: "Availability",
          body: (
            <p>
              Stock is limited and sells quickly. If an item becomes unavailable after you order, we
              offer an equivalent device or a full refund.
            </p>
          ),
        },
        {
          heading: "Warranty",
          body: (
            <p>
              Warranty length is stated on each product page and covers functional faults only. It
              does not cover physical damage, liquid damage or third-party repairs.
            </p>
          ),
        },
        {
          heading: "Pre-orders",
          body: (
            <p>
              Pre-order payments reserve a unit from an incoming batch. Estimated arrival dates are
              indicative; you may cancel for a full refund before dispatch.
            </p>
          ),
        },
        {
          heading: "Liability",
          body: (
            <p>
              Our liability for any order is limited to the amount paid for that order. We are not
              liable for indirect losses such as lost income or data.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about these terms? Email hello@tripplegadgets.ng or message 0903 414 2029.
            </p>
          ),
        },
      ]}
    />
  );
}
