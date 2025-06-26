# Agent Marketplace – Decentralised AI Platform

A full-stack Web 3 marketplace where users can discover, try and subscribe to advanced AI agents. Built for the **Coinbase + Base Hackathon**.

## ✨ Key Features

### 1. Agent Marketplace
* Browse rich agent cards (name, description, cost, tech stack).
* Dynamic routing (`/agent/[id]`).

### 2. Streaming Chat Interface
* Real-time streaming responses driven by **Amazon Bedrock** models.
* Markdown rendering (tables, code blocks, images).
* Abort / stop generation button.
* Responsive layout – mobile → 4 K.

### 3. Payment Flows powered by **x402Pay** + **CDP Wallets**
* **Free Trial** – each wallet gets one free interaction per agent.
* **Pay-Per-Use** – automatic on-chain micro-payment (ETH) before every prompt.
* **Subscription** – single on-chain payment unlocks unlimited usage; can be cancelled any time.
* Coinbase Wallet (CDP) is the sole connector → friction-less onboarding.

### 4. Web3 Storage & History
* Each interaction is automatically pinned to IPFS via **Pinata**.
* `/history` page lists all chats, shows transaction type, and links directly to the IPFS file + BaseScan tx.

### 5. State & Analytics
* Global state with **Zustand** + `persist` middleware (browser fallback safe).
* Rich type system (TS 5) and modular utility layer for AI, payments, web-scraping, rate-limiting, etc.

### 6. Developer-First DX
* Next.js 15 (App Router) + Tailwind CSS + React-Markdown.
* Fully typed hooks for wagmi / viem.
* One-command local dev (`npm run dev`).

---

## 🖇️ Tech Stack

| Layer            | Tech                                    |
|------------------|-----------------------------------------|
| Frontend         | Next.js 15, React 18, Tailwind CSS      |
| Wallet / Pay     | Coinbase CDP, wagmi, viem, x402-next    |
| AI Inference     | Amazon Bedrock                          |
| State            | Zustand (persist)                       |
| Storage          | IPFS via Pinata                         |
| Misc             | Axios, React-Markdown, Lucide-react     |

---

## 🚀 Quick Start

```bash
# 1. Clone
 git clone https://github.com/your-org/agent-marketplace.git
 cd agent-marketplace

# 2. Install deps
 npm install

# 3. Configure environment
 cp .env.example .env.local
 # → fill in Bedrock, Pinata, x402, CDP keys

# 4. Run
 npm run dev
# open http://localhost:3000
```

### Required Env
```
# Coinbase CDP
NEXT_PUBLIC_CDP_API_KEY_ID=
NEXT_PUBLIC_CDP_API_KEY_SECRET=
NEXT_PUBLIC_CDP_WALLET_SECRET=

# x402
NEXT_PUBLIC_X402_PROJECT_ID=
NEXT_PUBLIC_X402_API_KEY=

# Amazon Bedrock
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1

# Pinata
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_KEY=
```

---

## 🏗️ Project Structure (partial)
```
src
├─ app
│  ├─ page.tsx            # Landing
│  ├─ history/page.tsx    # IPFS history
│  └─ agent/[id]/page.tsx # Agent detail + chat
├─ components
│  ├─ ui/chat-interface.tsx
│  ├─ WalletConnect.tsx
│  ├─ PaymentButton.tsx        # Pay-per-use
│  ├─ SubscriptionButton.tsx   # Subscribe
│  └─ CancelSubscriptionButton.tsx
├─ lib
│  ├─ ai-utils.ts          # Bedrock streaming + utilities
│  ├─ pinata.ts            # IPFS helpers
│  └─ x402.ts              # Payment helpers
└─ types
    └─ index.ts
```

---

## 🛠️ Development Notes
* Uses **Amazon Bedrock streaming** for low-latency generation.
* Fallback local LLM call via Ollama stub available (`AI_UTILS.createStreamingResponse`).
* UI is 100 % keyboard accessible and dark-mode-first.
* Extremely modular – drop-in new payment providers, agents or storage layers.

---

## 🤝 Contributing
Pull requests are welcome! Feel free to open issues & feature requests.

```bash
# Standard flow
 git checkout -b feat/awesome
 git commit -m "add awesome"
 git push origin feat/awesome
```

---

## 📄 License
[MIT](LICENSE)
