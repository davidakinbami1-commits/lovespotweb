import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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
    now.setDate(now.getDate() + 31);
  }
  return now;
}

async function handleChargeSuccess(eventData: Record<string, unknown>) {
  const supabase = getSupabase();

  const metadata = eventData.metadata as Record<string, string> | undefined;
  const { user_id, tier, billing } = metadata ?? {};

  if (!user_id || !tier || !billing) {
    console.error('Paystack webhook: missing metadata', metadata);
    return;
  }

  const now    = new Date().toISOString();
  const endsAt = calculateEndsAt(billing).toISOString();
  const isBoost = tier === 'boost';

  if (isBoost) {
    const boostType = billing === '30min' ? 'boost_30min' : 'super_boost_3hr';
    await supabase.from('boost_purchases').upsert({
      user_id,
      boost_type: boostType,
      product_id: boostType,
      price_cents: (eventData.amount as number) ?? 0,
      currency: 'NGN',
      is_active: false,
    });
    await supabase.rpc('activate_boost', { p_user_id: user_id, p_boost_type: boostType });
    return;
  }

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
    is_premium:              true,
    premium_tier:            tier,
    subscription_expires_at: endsAt,
    updated_at:              now,
  }).eq('id', user_id);
}

export async function POST(req: Request) {
  const body = await req.text();

  // Verify Paystack signature: HMAC-SHA512 of raw body with secret key
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  const signature = req.headers.get('x-paystack-signature');
  if (!signature || hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    if (event.event === 'charge.success') {
      await handleChargeSuccess(event.data);
    }
  } catch (err) {
    console.error('Paystack webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
