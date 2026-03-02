'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  WEB_PRICES,
  formatPrice,
  getCurrencyForCountry,
  isAfricanCountry,
  boostBillingToType,
  type SupportedCurrency,
  type PremiumTier,
  type BillingCycle,
  type BoostBilling,
} from '@/lib/pricing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PageParams = {
  userId: string | null;
  tier: string | null;
  billing: string | null;
  returnUrl: string | null;
};

type LocationInfo = {
  country: string | null;
  currency: SupportedCurrency;
  isAfrican: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIER_META: Record<PremiumTier, { name: string; icon: string; color: string }> = {
  silver:   { name: 'Silver',   icon: '⭐', color: '#8E9EAB' },
  gold:     { name: 'Gold',     icon: '👑', color: '#FFD700' },
  platform: { name: 'Platform', icon: '✨', color: '#9B9EA4' },
};

const TIER_FEATURES: Record<PremiumTier, string[]> = {
  silver:   ['50 likes per day', '5 Super Likes', '2 Boosts/month', 'Advanced Filters'],
  gold:     ['Unlimited Likes', 'See Who Likes You', '5 Boosts/month', 'Passport Mode'],
  platform: ['Everything in Gold', '12 Boosts/month', 'Email Support', 'Profile Badge'],
};

function getPriceForDisplay(
  tier: string,
  billing: string,
  currency: SupportedCurrency,
): { amount: number; label: string } {
  if (tier === 'boost') {
    const boostType = boostBillingToType(billing as BoostBilling);
    const amount = WEB_PRICES[currency].boosts[boostType];
    const label = billing === '30min' ? '30 minutes' : '3 hours';
    return { amount, label };
  }
  const validTier = (['silver', 'gold', 'platform'].includes(tier) ? tier : 'gold') as PremiumTier;
  const validBilling = (['monthly', 'yearly'].includes(billing) ? billing : 'monthly') as BillingCycle;
  const amount = WEB_PRICES[currency].subscriptions[validTier][validBilling];
  const label = validBilling === 'yearly' ? 'per year' : 'per month';
  return { amount, label };
}

// ---------------------------------------------------------------------------
// Trust signals
// ---------------------------------------------------------------------------

function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {[
        { icon: '🔒', text: 'Secure payment' },
        { icon: '↩️', text: 'Cancel anytime' },
        { icon: '⚡', text: 'Instant activation' },
      ].map((b) => (
        <div key={b.text} className="flex items-center gap-1.5 text-sm text-gray-500">
          <span>{b.icon}</span>
          <span>{b.text}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main subscribe content (uses useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------

function SubscribeContent() {
  const searchParams = useSearchParams();

  const params: PageParams = {
    userId:    searchParams.get('user_id'),
    tier:      searchParams.get('tier'),
    billing:   searchParams.get('billing'),
    returnUrl: searchParams.get('return_url'),
  };

  const [location, setLocation] = useState<LocationInfo>({ country: null, currency: 'USD', isAfrican: false });
  const [detecting, setDetecting] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        const country = data?.country_code ?? null;
        setLocation({
          country,
          currency: getCurrencyForCountry(country),
          isAfrican: isAfricanCountry(country),
        });
      } catch {
        // Default to USD on failure
      } finally {
        setDetecting(false);
      }
    }
    detectLocation();
  }, []);

  // Missing user_id guard
  if (!params.userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Link Invalid</h1>
          <p className="text-gray-500 mb-6">
            Please open this link from the LoveSpot app to subscribe.
          </p>
          <a href="/" className="inline-block bg-[#FF4458] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E03347] transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const tier    = params.tier    ?? 'gold';
  const billing = params.billing ?? 'monthly';
  const isBoost = tier === 'boost';
  const tierMeta = !isBoost ? TIER_META[(tier as PremiumTier) ?? 'gold'] : null;

  const priceInfo = !detecting
    ? getPriceForDisplay(tier, billing, location.currency)
    : null;

  const handlePay = async () => {
    setPaying(true);
    setError(null);
    try {
      if (location.isAfrican) {
        // Paystack
        const res = await fetch('/api/create-paystack-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id:    params.userId,
            tier,
            billing,
            return_url: params.returnUrl ?? '',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Payment failed');
        window.location.href = data.authorization_url;
      } else {
        // Stripe
        const res = await fetch('/api/create-stripe-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id:    params.userId,
            tier,
            billing,
            currency:   location.currency,
            return_url: params.returnUrl ?? '',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Payment failed');
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Image src="/image.png" alt="LoveSpot" width={28} height={28} className="object-contain" />
          <span className="text-lg font-bold text-[#FF4458]">LoveSpot</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Savings badge */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="text-xl">💰</span>
            <div>
              <p className="font-semibold text-green-800 text-sm">You&apos;re saving vs in-app pricing</p>
              <p className="text-green-600 text-sm">
                Subscribing here on the web avoids Apple/Google fees — same great features, lower price.
              </p>
            </div>
          </div>

          {/* Plan card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 border border-gray-100">
            {/* Plan header */}
            <div
              className="p-6 text-center"
              style={{
                background: isBoost
                  ? 'linear-gradient(135deg, #FF4458, #FF6B7A)'
                  : `linear-gradient(135deg, ${tierMeta?.color ?? '#FF4458'}33 0%, ${tierMeta?.color ?? '#FF4458'}11 100%)`,
              }}
            >
              <div className="text-5xl mb-2">{isBoost ? '⚡' : tierMeta?.icon}</div>
              {isBoost ? (
                <>
                  <h1 className="text-2xl font-black text-white">
                    Profile Boost — {billing === '30min' ? '30 Minutes' : '3 Hours'}
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    Be shown to more people in your area
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-black text-gray-900">
                    LoveSpot {tierMeta?.name}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 capitalize">{billing} subscription</p>
                </>
              )}
            </div>

            {/* Price */}
            <div className="px-6 py-5 border-b border-gray-50 text-center">
              {detecting ? (
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse w-36 mx-auto" />
              ) : (
                <>
                  <p className="text-4xl font-black text-gray-900">
                    {formatPrice(priceInfo!.amount, location.currency)}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{priceInfo!.label}</p>
                  {location.currency === 'NGN' && (
                    <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      African price — NGN via Paystack
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Features (subscriptions only) */}
            {!isBoost && tierMeta && (
              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What&apos;s included</p>
                <ul className="space-y-2">
                  {TIER_FEATURES[tier as PremiumTier].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-[#FF4458] font-bold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Boost description */}
            {isBoost && (
              <div className="px-6 py-5">
                <ul className="space-y-2">
                  {[
                    billing === '30min' ? 'Be a top profile for 30 minutes' : 'Be a top profile for 3 hours',
                    'Up to 10× more profile views',
                    'Attract more matches during your boost',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-[#FF4458] font-bold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Payment button */}
          <button
            onClick={handlePay}
            disabled={paying || detecting}
            className="w-full bg-[#FF4458] hover:bg-[#E03347] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-[#FF4458]/30"
          >
            {paying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting…
              </span>
            ) : (
              isBoost ? 'Purchase Boost' : 'Subscribe Now'
            )}
          </button>

          <TrustBadges />

          {/* Payment method info */}
          <p className="text-center text-xs text-gray-400 mt-4">
            {detecting
              ? 'Detecting your region…'
              : location.isAfrican
                ? 'Secure payment via Paystack · NGN'
                : `Secure payment via Stripe · ${location.currency}`
            }
          </p>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export — wraps in Suspense for useSearchParams
// ---------------------------------------------------------------------------

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF4458] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading…</p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SubscribeContent />
    </Suspense>
  );
}
