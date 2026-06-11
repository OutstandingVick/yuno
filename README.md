# Yuno

Yuno is a capable on-chain worker for Mantle. It researches market signals,
debates risk with specialist agents, recommends or executes a strategy, and
publishes decision proofs that build an agent reputation trail.

Built for the Mantle Turing Test Hackathon 2026.

## What It Demonstrates

- Multi-agent reasoning: Alpha Agent, Risk Agent, and Execution Agent.
- User-defined risk constitution for autonomous strategy limits.
- Human vs AI portfolio comparison.
- Decision proof hashing and a visible on-chain memory ledger.
- Mantle Sepolia wallet connection.
- Solidity registry contract for auditable decision records.

## Run Locally

This prototype is dependency-free.

```bash
python3 -m http.server 4173
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

## Hackathon Positioning

Yuno targets three tracks:

- AI Alpha & Data
- Agentic Wallets & Economy
- Consumer & Viral DApps

Core pitch:

> Yuno is the AI agent that earns its reputation on-chain.
