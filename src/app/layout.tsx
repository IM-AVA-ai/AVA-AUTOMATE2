import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
// No longer importing FirebaseAuthProvider
import { QueryProvider } from '@/components/Providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AVA Automate',
  description: 'AI-driven SMS communication platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {/* Removed FirebaseAuthProvider */}
        <QueryProvider> {/* Use the QueryProvider client component */}
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
