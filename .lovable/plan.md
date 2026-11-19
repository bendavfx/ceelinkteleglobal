# MTiTech storefront update

Keep the existing store, products, layout, and working checkout. Apply the PDF's exact brand spelling across existing pages, then add missing customer-facing discovery and support features: new arrivals, pre-orders, saved products, FAQs, product video playback, and private order tracking. Extend existing order management only as needed to save courier/tracking details for customer tracking. Keep the current visual system, avoid invented store facts, and do not add paid services or payments.

## Technical details

- Reuse existing catalog queries, product cards, wishlist storage, order records, and admin access patterns.
- Add a narrowly scoped server-side order lookup requiring both the order reference and matching customer email; return only customer-safe order status, item summary, and courier tracking fields.
- Add additive order tracking fields through the project's database migration workflow, with admin-only writes enforced by the existing order access controls.
- Give each new content route unique title, description, Open Graph, and Twitter metadata.
- Verify the new routes, product video area, and order lookup input behavior; retain existing URLs and checkout behavior.