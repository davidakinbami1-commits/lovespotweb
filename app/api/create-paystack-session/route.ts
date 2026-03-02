import { NextResponse } from 'next/server';
import { WEB_PRICES, boostBillingToType, type BoostBilling, type PremiumTier, type BillingCycle } from '@/lib/pricing';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://lovespotapp.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, tier, billing, return_url } = body as {
      user_id:    string;
      tier:       string;
      billing:    string;
      return_url: string;
    };

    if (!user_id || !tier || !billing) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isBoost = tier === 'boost';
    let amountKobo: number;

    if (isBoost) {
      const boostType = boostBillingToType(billing as BoostBilling);
      amountKobo = WEB_PRICES.NGN.boosts[boostType];
    } else {
      const validTier    = (['silver', 'gold', 'platform'].includes(tier) ? tier : 'gold') as PremiumTier;
      const validBilling = (['monthly', 'yearly'].includes(billing) ? billing : 'monthly') as BillingCycle;
      amountKobo = WEB_PRICES.NGN.subscriptions[validTier][validBilling];
    }

    // Paystack accepts amount in kobo directly (smallest unit)
    const encodedReturn = encodeURIComponent(return_url);
    const callbackUrl   = `${APP_URL}/success?return_url=${encodedReturn}`;

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:        `${user_id}@lovespot.app`,
        amount:       amountKobo, // already in kobo
        currency:     'NGN',
        metadata:     { user_id, tier, billing, source: 'web' },
        callback_url: callbackUrl,
      }),
    });

    if (!paystackRes.ok) {
      const err = await paystackRes.json();
      return NextResponse.json({ error: err.message ?? 'Paystack error' }, { status: 502 });
    }

    const data = await paystackRes.json();
    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
