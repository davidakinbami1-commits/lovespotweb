/**
 * LoveSpot Web Pricing — Stripe & Paystack flows only.
 * These are the WEB_PRICES (no app-store fee).
 * IAP prices (Apple IAP / Google Play) are +15% and configured
 * in App Store Connect / Google Play Console separately.
 *
 * All amounts in smallest currency unit:
 *   NGN → kobo  (÷100 = ₦)
 *   EUR → cents  (÷100 = €)
 *   USD → cents  (÷100 = $)
 *   GBP → pence  (÷100 = £)
 */

export type SupportedCurrency = 'NGN' | 'EUR' | 'USD' | 'GBP';
export type PremiumTier = 'silver' | 'gold' | 'platform';
export type BillingCycle = 'monthly' | 'yearly';
export type BoostBilling = '30min' | '3hr';
export type BoostType = 'boost_30min' | 'super_boost_3hr';

export const AFRICAN_COUNTRIES = [
  'NG', 'GH', 'KE', 'ZA', 'EG', 'TZ', 'UG', 'RW', 'SN', 'CI',
  'ET', 'MA', 'TN', 'DZ', 'CM', 'ZW', 'ZM', 'BW', 'NA', 'MZ',
];

export const EUROPEAN_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'NO', 'CH', 'IS', 'LI',
];

export const GBP_COUNTRIES = ['GB'];

// ---------------------------------------------------------------------------
// WEB_PRICES — used for Stripe & Paystack checkout
// ---------------------------------------------------------------------------

export const WEB_PRICES = {
  NGN: {
    subscriptions: {
      silver:   { monthly: 1_600_000, yearly: 12_800_000 },  // ₦16,000 / ₦128,000
      gold:     { monthly: 3_200_000, yearly: 25_600_000 },  // ₦32,000 / ₦256,000
      platform: { monthly: 4_480_000, yearly: 38_400_000 },  // ₦44,800 / ₦384,000
    },
    boosts: {
      boost_30min:     200_000,  // ₦2,000
      super_boost_3hr: 600_000,  // ₦6,000
    },
  },
  EUR: {
    subscriptions: {
      silver:   { monthly: 1_499, yearly: 11_999 },  // €14.99 / €119.99
      gold:     { monthly: 2_799, yearly: 22_999 },  // €27.99 / €229.99
      platform: { monthly: 3_999, yearly: 34_999 },  // €39.99 / €349.99
    },
    boosts: {
      boost_30min:     399,  // €3.99
      super_boost_3hr: 999,  // €9.99
    },
  },
  USD: {
    subscriptions: {
      silver:   { monthly: 1_499, yearly: 11_999 },  // $14.99 / $119.99
      gold:     { monthly: 2_799, yearly: 22_999 },  // $27.99 / $229.99
      platform: { monthly: 3_999, yearly: 34_999 },  // $39.99 / $349.99
    },
    boosts: {
      boost_30min:     399,  // $3.99
      super_boost_3hr: 999,  // $9.99
    },
  },
  GBP: {
    subscriptions: {
      silver:   { monthly: 1_499, yearly: 11_999 },  // £14.99 / £119.99
      gold:     { monthly: 2_700, yearly: 22_999 },  // £27.00 / £229.99
      platform: { monthly: 3_999, yearly: 34_999 },  // £39.99 / £349.99
    },
    boosts: {
      boost_30min:     399,  // £3.99
      super_boost_3hr: 999,  // £9.99
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Stripe Price IDs — from Stripe Dashboard (same as in the React Native app)
// ---------------------------------------------------------------------------

export const STRIPE_PRICE_IDS: Record<
  Exclude<SupportedCurrency, 'NGN'>,
  {
    subscriptions: Record<PremiumTier, Record<BillingCycle, string>>;
    boosts: Record<BoostType, string>;
  }
> = {
  EUR: {
    subscriptions: {
      silver:   { monthly: 'price_1T1NGUKHx9Vke4nfwbOXWMd0', yearly: 'price_1T1NTfKHx9Vke4nf95W11kWO' },
      gold:     { monthly: 'price_1T1NvzKHx9Vke4nf2ryltsBh', yearly: 'price_1T1NkAKHx9Vke4nfHJj8ncW9' },
      platform: { monthly: 'price_1T1NtQKHx9Vke4nfO5gLelxr', yearly: 'price_1T1NpdKHx9Vke4nfbB0SYrAu' },
    },
    boosts: {
      boost_30min:     'price_1T1NAcKHx9Vke4nfIsuw74Vi',
      super_boost_3hr: 'price_1T1NCeKHx9Vke4nfJ7U2aUnK',
    },
  },
  USD: {
    subscriptions: {
      silver:   { monthly: 'price_1T1NE1KHx9Vke4nfOn0od4LD', yearly: 'price_1T1NSmKHx9Vke4nfL0ydJnmn' },
      gold:     { monthly: 'price_1T1NvOKHx9Vke4nf5jHZITAP', yearly: 'price_1T1Nj3KHx9Vke4nfHi9hGNug' },
      platform: { monthly: 'price_1T1NskKHx9Vke4nfQlYm4QsJ', yearly: 'price_1T1Np1KHx9Vke4nfHLFjsEKK' },
    },
    boosts: {
      boost_30min:     'price_1T1N8WKHx9Vke4nfDcaCeGUV',
      super_boost_3hr: 'price_1T1NC7KHx9Vke4nfVEieCbj8',
    },
  },
  GBP: {
    subscriptions: {
      silver:   { monthly: 'price_1T1NEZKHx9Vke4nf7LPWHONc', yearly: 'price_1T1NKwKHx9Vke4nfxt7qIf5p' },
      gold:     { monthly: 'price_1T1NutKHx9Vke4nf2xwrOEjQ', yearly: 'price_1T1NXqKHx9Vke4nfXGiwjLZq' },
      platform: { monthly: 'price_1T1Ns2KHx9Vke4nfADKGFvqu', yearly: 'price_1T1NnwKHx9Vke4nfgmWYokp1' },
    },
    boosts: {
      boost_30min:     'price_1T1N9xKHx9Vke4nf4A5FFJ6x',
      super_boost_3hr: 'price_1T1NBnKHx9Vke4nfDDmjk84O',
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCurrencyForCountry(countryCode: string | null): SupportedCurrency {
  if (!countryCode) return 'USD';
  if (AFRICAN_COUNTRIES.includes(countryCode)) return 'NGN';
  if (GBP_COUNTRIES.includes(countryCode)) return 'GBP';
  if (EUROPEAN_COUNTRIES.includes(countryCode)) return 'EUR';
  return 'USD';
}

export function isAfricanCountry(countryCode: string | null): boolean {
  return countryCode ? AFRICAN_COUNTRIES.includes(countryCode) : false;
}

export function formatPrice(amount: number, currency: SupportedCurrency): string {
  switch (currency) {
    case 'NGN': return `₦${(amount / 100).toLocaleString()}`;
    case 'EUR': return `€${(amount / 100).toFixed(2)}`;
    case 'GBP': return `£${(amount / 100).toFixed(2)}`;
    case 'USD': return `$${(amount / 100).toFixed(2)}`;
    default:    return `${(amount / 100).toFixed(2)}`;
  }
}

export function boostBillingToType(billing: BoostBilling): BoostType {
  return billing === '30min' ? 'boost_30min' : 'super_boost_3hr';
}
