import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Tripple Gadgets — WhatsApp, Call or Visit" },
      {
        name: "description",
        content:
          "Reach Tripple Gadgets on WhatsApp at 0903 414 2029, call us, email hello@tripplegadgets.ng or visit our Lagos store.",
      },
      { property: "og:title", content: "Contact Tripple Gadgets" },
      {
        property: "og:description",
        content: "WhatsApp, call, email or visit our Lagos store — we reply fast.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const sendToWhatsApp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      toast.error("Add a short message first");
      return;
    }
    window.open(
      whatsappLink(`Hello Tripple Gadgets, my name is ${name || "a customer"}. ${message}`),
      "_blank",
      "noreferrer",
    );
  };

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          WhatsApp gets the fastest reply — usually within minutes during opening hours.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={sendToWhatsApp}
          className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-card"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Chinedu Okafor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">How can we help?</Label>
            <Textarea
              id="message"
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="I'd like to know if the MacBook Pro is still available…"
            />
          </div>
          <Button type="submit" className="w-full">
            <MessageCircle className="size-4" />
            Send via WhatsApp
          </Button>
          <p className="text-xs text-muted-foreground">
            Your message opens in WhatsApp so you keep a copy of the conversation.
          </p>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Reach us directly</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                <a href="tel:+2349034142029" className="hover:text-brand">
                  0903 414 2029
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                <a href="mailto:hello@tripplegadgets.ng" className="hover:text-brand">
                  hello@tripplegadgets.ng
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                Computer Village, Ikeja, Lagos, Nigeria
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
                Mon–Sat, 9am – 7pm WAT
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-brand/40 bg-brand/10 p-6 text-sm">
            <h2 className="font-display text-base font-bold">Buying for a team?</h2>
            <p className="mt-2 text-muted-foreground">
              We handle bulk laptop orders for offices and schools with invoicing on request.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
