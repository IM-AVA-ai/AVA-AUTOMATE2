import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseAuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/components/Providers/QueryProvider'; // Import the new QueryProvider

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
        <FirebaseAuthProvider>
          <QueryProvider> {/* Use the QueryProvider client component */}
            {children}
            <Toaster />
          </QueryProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
