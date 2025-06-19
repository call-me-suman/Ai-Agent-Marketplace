import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'AI Agent Marketplace',
      appLogoUrl: '/vercel.svg',
      chainId: baseSepolia.id,
      jsonRpcUrl: `https://sepolia.base.org`,
    }),
    metaMask(),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
