import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LoveSpot — Find Love, Not Just Matches',
  description:
    'LoveSpot is the intentional dating app built for people who are serious about finding a meaningful connection. Smart matching, video profiles, and authentic connections.',
  keywords: 'dating app, online dating, find love, relationships, LoveSpot',
  openGraph: {
    title: 'LoveSpot — Find Love, Not Just Matches',
    description: 'The intentional dating app for meaningful connections.',
    type: 'website',
    url: 'https://lovespotapp.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoveSpot',
    description: 'The intentional dating app for meaningful connections.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
