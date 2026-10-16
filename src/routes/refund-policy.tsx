import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Return Policy — CEELINKSTELEGLOBAL" },
      {
        name: "description",
        content:
          "How returns, refunds and device swaps work at CEELINKSTELEGLOBAL, including our 7-day fault window and what is not covered.",
      },
      { property: "og:title", content: "Refund & return policy — CEELINKSTELEGLOBAL" },
      {
        property: "og:description",
        content: "7-day fault window, clear swap rules and refund timelines.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Buyer protection"
      title="Refund & return policy"
      intro="We want you to keep the device because it works, not because you are stuck with it."
      sections={[
        {
          heading: "7-day fault window",
          body: (
            <p>
              If a device develops a fault that was not disclosed on the product page within 7 days
              of delivery, contact us on WhatsApp with a short video of the issue. We repair, swap
              or refund.
            </p>
          ),
        },
        {
          heading: "Wrong item delivered",
          body: (
            <p>
              If you receive a different model or configuration from what you ordered, we collect it
              at our cost and send the correct device immediately.
            </p>
          ),
        },
        {
          heading: "Refund timelines",
          body: (
            <p>
              Approved refunds are processed to your original payment method within 3–5 working
              days. Delivery fees are refunded only when the fault or error was ours.
            </p>
          ),
        },
        {
          heading: "What is not covered",
          body: (
            <p>
              Physical or liquid damage after delivery, unauthorised repairs, missing accessories,
              and cosmetic wear that was clearly disclosed in the condition notes.
            </p>
          ),
        },
        {
          heading: "How to start a return",
          body: (
            <p>
              Message [WhatsApp number not configured] with your order details and the issue. Keep the original
              packaging and accessories until the return is resolved.
            </p>
          ),
        },
      ]}
    />
  );
}
