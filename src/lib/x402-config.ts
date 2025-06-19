import { paymentMiddleware } from 'x402-next';

// Your wallet address that will receive the payments
const WALLET_ADDRESS = (process.env.WALLET_ADDRESS || '0x1234567890123456789012345678901234567890') as `0x${string}`;

// Configure the payment middleware
export const x402Config = {
  middleware: paymentMiddleware(
    WALLET_ADDRESS,
    {
      '/api/agents/*/subscribe': {
        price: '0.01', // ETH amount for subscription
        network: 'base-sepolia',
        config: {
          description: 'Agent subscription',
          maxTimeoutSeconds: 3600, // 1 hour to complete payment
        }
      }
    },
    {
      url: 'https://x402.org/facilitator', // Facilitator URL for Base Sepolia testnet
    }
  ),
  matcher: [
    '/api/agents/:id/subscribe',
  ]
};

export const X402_API_KEY = process.env.X402_API_KEY || '';
export const X402_API_URL = 'https://api.x402pay.io';

export interface X402Invoice {
  id: string;
  url: string;
  status: 'pending' | 'paid' | 'expired';
  amount: number;
  token: string;
  chain: string;
  recipient: string;
  createdAt: string;
  expiresAt: string;
} 