import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { CompulsoryPaymentGuard } from '@/components/auth/CompulsoryPaymentGuard';
import Script from 'next/script';

// maximumScale removed so people can pinch-zoom (better for accessibility).
export const viewport: Viewport = {
  themeColor: '#130719',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Bessites | Find the right website',
  description: 'Bessites is a directory of websites and digital tools, organised by interest.',
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
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
