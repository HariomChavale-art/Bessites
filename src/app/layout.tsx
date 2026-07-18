import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: 'Bessites | Discover Web Apps',
  description: 'A professional directory for modern webs and digital tools.',
  other: {
    monetag: '69d4ecd723e9fb17cf62677950bf7f6d',
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
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6811475243465738"
          crossOrigin="anonymous"
        ></script>
        {/* Monetag Multitag */}
        <script src="https://quge5.com/88/tag.min.js" data-zone="260744" async data-cfasync="false"></script>
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
