import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/react";
import { CompulsoryPaymentGuard } from '@/components/auth/CompulsoryPaymentGuard';

/**
 * Root Layout for Bessites.
 * Wraps the application in a Compulsory Payment Guard.
 */

export const viewport: Viewport = {
  themeColor: '#0d0c1d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Bessites | Find the Best Tools',
  description: 'The premier professional directory for modern webs and digital tools. Pay once, access forever.',
  metadataBase: new URL('https://bessites.store'),
  icons: {
    icon: [
      { url: 'https://i.imgur.com/3STBHNy.png', sizes: 'any', type: 'image/png' },
    ],
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
      <body className="font-body antialiased bg-background text-foreground pb-32">
        <FirebaseClientProvider>
          <CompulsoryPaymentGuard>
            {children}
            <BottomNav />
            <Toaster />
          </CompulsoryPaymentGuard>
          <Analytics />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
