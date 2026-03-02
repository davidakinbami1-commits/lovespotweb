'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

type SessionInfo = {
  tier: string;
  billing: string;
  ends_at: string | null;
  customer_email: string | null;
};

function formatTierName(tier: string): string {
  if (tier === 'boost') return 'Boost';
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function formatEndDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Success content
// ---------------------------------------------------------------------------

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const returnUrl = searchParams.get('return_url') ?? 'exp+lovespot-dating-app://subscription/success';

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(!!sessionId);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/verify-stripe-session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => setSession(data))
      .catch(() => {/* non-critical — still show success */})
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleReturnToApp = () => {
    window.location.href = returnUrl;
    // After a short delay, show instructions if the app hasn't opened
    setTimeout(() => {
      document.getElementById('manual-open-hint')?.classList.remove('hidden');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Image src="/image.png" alt="LoveSpot" width={28} height={28} className="object-contain" />
          <span className="text-lg font-bold text-[#FF4458]">LoveSpot</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md text-center">
          {/* Animated checkmark */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-14 h-14 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Successful!</h1>
          <p className="text-gray-500 mb-6 text-lg leading-relaxed">
            Your LoveSpot{' '}
            {session ? (
              <span className="font-semibold text-[#FF4458]">{formatTierName(session.tier)}</span>
            ) : (
              'subscription'
            )}{' '}
            is now active.
          </p>

          {loading && (
            <div className="flex justify-center mb-6">
              <div className="w-6 h-6 border-2 border-[#FF4458] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && session && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Plan</span>
                <span className="text-gray-800 font-semibold capitalize">{formatTierName(session.tier)}</span>
              </div>
              {session.billing && session.tier !== 'boost' && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Billing</span>
                  <span className="text-gray-800 font-semibold capitalize">{session.billing}</span>
                </div>
              )}
              {session.ends_at && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">
                    {session.tier === 'boost' ? 'Expires' : 'Renews'}
                  </span>
                  <span className="text-gray-800 font-semibold">{formatEndDate(session.ends_at)}</span>
                </div>
              )}
            </div>
          )}

          {/* Return to app button */}
          <button
            onClick={handleReturnToApp}
            className="w-full bg-[#FF4458] hover:bg-[#E03347] text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-[#FF4458]/30 mb-3"
          >
            Return to LoveSpot App
          </button>

          <p id="manual-open-hint" className="hidden text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            If the app didn&apos;t open automatically, open LoveSpot manually — your subscription will be active when you log in.
          </p>

          {!document?.getElementById?.('manual-open-hint')?.classList?.contains('hidden') && (
            <p className="text-sm text-gray-400 mt-2">
              If the app doesn&apos;t open automatically, open LoveSpot manually — your subscription will be active.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

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

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}
