import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery Information — CEELINKSTELEGLOBAL Nigeria" },
      {
        name: "description",
        content:
          "Delivery timelines and fees for Lagos and nationwide orders, plus how pay-on-delivery and dispatch tracking work.",
      },
      { property: "og:title", content: "Delivery information — CEELINKSTELEGLOBAL" },
      {
        property: "og:description",
        content: "Lagos in 24 hours, nationwide in 1–3 working days.",
      },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <PolicyPage
      eyebrow="Shipping"
      title="Delivery information"
      intro="We dispatch every order the same working day when payment or confirmation is received before 3pm WAT."
      sections={[
        {
          heading: "Lagos deliveries",
          body: (
            <p>
              Same-day or next-day delivery within Lagos, typically inside 24 hours. Delivery fees
              start from ₦2,500 depending on your area and are confirmed before dispatch.
            </p>
          ),
        },
        {
          heading: "Nationwide deliveries",
          body: (
            <p>
              We ship to all 36 states and the FCT through vetted courier partners. Delivery takes
              1–3 working days and fees start from ₦5,000 based on destination and device size.
            </p>
          ),
        },
        {
          heading: "Pay on delivery",
          body: (
            <p>
              Pay-on-delivery is available for selected Lagos areas. For other locations we confirm
              payment before dispatch to protect both sides.
            </p>
          ),
        },
        {
          heading: "Tracking your order",
          body: (
            <p>
              Once your device leaves the store we send you the courier details and a tracking
              reference on WhatsApp. Message us any time for a live status update.
            </p>
          ),
        },
        {
          heading: "Pre-orders",
          body: (
            <p>
              Pre-order items ship as soon as the batch lands, usually within 7–14 days. We keep you
              updated at every stage and refund in full if the batch is cancelled.
            </p>
          ),
        },
      ]}
    />
  );
}
