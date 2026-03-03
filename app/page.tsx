'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WEB_PRICES, formatPrice } from '@/lib/pricing';

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image src="/image.png" alt="LoveSpot" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-xl font-bold text-[#FF4458]">LoveSpot</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-[#FF4458] font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-[#FF4458] font-medium transition-colors">Pricing</a>
            <a href="#download" className="text-gray-600 hover:text-[#FF4458] font-medium transition-colors">Download</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#download"
              className="bg-[#FF4458] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#E03347] transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <a href="#features" className="block text-gray-600 font-medium py-2">Features</a>
            <a href="#pricing" className="block text-gray-600 font-medium py-2">Pricing</a>
            <a href="#download" className="block text-gray-600 font-medium py-2">Download</a>
            <a
              href="#download"
              className="block bg-[#FF4458] text-white px-5 py-2 rounded-full font-semibold text-center"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #4a1942 70%, #8b1a4a 100%)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FF4458 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FF6B7A 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#FF4458] text-sm font-semibold">Now Available</span>
              <span className="text-white/70 text-sm">iOS &amp; Android</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Find Love,{' '}
              <span className="text-[#FF4458]">Not Just</span>
              <br />Matches
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              LoveSpot is the intentional dating app built for people who are serious about
              finding a meaningful, lasting connection — not just a swipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* App Store badge */}
              <a
                href="#download"
                className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-gray-300 leading-none mb-0.5">Download on the</p>
                  <p className="text-sm font-semibold leading-none">App Store</p>
                </div>
              </a>
              {/* Google Play badge */}
              <a
                href="#download"
                className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.18 23.76c.37.2.8.22 1.19.03L16.61 12 12.44 7.83 3.18 23.76z" fill="#EA4335"/>
                  <path d="M20.54 10.31l-2.84-1.62-4.14 3.64 4.14 3.64 2.85-1.63a1.72 1.72 0 000-2.99l-.01-.04z" fill="#FBBC04"/>
                  <path d="M4.37.21C3.98.02 3.55.04 3.18.24L12.44 9.5l4.17-4.17L4.37.21z" fill="#4285F4"/>
                  <path d="M3.18.24L12.44 9.5l4.17 4.17L4.37 23.79c-.39.21-.8.21-1.19.01C2.47 23.4 2 22.7 2 21.92V2.08C2 1.3 2.47.6 3.18.24z" fill="#34A853"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs text-gray-300 leading-none mb-0.5">Get it on</p>
                  <p className="text-sm font-semibold leading-none">Google Play</p>
                </div>
              </a>
            </div>
            <p className="mt-6 text-white/50 text-sm">Free to download · Premium plans from $14.99/mo</p>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl opacity-30 rounded-full" style={{ background: '#FF4458' }} />
              {/* Phone frame */}
              <div className="relative w-64 h-[520px] bg-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden">
                {/* Status bar */}
                <div className="h-8 bg-gray-900 flex items-center justify-between px-6 pt-1">
                  <span className="text-white text-xs font-semibold">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm"><div className="w-3 h-1 bg-white m-0.5 rounded-sm" /></div>
                  </div>
                </div>
                {/* App UI simulation */}
                <div className="flex-1 bg-white overflow-hidden h-full">
                  {/* App header */}
                  <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6">
                        <Image src="/image.png" alt="LoveSpot" width={24} height={24} className="object-contain" />
                      </div>
                      <span className="text-[#FF4458] font-bold text-sm">LoveSpot</span>
                    </div>
                    <div className="w-7 h-7 bg-[#FF4458] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                    </div>
                  </div>
                  {/* Profile card */}
                  <div className="relative mx-2 mt-2 rounded-2xl overflow-hidden shadow-lg" style={{ height: 260, background: 'linear-gradient(to bottom, #fce4ec, #f8bbd0)' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4458] to-[#FF6B7A] flex items-center justify-center mb-2 shadow-lg">
                        <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                      </div>
                      <p className="font-bold text-gray-800">Sarah, 26</p>
                      <p className="text-xs text-gray-500">Lagos · 2 km away</p>
                    </div>
                    {/* Swipe indicators */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                        <span className="text-gray-400 text-lg">✕</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#FF4458] shadow-md flex items-center justify-center">
                        <span className="text-white text-xl">♥</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                        <span className="text-[#FFD700] text-lg">★</span>
                      </div>
                    </div>
                  </div>
                  {/* Match notification */}
                  <div className="mx-2 mt-2 bg-gradient-to-r from-[#FF4458] to-[#FF6B7A] rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <div>
                      <p className="text-white font-bold text-xs">It&apos;s a Match!</p>
                      <p className="text-white/80 text-xs">You and Alex liked each other</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    icon: '🧠',
    title: 'Smart Matching',
    desc: 'Our AI-powered algorithm learns your preferences and surfaces the most compatible profiles for you.',
  },
  {
    icon: '🎥',
    title: 'Video Profiles',
    desc: 'Go beyond static photos. Record a short video to show your personality and stand out from the crowd.',
  },
  {
    icon: '🎙️',
    title: 'Voice Messages',
    desc: 'Send voice notes to break the ice. A real voice creates a more genuine first impression.',
  },
  {
    icon: '👥',
    title: 'Group Communities',
    desc: 'Join interest-based groups to meet like-minded people before you even start chatting one-on-one.',
  },
  {
    icon: '📹',
    title: 'Video Calls',
    desc: "Move to video at your own pace — no need to share your phone number until you're ready.",
  },
  {
    icon: '✅',
    title: 'Verified Profiles',
    desc: 'Photo verification and ID checks mean you always know who you\'re talking to.',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Everything you need to find{' '}
            <span className="text-[#FF4458]">the one</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            LoveSpot is packed with features designed to make meaningful connections easier
            and more authentic than ever before.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

const PLAN_FEATURES: Record<string, string[]> = {
  silver: [
    '50 likes per day',
    '5 Super Likes daily',
    '3 Rewinds per day',
    '2 Boosts per month',
    'Advanced Filters',
    'Priority in Discovery',
  ],
  gold: [
    'Unlimited Likes',
    'Unlimited Super Likes',
    'Unlimited Rewinds',
    '5 Boosts per month',
    'See Who Likes You',
    'Read Receipts',
    'Passport Mode',
  ],
  platform: [
    'Everything in Gold',
    '12 Boosts per month',
    '15 Top Picks daily',
    'Email Support',
    'First to try new features',
    'Profile Badge',
  ],
};

const PLAN_LABELS: Record<string, { name: string; color: string; badge?: string }> = {
  silver: { name: 'Silver', color: '#8E9EAB' },
  gold:   { name: 'Gold',   color: '#FFD700', badge: 'Most Popular' },
  platform: { name: 'Platform', color: '#9B9EA4' },
};

function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly');
  const tiers = ['silver', 'gold', 'platform'] as const;

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-2">
            Subscribe on the web and save up to 15% vs in-app pricing — no Apple or Google fees.
          </p>
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
            💰 Best value — subscribe here, not in the app
          </span>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                cycle === 'monthly' ? 'bg-[#FF4458] text-white shadow' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                cycle === 'yearly' ? 'bg-[#FF4458] text-white shadow' : 'text-gray-500'
              }`}
            >
              Annual
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${cycle === 'yearly' ? 'bg-white/20 text-white' : 'bg-[#FF4458]/10 text-[#FF4458]'}`}>
                Save 33%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const meta = PLAN_LABELS[tier];
            const price = WEB_PRICES.USD.subscriptions[tier][cycle];
            const isPopular = tier === 'gold';

            return (
              <div
                key={tier}
                className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  isPopular ? 'border-[#FF4458] shadow-lg' : 'border-gray-100 shadow-md'
                }`}
              >
                {meta.badge && (
                  <div className="absolute top-4 right-4 bg-[#FF4458] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {meta.badge}
                  </div>
                )}
                {/* Header */}
                <div className={`p-6 text-center ${isPopular ? 'bg-gradient-to-br from-[#FF4458] to-[#FF6B7A]' : 'bg-gray-50'}`}>
                  <div className="text-3xl mb-1" style={{ color: isPopular ? 'white' : meta.color }}>
                    {tier === 'silver' ? '⭐' : tier === 'gold' ? '👑' : '✨'}
                  </div>
                  <h3 className={`text-2xl font-black mb-3 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                    {meta.name}
                  </h3>
                  <div className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(price, 'USD')}
                    <span className={`text-base font-medium ${isPopular ? 'text-white/80' : 'text-gray-400'}`}>
                      /{cycle === 'yearly' ? 'yr' : 'mo'}
                    </span>
                  </div>
                  {cycle === 'yearly' && (
                    <p className={`text-sm mt-1 ${isPopular ? 'text-white/80' : 'text-gray-400'}`}>
                      {formatPrice(WEB_PRICES.USD.subscriptions[tier].monthly, 'USD')}/mo billed annually
                    </p>
                  )}
                </div>
                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {PLAN_FEATURES[tier].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-gray-700 text-sm">
                        <span className="text-[#FF4458] font-bold flex-shrink-0">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#download"
                    className={`block mt-6 w-full py-3 rounded-full font-bold text-center transition-colors ${
                      isPopular
                        ? 'bg-[#FF4458] text-white hover:bg-[#E03347]'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Get {meta.name}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Prices shown in USD. Also available in NGN, EUR, GBP. Cancel anytime.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

const TESTIMONIALS = [
  {
    name: 'Amara O.',
    location: 'Lagos, Nigeria',
    text: "I'd been on every major dating app and was exhausted. LoveSpot felt different from day one — real conversations, real people. Met my partner here after just 3 weeks.",
    rating: 5,
  },
  {
    name: 'Léa M.',
    location: 'Paris, France',
    text: 'The video profiles were a game changer. You can immediately tell if there\'s a real connection before wasting anyone\'s time. I love how intentional everything feels.',
    rating: 5,
  },
  {
    name: 'David K.',
    location: 'London, UK',
    text: 'Finally an app that takes relationships seriously. The community groups helped me meet people who share my interests before we even matched. Highly recommend.',
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Real love, real stories
          </h2>
          <p className="text-lg text-gray-500">
            Thousands of couples have found meaningful connections on LoveSpot.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-[#FFD700] text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4458] to-[#FF6B7A] flex items-center justify-center text-white font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Download CTA
// ---------------------------------------------------------------------------

function DownloadCTA() {
  return (
    <section id="download" className="py-24" style={{ background: 'linear-gradient(135deg, #FF4458 0%, #FF6B7A 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <Image src="/icon.png" alt="LoveSpot" width={80} height={80} className="object-contain drop-shadow-2xl" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Download LoveSpot Today
        </h2>
        <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
          Join millions of people finding meaningful connections every day.
          Your perfect match is waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="flex items-center gap-3 bg-black/40 hover:bg-black/60 text-white px-8 py-4 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <p className="text-xs text-white/70">Download on the</p>
              <p className="text-lg font-bold">App Store</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 bg-black/40 hover:bg-black/60 text-white px-8 py-4 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.18 23.76c.37.2.8.22 1.19.03L16.61 12 12.44 7.83 3.18 23.76z" fill="#EA4335"/>
              <path d="M20.54 10.31l-2.84-1.62-4.14 3.64 4.14 3.64 2.85-1.63a1.72 1.72 0 000-2.99z" fill="#FBBC04"/>
              <path d="M4.37.21C3.98.02 3.55.04 3.18.24L12.44 9.5l4.17-4.17L4.37.21z" fill="#4285F4"/>
              <path d="M3.18.24L12.44 9.5l4.17 4.17L4.37 23.79c-.39.21-.8.21-1.19.01C2.47 23.4 2 22.7 2 21.92V2.08C2 1.3 2.47.6 3.18.24z" fill="#34A853"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-white/70">Get it on</p>
              <p className="text-lg font-bold">Google Play</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 relative">
                <Image src="/image.png" alt="LoveSpot" width={32} height={32} className="object-contain opacity-90" />
              </div>
              <span className="text-xl font-bold text-white">LoveSpot</span>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-xs">
              The intentional dating app built for people who are serious about finding meaningful, lasting love.
            </p>
            <div className="flex gap-3 mt-4">
              {['Twitter', 'Instagram', 'TikTok'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#FF4458] transition-colors text-xs font-bold text-white">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Company</p>
            <ul className="space-y-2">
              {['About Us', 'Safety', 'Blog', 'Careers'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><a href="mailto:support@lovespotapp.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} LoveSpot. All rights reserved.</p>
          <p className="text-sm text-gray-600">Made with ❤️ for meaningful connections</p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <DownloadCTA />
      <Footer />
    </>
  );
}
