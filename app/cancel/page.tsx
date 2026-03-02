'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId  = searchParams.get('user_id');
  const tier    = searchParams.get('tier')    ?? 'gold';
  const billing = searchParams.get('billing') ?? 'monthly';
  const returnUrl = searchParams.get('return_url') ?? 'exp+lovespot-dating-app://subscription/success';

  const tryAgainUrl = `/subscribe?user_id=${userId ?? ''}&tier=${tier}&billing=${billing}&return_url=${encodeURIComponent(returnUrl)}`;

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
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Cancelled</h1>
          <p className="text-gray-500 mb-8 text-lg leading-relaxed">
            No worries — your payment was cancelled and you haven&apos;t been charged.
            You can try again whenever you&apos;re ready.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(tryAgainUrl)}
              className="w-full bg-[#FF4458] hover:bg-[#E03347] text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-[#FF4458]/30"
            >
              Try Again
            </button>
            <button
              onClick={() => { window.location.href = returnUrl; }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl text-lg transition-colors"
            >
              Return to App
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Have questions?{' '}
            <a href="mailto:support@lovespotapp.com" className="text-[#FF4458] hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF4458] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CancelContent />
    </Suspense>
  );
}
