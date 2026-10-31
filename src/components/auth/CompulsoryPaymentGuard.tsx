import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNav } from '@/components/bottom-nav';
import { FirebaseClientProvider } from '@/firebase';
import { CompulsoryPaymentGuard } from '@/components/auth/CompulsoryPaymentGuard';
import Script from 'next/script';

export const viewport: Viewport = {
 themeColor: '#0a0a0a',
 width: 'device-width',
 initialScale: 1,
 maximumScale: 1,
};

export const metadata: Metadata = {
 title: 'WEBSITES DISCOVERY ENGINE',
 description: 'The premier professional directory for modern webs and digital tool',
 metadataBase: new URL('https://bessites.store'),
};

export default function RootLayout({
 children,
}: Readonly<{ children: React.ReactNode; }>) {
 return (
  <html lang="en" className="dark" suppressHydrationWarning>
   <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
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
