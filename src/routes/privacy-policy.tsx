import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/store/PolicyPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Tripple Gadgets" },
      {
        name: "description",
        content:
          "What personal data Tripple Gadgets collects, how we use it for orders and delivery, and the choices you have over your information.",
      },
      { property: "og:title", content: "Privacy policy — Tripple Gadgets" },
      {
        property: "og:description",
        content: "How we collect, use and protect your personal information.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Your data"
      title="Privacy policy"
      intro="We collect the minimum information needed to sell you a device and get it delivered safely."
      sections={[
        {
          heading: "What we collect",
          body: (
            <p>
              Your name, phone number, email address and delivery address when you place an order,
              plus basic usage data such as pages viewed to improve the store.
            </p>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <p>
              To confirm orders, arrange delivery, provide support, and send order updates. We do not
              sell or rent your personal information to anyone.
            </p>
          ),
        },
        {
          heading: "Payments",
          body: (
            <p>
              Card payments are processed by our payment provider. Full card details never reach our
              servers and are not stored by Tripple Gadgets.
            </p>
          ),
        },
        {
          heading: "Cookies and local storage",
          body: (
            <p>
              We store your cart and wishlist in your browser so they survive a page refresh. No
              advertising trackers are used.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>
              You can request a copy of your data or ask us to delete it by emailing
              hello@tripplegadgets.ng. We respond within 7 working days.
            </p>
          ),
        },
      ]}
    />
  );
}
