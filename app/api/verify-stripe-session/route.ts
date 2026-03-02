import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

function calculateEndsAt(billing: string): string {
  const now = new Date();
  if (billing === 'yearly') now.setDate(now.getDate() + 366);
  else if (billing === '3hr') now.setHours(now.getHours() + 3);
  else if (billing === '30min') now.setMinutes(now.getMinutes() + 30);
  else now.setDate(now.getDate() + 31);
  return now.toISOString();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const tier    = session.metadata?.tier    ?? '';
    const billing = session.metadata?.billing ?? '';
    const endsAt  = calculateEndsAt(billing);

    return NextResponse.json({
      tier,
      billing,
      ends_at:        endsAt,
      customer_email: session.customer_details?.email ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
