"use client";

import { useState, useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from '@/app/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from '@/components/ui/navbar';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <main className="pt-24">
          {children}
        </main>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
