import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/bottom-nav";
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: 'Bessites | Discover Web Apps',
  description: 'A professional directory for modern webs and digital tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
