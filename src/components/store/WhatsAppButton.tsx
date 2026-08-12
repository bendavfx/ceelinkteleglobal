import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/lib/format";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hello Tripple Gadgets, I would like to make an enquiry.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Tripple Gadgets on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
