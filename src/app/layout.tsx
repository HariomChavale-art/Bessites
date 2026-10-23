import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import { SpookyBackground } from '@/components/halloween/SpookyBackground';
import { HalloweenBanner } from '@/components/halloween/HalloweenBanner';

export const viewport: Viewport = {
  themeColor: '#070709',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Bessites | Absolute Discovery Engine',
  description: 'The premier professional directory for modern webs and digital tools. Zero duplication, zero padding, absolute discovery.',
  metadataBase: new URL('https://bessites.store'),
  icons: {
    icon: [
      { url: 'https://i.imgur.com/3STBHNy.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: 'https://i.imgur.com/3STBHNy.png',
    apple: 'https://i.imgur.com/3STBHNy.png',
  },
  openGraph: {
    title: 'Bessites | Absolute Discovery Engine',
    description: 'The most diverse directory for modern webs and curated digital resources.',
    url: 'https://bessites.store',
    siteName: 'Bessites',
    images: [
      {
        url: 'https://i.imgur.com/3STBHNy.png',
        width: 1200,
        height: 1200,
        alt: 'Bessites Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'google-adsense-account': 'ca-pub-6811475243465738',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XT85J2MN9F';

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `}
        </Script>
      </head>
      <body className="font-body antialiased bg-halloween-void text-halloween-bone pb-32">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6811475243465738"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <FirebaseClientProvider>
          <SpookyBackground />
          <HalloweenBanner />
          <div className="relative z-10">
            {children}
          </div>
          <BottomNav />
          <Toaster />
          <Analytics />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
