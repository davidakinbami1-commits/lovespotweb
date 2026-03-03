import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Use service role key for server-side DB writes (bypasses RLS)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function calculateEndsAt(billing: string): Date {
  const now = new Date();
  if (billing === 'yearly') {
    now.setDate(now.getDate() + 366);
  } else if (billing === '3hr') {
    now.setHours(now.getHours() + 3);
  } else if (billing === '30min') {
    now.setMinutes(now.getMinutes() + 30);
  } else {
    // monthly (default)
    now.setDate(now.getDate() + 31);
  }
  return now;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getSupabase();
  const { user_id, tier, billing } = session.metadata ?? {};

  if (!user_id || !tier || !billing) {
    console.error('Stripe webhook: missing metadata', session.metadata);
    return;
  }

  const now    = new Date().toISOString();
  const endsAt = calculateEndsAt(billing).toISOString();
  const isBoost = tier === 'boost';

  if (isBoost) {
    // Insert boost purchase record
    const boostType = billing === '30min' ? 'boost_30min' : 'super_boost_3hr';
    await supabase.from('boost_purchases').upsert({
      user_id,
      boost_type: boostType,
      product_id: boostType,
      price_cents: 0, // amount tracked in Stripe
      currency: 'USD',
      is_active: false,
    });
    // Activate the boost
    await supabase.rpc('activate_boost', { p_user_id: user_id, p_boost_type: boostType });
    return;
  }

  // Subscription
  await supabase.from('subscriptions').upsert(
    {
      user_id,
      tier,
      status:     'active',
      starts_at:  now,
      ends_at:    endsAt,
      auto_renew: true,
      updated_at: now,
    },
    { onConflict: 'user_id' },
  );

  await supabase.from('profiles').update({
    is_premium:                true,
    premium_tier:              tier,
    subscription_expires_at:   endsAt,
    updated_at:                now,
  }).eq('id', user_id);
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signature verification failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }
    // Future: handle invoice.payment_succeeded for renewals
  } catch (err) {
    console.error('Stripe webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
