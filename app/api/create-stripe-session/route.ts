import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  STRIPE_PRICE_IDS,
  boostBillingToType,
  type SupportedCurrency,
  type PremiumTier,
  type BillingCycle,
  type BoostBilling,
} from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://lovespotapp.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, tier, billing, currency, return_url } = body as {
      user_id:    string;
      tier:       string;
      billing:    string;
      currency:   SupportedCurrency;
      return_url: string;
    };

    // Validate required fields
    if (!user_id || !tier || !billing || !currency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stripeCurrency = (currency === 'NGN' ? 'USD' : currency) as Exclude<SupportedCurrency, 'NGN'>;
    const priceIds = STRIPE_PRICE_IDS[stripeCurrency];
    if (!priceIds) {
      return NextResponse.json({ error: `Unsupported currency: ${currency}` }, { status: 400 });
    }

    const isBoost = tier === 'boost';

    let priceId: string;
    let mode: 'subscription' | 'payment';

    if (isBoost) {
      const boostType = boostBillingToType(billing as BoostBilling);
      priceId = priceIds.boosts[boostType];
      mode = 'payment';
    } else {
      const validTier    = (['silver', 'gold', 'platform'].includes(tier) ? tier : 'gold') as PremiumTier;
      const validBilling = (['monthly', 'yearly'].includes(billing) ? billing : 'monthly') as BillingCycle;
      priceId = priceIds.subscriptions[validTier][validBilling];
      mode = 'subscription';
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price not found for this plan' }, { status: 400 });
    }

    const encodedReturn = encodeURIComponent(return_url);
    const successUrl = `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&return_url=${encodedReturn}`;
    const cancelUrl  = `${APP_URL}/cancel?user_id=${user_id}&tier=${tier}&billing=${billing}&return_url=${encodedReturn}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id, tier, billing, source: 'web' },
      success_url: successUrl,
      cancel_url:  cancelUrl,
      // Allow promotional codes for web subscribers
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
