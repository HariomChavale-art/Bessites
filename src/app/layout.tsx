import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/react";

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
  title: 'Bessites | Global Discovery',
  description: 'A professional directory for modern webs and digital tools. Zero duplication, zero padding.',
  metadataBase: new URL('https://bessites.store'),
  icons: {
    icon: [
      { url: 'https://i.imgur.com/3STBHNy.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: 'https://i.imgur.com/3STBHNy.png',
    apple: 'https://i.imgur.com/3STBHNy.png',
  },
  openGraph: {
    title: 'Bessites | Global Discovery',
    description: 'A professional directory for modern webs and digital tools.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Bessites | Global Discovery',
    description: 'A professional directory for modern webs and digital tools.',
    images: ['https://i.imgur.com/3STBHNy.png'],
    creator: '@bessites',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground pb-24">
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
