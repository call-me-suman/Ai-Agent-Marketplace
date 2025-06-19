# AI Agent Marketplace for DAOs

A decentralized marketplace for AI agents built with Next.js, CDP Wallets, and x402Pay.

## Features

- Connect CDP Wallet for authentication
- Browse available AI agents
- Pay for agent usage with x402Pay
- Execute agents and view results
- View results on IPFS

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- CDP Wallets (Coinbase)
- x402Pay
- Amazon Bedrock (backend)
- Pinata IPFS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_CDP_API_KEY_ID=your_api_key_id
   NEXT_PUBLIC_CDP_API_KEY_SECRET=your_api_key_secret
   NEXT_PUBLIC_CDP_WALLET_SECRET=your_wallet_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   └── agent/
│       └── [id]/
│           └── page.tsx      # Agent detail page
├── components/
│   ├── AgentCard.tsx         # Agent card component
│   ├── WalletConnect.tsx     # Wallet connection component
│   └── PaymentButton.tsx     # Payment button component
├── lib/
│   ├── api.ts               # API utilities
│   ├── wallet.ts            # Wallet utilities
│   └── x402.ts              # x402Pay utilities
└── types/
    └── index.ts             # TypeScript types
```

## Development

- The frontend communicates with a FastAPI backend for agent execution
- CDP Wallet integration is handled through the Coinbase SDK
- x402Pay is used for handling payments
- Results are stored on IPFS via Pinata

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
