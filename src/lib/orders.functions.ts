import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

const orderInput = z.object({
  idempotencyKey: z.string().uuid(),
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(254),
  customerPhone: z.string().trim().min(7).max(32),
  fulfillment: z.enum(['delivery', 'pickup']),
  state: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  address: z.string().trim().max(500).optional(),
  landmark: z.string().trim().max(200).optional(),
  deliveryInstructions: z.string().trim().max(500).optional(),
  pickupNotes: z.string().trim().max(500).optional(),
  items: z.array(z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(1).max(50) })).min(1).max(25),
});

export const submitOrder = createServerFn({ method: 'POST' })
  .inputValidator((input) => orderInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: result, error } = await supabaseAdmin.rpc('create_customer_order', {
      p_idempotency_key: data.idempotencyKey,
      p_customer_name: data.customerName,
      p_customer_email: data.customerEmail,
      p_customer_phone: data.customerPhone,
      p_fulfillment: data.fulfillment,
      p_state: data.state,
      p_city: data.city,
      p_address: data.address,
      p_landmark: data.landmark,
      p_delivery_instructions: data.deliveryInstructions,
      p_pickup_notes: data.pickupNotes,
      p_items: data.items as Database['public']['Functions']['create_customer_order']['Args']['p_items'],
    });
    if (error || !result || typeof result !== 'object' || Array.isArray(result)) {
      console.error('[orders] Order submission failed', error?.code ?? 'no_result');
      throw new Error(error?.message ?? 'Order could not be saved. Please try again.');
    }
    const record = result as Record<string, unknown>;
    const { data: settings } = await supabaseAdmin.from('store_settings').select('whatsapp_number,owner_email').eq('id', 1).maybeSingle();
    return {
      orderRef: String(record['order_ref'] ?? ''),
      subtotal: Number(record['subtotal'] ?? 0),
      duplicate: Boolean(record['duplicate']),
      whatsappNumber: settings?.whatsapp_number ?? null,
      emailConfigured: Boolean(settings?.owner_email),
    };
  });

export async function submitOrderFromClient(input: z.input<typeof orderInput>) {
  return submitOrder({ data: input });
}

export const signInAdmin = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string; password: string }) => z.object({ email: z.string().email().max(254), password: z.string().min(1).max(256) }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) throw new Error(error.message);
    const { data: role, error: roleError } = await supabase.rpc('has_role', { _user_id: (await supabase.auth.getUser()).data.user?.id ?? '', _role: 'admin' });
    if (roleError || !role) {
      await supabase.auth.signOut();
      throw new Error('This account does not have store administrator access.');
    }
    return { ok: true };
  });
