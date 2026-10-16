import { createFileRoute, Link } from '@tanstack/react-router';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cart';
import { NGN, whatsappLink } from '@/lib/format';
import { submitOrderFromClient } from '@/lib/orders.functions';

export const Route = createFileRoute('/cart')({
  head: () => ({ meta: [
    { title: 'Your Cart | CEELINKSTELEGLOBAL' },
    { name: 'description', content: 'Review your gadget order and confirm delivery or pickup details.' },
    { property: 'og:title', content: 'Your Cart | CEELINKSTELEGLOBAL' },
    { property: 'og:description', content: 'Review your products and submit an order request.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQuantity, remove, ready, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [error, setError] = useState('');
  const [details, setDetails] = useState({ name: '', email: '', phone: '', state: '', city: '', address: '', landmark: '', instructions: '', pickupNotes: '' });
  const change = (key: keyof typeof details) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDetails((prev) => ({ ...prev, [key]: event.target.value }));

  const placeOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!ready || busy || !lines.length) return;
    setBusy(true);
    try {
      const saved = await submitOrderFromClient({
        idempotencyKey: window.crypto.randomUUID(), customerName: details.name, customerEmail: details.email,
        customerPhone: details.phone, fulfillment,
        ...(fulfillment === 'delivery' ? { state: details.state, city: details.city, address: details.address, landmark: details.landmark, deliveryInstructions: details.instructions } : { pickupNotes: details.pickupNotes }),
        items: lines.map((line) => ({ product_id: line.id, quantity: line.quantity })),
      });
      clear();
      toast.success(`Order ${saved.orderRef} saved`);
      if (saved.whatsappNumber) {
        const summary = [
          'CEELINKSTELEGLOBAL — WE BUY • WE SELL • WE SWAP!', `Order: ${saved.orderRef}`,
          `Customer: ${details.name}`, `Contact: ${details.phone} · ${details.email}`,
          ...lines.map((line) => `${line.name}${line.preorder ? ' (pre-order)' : ''} × ${line.quantity} — ${NGN(line.price)} each`),
          `Subtotal: ${NGN(saved.subtotal)}`, `Fulfilment: ${fulfillment}`,
          ...(fulfillment === 'delivery' ? [`Address: ${details.address}, ${details.city}, ${details.state}`, `Delivery within Lagos: ₦5,000 (indicative; final delivery fee may vary by location). Contact the seller to confirm the final delivery fee.`] : []),
          'Please review and send this message to confirm your order.',
        ].join('\n');
        window.open(whatsappLink(summary, saved.whatsappNumber), '_blank', 'noopener,noreferrer');
      }
      setError(saved.whatsappNumber ? '' : `Order saved. Add the official WhatsApp number under /admin to open the chat. Reference: ${saved.orderRef}`);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Order could not be saved. Please try again.';
      setError(message);
      toast.error('Order was not saved', { description: message });
    } finally { setBusy(false); }
  };

  if (!ready) return <div className="container-page py-12"><div className="h-40 animate-pulse rounded-lg bg-muted" /></div>;
  if (!lines.length) return <div className="container-page py-20 text-center"><h1 className="text-3xl font-bold">Your cart is empty</h1><p className="mt-3 text-muted-foreground">Browse the products currently listed in the store.</p><Button className="mt-6" asChild><Link to="/shop">Start shopping</Link></Button></div>;

  return <div className="container-page py-12">
    <h1 className="text-3xl font-bold">Your cart</h1>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]">
      <ul className="space-y-4">{lines.map((line) => <li key={line.id} className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-card">
        <Link to="/product/$slug" params={{ slug: line.slug }} className="size-24 shrink-0 overflow-hidden rounded-md bg-muted">{line.image ? <img src={line.image} alt={line.name} className="h-full w-full object-cover" /> : null}</Link>
        <div className="flex flex-1 flex-col gap-2"><div className="flex items-start justify-between gap-3"><div><Link to="/product/$slug" params={{ slug: line.slug }} className="font-semibold hover:text-brand">{line.name}</Link>{line.preorder ? <p className="text-xs font-semibold text-warning-foreground">Pre-order request</p> : null}<p className="text-sm text-muted-foreground">{NGN(line.price)} each</p></div><Button variant="ghost" size="icon" aria-label={`Remove ${line.name}`} onClick={() => remove(line.id)}><Trash2 className="size-4" /></Button></div>
          <div className="mt-auto flex items-center justify-between"><div className="flex items-center rounded-md border border-input"><Button variant="ghost" size="icon" aria-label={`Decrease ${line.name} quantity`} onClick={() => setQuantity(line.id, line.quantity - 1)}><Minus /></Button><span className="w-9 text-center text-sm font-semibold">{line.quantity}</span><Button variant="ghost" size="icon" aria-label={`Increase ${line.name} quantity`} onClick={() => setQuantity(line.id, line.quantity + 1)}><Plus /></Button></div><span className="font-display font-bold">{NGN(line.price * line.quantity)}</span></div>
        </div></li>)}</ul>
      <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-card"><h2 className="font-display text-lg font-bold">Order summary</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold">{NGN(subtotal)}</dd></div><Separator /><div className="flex justify-between text-base"><dt className="font-semibold">Items total</dt><dd className="font-display font-bold">{NGN(subtotal)}</dd></div></dl>
        <form className="mt-6 space-y-4" onSubmit={placeOrder}>
          <div className="grid grid-cols-2 gap-2"><Button type="button" variant={fulfillment === 'delivery' ? 'default' : 'outline'} onClick={() => setFulfillment('delivery')}>Delivery</Button><Button type="button" variant={fulfillment === 'pickup' ? 'default' : 'outline'} onClick={() => setFulfillment('pickup')}>Pickup</Button></div>
          <div className="space-y-3"><div><Label htmlFor="customer-name">Full name</Label><Input id="customer-name" value={details.name} onChange={change('name')} required maxLength={120} autoComplete="name" /></div><div><Label htmlFor="customer-email">Email</Label><Input id="customer-email" type="email" value={details.email} onChange={change('email')} required maxLength={254} autoComplete="email" /></div><div><Label htmlFor="customer-phone">Phone / WhatsApp</Label><Input id="customer-phone" type="tel" value={details.phone} onChange={change('phone')} required maxLength={32} autoComplete="tel" /></div>
          {fulfillment === 'delivery' ? <><div><Label htmlFor="state">State</Label><Input id="state" value={details.state} onChange={change('state')} required /></div><div><Label htmlFor="city">City / area</Label><Input id="city" value={details.city} onChange={change('city')} required /></div><div><Label htmlFor="address">Delivery address</Label><Input id="address" value={details.address} onChange={change('address')} required maxLength={500} /></div><div><Label htmlFor="landmark">Landmark (optional)</Label><Input id="landmark" value={details.landmark} onChange={change('landmark')} maxLength={200} /></div><div><Label htmlFor="instructions">Delivery instructions (optional)</Label><Input id="instructions" value={details.instructions} onChange={change('instructions')} maxLength={500} /></div><p className="text-xs text-muted-foreground">Delivery within Lagos: ₦5,000 (indicative; final delivery fee may vary by location). Contact the seller to confirm the final delivery fee.</p></> : <div><Label htmlFor="pickup-notes">Pickup notes (optional)</Label><Input id="pickup-notes" value={details.pickupNotes} onChange={change('pickupNotes')} maxLength={500} /><p className="mt-2 text-xs text-muted-foreground">Pickup arrangements will be confirmed by the seller.</p></div>}</div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button type="submit" className="w-full" disabled={busy}>{busy ? 'Saving order…' : 'Review and submit order'}</Button><p className="text-xs text-muted-foreground">No payment is taken here. The seller confirms the order and any delivery charge.</p>
        </form>
      </aside>
    </div>
  </div>;
}
