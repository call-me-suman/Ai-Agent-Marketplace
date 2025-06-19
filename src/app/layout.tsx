'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/navbar';
import { WagmiConfig } from 'wagmi';
import { config } from '@/app/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={config}>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <main className="pt-24">
              {children}
            </main>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
