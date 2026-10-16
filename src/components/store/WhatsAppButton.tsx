import { MessageCircle } from "lucide-react";

import { STORE_NAME, whatsappLink } from "@/lib/format";

export function WhatsAppButton() {
  const href = whatsappLink(`Hello ${STORE_NAME}, I would like to make an enquiry.`);
  if (href === "#") return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with CEELINKSTELEGLOBAL on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
