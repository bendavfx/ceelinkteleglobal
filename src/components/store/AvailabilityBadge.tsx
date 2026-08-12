import { AVAILABILITY_LABEL, type Availability } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STYLES: Record<Availability, string> = {
  available: "bg-success/12 text-success border-success/25",
  preorder: "bg-warning/15 text-warning-foreground border-warning/40",
  sold_out: "bg-destructive/10 text-destructive border-destructive/25",
  out_of_stock: "bg-muted text-muted-foreground border-border",
};

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Availability;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        STYLES[availability],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}
