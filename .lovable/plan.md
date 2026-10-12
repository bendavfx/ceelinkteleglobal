# CEELINKSTELEGLOBAL storefront upgrade

## Goal
Upgrade the current store in place, preserving its existing colors, typography, product records, and working pages while implementing real order capture and administrator workflows.

## Work
1. Update store branding and page metadata across the existing site, show “WE BUY • WE SELL • WE SWAP!” on the homepage, and remove non-database buyer claims and inert subscription controls.
2. Improve live catalog discovery with name/brand/model search, full category/brand/status filters, min/max price, four requested sort modes, clear filters, and responsive loading/error/empty states. Keep availability and stock rules consistent in the cart and product view.
3. Add a database-backed checkout and order flow: validate customer and fulfilment details, re-read current product prices/availability server-side, persist immutable order item snapshots and unique references, omit delivery fees from subtotal, and preserve orders if WhatsApp or email fails. Include duplicate-request protection and auditable status history.
4. Add an authenticated admin experience using the existing admin role/RLS model for product create/edit/status/price/stock/media actions, plus searchable order details and persistent status updates. Product deletion will not erase order snapshots.
5. Store media in a private, admin-managed upload area. Prepare owner email/WhatsApp settings as explicit configuration, not invented contact details. App email sending requires the sender domain setup before it can be enabled.
6. Verify the main browsing/cart/checkout/admin flows where the current preview permits, confirm the project builds, and list any real-world setup still needed.

## Technical approach
- Preserve the current TanStack Start, Supabase client, and design tokens; use additive database migrations with explicit grants and row-level policies.
- Public checkout uses a validated server function and server-side product lookup; admin writes remain protected by authenticated role checks and database policies.
- Keep order products as historical snapshots rather than cascading references to live catalog rows.
- No payment gateway, invented contact details, sample orders, fake success states, or store redesign.
