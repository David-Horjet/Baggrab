## 🕹️ BagGrab – A Gorbagana-Powered Multiplayer Reaction Game

BagGrab is a fast-paced, reaction-based mini-game built on the **Gorbagana testnet**, showcasing how degens can grab digital "bags" in real-time. Compete for top scores and earn \$GOR rewards instantly based on your performance.

Built for degens, by degens 🗑️⚡

---

## 🌍 Live Demo

> 🔗 **Demo Video**: [https://x.com/david_horjet/status/1940806104365387846](https://x.com/david_horjet/status/1940806104365387846)
> 🔗 **Client**: [https://baggrab.vercel.app](https://baggrab.vercel.app)
> 🔗 **Server**: [https://baggrab.onrender.com](https://baggrab.onrender.com)

---

## 🧩 Game Overview

* Rapid reaction-based clicking game
* Compete against others to grab as many bags as you can in a short window
* Leaderboard shows top scores (one per wallet)
* Top scorers earn **Gorbagana test tokens (\$GOR)** instantly after submission
* Fully wallet-based identity: no signups, just connect & play

---

## 🔌 Gorbagana Integration

* Uses Solana-compatible methods with **Gorbagana RPC**:
  `https://rpc.gorbagana.wtf`
* Token rewards are distributed from a pre-funded Gorbagana wallet
* Transaction links are shown to users after successful rewards:

  ```
  https://explorer.gorbagana.wtf/tx/<txSignature>
  ```
* All transactions are signed and sent server-side using Solana Web3 SDK and `bs58` decoded private keys

---

## 📁 Project Structure

```
baggrab/
├── client/     # Frontend (Next.js + TypeScript)
└── server/     # Backend (Express + TypeScript + MongoDB)
```

---

## 🚀 Setup Instructions

### 🔐 Prerequisites

* Node.js v18+
* MongoDB (Atlas or local)
* Gorbagana test tokens
* Backpack Wallet (for connecting and testing)

---

### 1. Clone the Repo

```bash
git clone [https://github.com/your-org/baggrab.git](https://github.com/David-Horjet/Baggrab.git)
cd baggrab
```

---

### 2. Backend Setup (`server/`)

```bash
cd server
npm install
```

#### 🔐 Environment Variables (`.env`)

Create a `.env` file with the following:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<your-cluster>.mongodb.net/baggrab
PRIVATE_KEY=your_base58_encoded_gorbagana_wallet_key
```

> ✅ Use `bs58.encode(...)` if converting from keypair JSON array.

#### ▶️ Run the server

```bash
npm run dev
```

> The backend will be available at `http://localhost:5000`

---

### 3. Frontend Setup (`client/`)

```bash
cd client
npm install
```

#### 🔐 Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Replace with your deployed backend URL in production.

#### ▶️ Run the frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📦 API Overview

### `POST /api/submit-score`

Submit a new score and receive reward (if eligible)

```ts
{
  wallet: string,
  score: number
}
```

Response:

```ts
{
  status: "success",
  data: {
    score: { wallet, score, createdAt },
    rewardTx: "transaction-signature" | null
  }
}
```

---

### `GET /api/leaderboard`

Returns top 50 unique wallet scores (highest only)

---

### `GET /api/health`

Used by frontend to confirm backend is live

---

## 🧠 Tech Stack

| Layer    | Stack                                                |
| -------- | ---------------------------------------------------- |
| Frontend | Next.js, TailwindCSS, Redux Toolkit                  |
| Backend  | Express, TypeScript, MongoDB                         |
| Wallet   | Backpack (Solana-compatible)                         |
| Chain    | Gorbagana Testnet (RPC: `https://rpc.gorbagana.wtf`) |

---

## 🧪 Testing on Gorbagana

To get test tokens for development or testing rewards:
👉 [Join the Gorbagana Telegram](https://t.me/gorbagana_portal)
Request tokens with your wallet + short description of your game.

---

## 🧠 Future Improvements

* Live multiplayer (WebSocket or pub/sub)
* Power-ups and in-game animations
* Seasonal rewards with leaderboard resets
* Wallet signature for gameplay validation

---

## 🤝 Contribution

Pull requests and forks welcome for improvement. Degens unite 🧟‍♂️💥
