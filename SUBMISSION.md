# Yuno Hackathon Submission Draft

## One-Liner

Yuno is a capable AI worker for Mantle that researches DeFi/RWA signals,
debates risk, recommends or executes strategies, and publishes decision proofs
to build on-chain agent reputation.

## Problem

AI finance agents are hard to trust. They can sound confident, but users and
protocols need to know what the agent saw, why it acted, which rules constrained
it, and whether the result improved its reputation.

## Solution

Yuno turns agent behavior into a verifiable work loop:

1. Perceive Mantle market, wallet, liquidity, and yield signals.
2. Reason through a multi-agent debate between alpha, risk, and execution roles.
3. Execute or simulate a portfolio strategy under a user-defined risk
   constitution.
4. Prove the decision through hashes and a Mantle decision registry.
5. Learn by updating reputation based on ROI, confidence accuracy, and drawdown.

The demo makes the loop visible through live signal intake, an action queue,
memory updates, and a decision ledger. Judges can see what Yuno observed, what
it decided, which constraints it followed, and how the decision affects its
future reputation.

## Tracks

- AI Alpha & Data
- Agentic Wallets & Economy
- Consumer & Viral DApps

## Why Mantle

Mantle is the right home for Yuno because the hackathon centers on auditable
agentic AI, DeFi, RWA strategies, and on-chain benchmarking. Yuno uses Mantle as
the memory and reputation layer for autonomous workers.

## Demo Script

1. Open Yuno and connect a Mantle Sepolia wallet.
2. Select a market scenario: Defensive Rotation, Momentum Breakout, or RWA Yield
   Hunt.
3. Run the agent cycle.
4. Show the Alpha Agent, Risk Agent, and Execution Agent debate.
5. Show signal intake, action queue, and memory update.
6. Show the selected allocation and Human vs AI metrics.
7. Publish a proof and show the decision ledger.
8. Explain how the Solidity registry records compact proofs on Mantle.

## Future Work

- Deploy `YunoDecisionRegistry` to Mantle Sepolia.
- Connect live Mantle DeFi and RWA data sources.
- Add real strategy execution behind explicit user approval.
- Add ERC-8004-compatible identity and reputation metadata.
- Add social share cards for viral agent decisions.
