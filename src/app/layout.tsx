import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';

/**
 * Global Metadata Configuration
 * properly displays the official brand icon across mobile browsers, Google shortcuts,
 * Apple touch icons, and social OpenGraph previews.
 */
export const viewport: Viewport = {
  themeColor: '#0d0c1d',
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
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="https://i.imgur.com/3STBHNy.png" />
        <link rel="shortcut icon" href="https://i.imgur.com/3STBHNy.png" />
        <link rel="apple-touch-icon" href="https://i.imgur.com/3STBHNy.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground pb-32">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6811475243465738"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <FirebaseClientProvider>
          {children}
          <BottomNav />
          <Toaster />
          <Analytics />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
