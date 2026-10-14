<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep storefront read-only catalog queries in the existing Supabase client and route all privileged catalog/order mutations through server functions or RLS-checked authenticated clients; this prevents browser inputs or keys from crossing trust boundaries.
- Preserve historical order items as immutable product snapshots and handle stock changes atomically at order creation; this keeps records intact when catalog entries change or disappear.
