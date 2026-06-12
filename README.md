# Yuno

Yuno is a capable on-chain worker for Mantle. It researches market signals,
debates risk with specialist agents, recommends or executes a strategy, and
publishes decision proofs that build an agent reputation trail.

Built for the Mantle Turing Test Hackathon 2026.

## What It Demonstrates

- Multi-agent reasoning: Alpha Agent, Risk Agent, and Execution Agent.
- User-defined risk constitution for autonomous strategy limits.
- Signal intake across wallets, liquidity, yield, and market behavior.
- Live Mantle Sepolia signal feed for block number, gas, and wallet balance.
- Action queue that shows the agent's next operational steps.
- Memory update with confidence accuracy, risk compliance, and reputation delta.
- Human vs AI portfolio comparison.
- Decision proof hashing and a visible on-chain memory ledger.
- Mantle Sepolia wallet connection.
- Solidity registry contract for auditable decision records.

## Run Locally

This prototype is dependency-free.

```bash
npm install
npm run dev
```

Open `http://localhost:4173`.

## Contract

The contract is in `contracts/YunoDecisionRegistry.sol`.

It stores compact decision records:

- operator address
- thesis hash
- action hash
- confidence score
- expected ROI
- max drawdown
- metadata URI

The UI currently prepares decision proofs and wallet connection. After deploying
the registry to Mantle Sepolia, wire the deployed address into `app.js` for live
transaction submission.

## Deployment Path

Browser wallet path:

1. Install dependencies with `npm install`.
2. Compile `contracts/YunoDecisionRegistry.sol` with `npm run compile`.
3. Start the app with `npm run dev`.
4. Connect a Mantle Sepolia wallet.
5. Click Deploy Registry and approve the wallet transaction.
6. Click Publish Proof and approve the `recordDecision` transaction.

The proof payload includes the current live Mantle signal snapshot so the
decision record captures the chain conditions Yuno saw before acting.

Terminal deployer path:

1. Install dependencies with `npm install`.
2. Compile `contracts/YunoDecisionRegistry.sol` with `npm run compile`.
3. Copy `.env.example` to `.env` and set `PRIVATE_KEY`.
4. Deploy to Mantle Sepolia with `npm run deploy:mantle-sepolia`.
5. Refresh the app. `deployed-address.js` will contain the registry address and
   the Publish Proof button will submit a real `recordDecision` transaction.

## Hackathon Positioning

Yuno targets three tracks:

- AI Alpha & Data
- Agentic Wallets & Economy
- Consumer & Viral DApps

Core pitch:

> Yuno is the AI agent that earns its reputation on-chain.
