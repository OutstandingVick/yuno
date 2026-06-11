# Project Handoff

Generated: 2026-06-08  
Workspace source: local repos and Codex session index available on this machine.

## Source Notes

I could not directly open full historical chat transcripts from other threads. The only cross-chat artifact available locally was `/Users/macbook/.codex/session_index.jsonl`, which exposed thread titles and update times. The project details below are grounded in local repositories, README files, package manifests, source trees, and git history.

Relevant Codex thread titles found locally:

- 2026-04-12: Build personal AI agent
- 2026-04-18: Fix anchor build errors
- 2026-04-25: Fix wallet hydration mismatch
- 2026-05-14 / 2026-05-18: Tei: Redesign home feed frontend
- 2026-05-15: Phlenjo: Access Next.js project
- 2026-05-21: Complete AgentOracle handoff
- 2026-05-26: Summarize hackathon strategy
- 2026-05-26: Plan SAP bounty strategy
- 2026-06-04: Inquisitor bounty process
- 2026-06-08: Build frontend portfolio

All primary repos checked during handoff were clean at the time of writing unless otherwise noted.

## High-Level Portfolio

The work clusters into five themes:

1. Solana prediction markets and sports trading: Tei and TeiVF.
2. Autonomous market agents: AgentOracle, Edged, SolScout.
3. Hackathon/bounty agents: Inquisitor and Probeur.
4. Solana DeFi research tools: LP Intelligence and wallet-tracker.
5. Personal/front-end portfolio work: Outstandingvick and a placeholder CRA project.

## Tei

Repo: `/Users/macbook/tei1`  
Primary type: Solana Anchor protocol plus Next.js trading app  
Status: Most mature project in the workspace; main branch clean.

### Purpose

Tei is a live football prediction market protocol on Solana. Users trade match outcome shares through an on-chain AMM rather than a bookmaker. The project was shaped for the Solana Colosseum Frontier Hackathon 2026 and Eitherway sidetrack, with additional Quicknode and Encrypt/Ika positioning.

### Current Capabilities

- Anchor program deployed/targeted for Solana devnet.
- Next.js trading interface in `/Users/macbook/tei1/app`.
- Phantom wallet flow.
- Mock USDC beta trading.
- Buy shares, sell shares, portfolio page, claim winnings.
- Admin resolve panel for MVP settlement.
- Live odds chart with 10m, 20m, and 30m views.
- API-Football integration path.
- Fixture sync script for creating real match markets on-chain.
- Private sealed-auction prototype for confidential pre-trade intent.

### Core On-Chain Surface

- `initialize_platform`
- `create_market`
- `seed_liquidity`
- `buy_shares`
- `sell_shares`
- `resolve_market`
- `claim_winnings`
- `initialize_private_auction`
- `submit_private_intent`
- `finalize_private_auction`

Key paths:

- `/Users/macbook/tei1/programs/tei1/src/lib.rs`
- `/Users/macbook/tei1/tests/tei1.ts`
- `/Users/macbook/tei1/scripts/sync-api-football-markets.ts`
- `/Users/macbook/tei1/app/app`
- `/Users/macbook/tei1/app/components`
- `/Users/macbook/tei1/app/lib`

### Stack

- Solana + Anchor 0.32.1
- Rust
- TypeScript
- Next.js 16 / React 19
- Solana Wallet Adapter
- SPL Token mock USDC
- API-Football
- Planned Quicknode RPC/WebSocket integration

### Run Commands

From `/Users/macbook/tei1`:

```bash
npm run sync:fixtures:dry
npm run sync:fixtures
cargo test -p tei1 --lib
```

From `/Users/macbook/tei1/app`:

```bash
npm run dev
npm run build
npm run lint
```

### Recent Git Context

Recent commits include Vercel frontend build fixes, Encrypt integration work, API integration, Eitherway preparation, and demo-ready functionality. `HEAD` was `53bf6fe Fix Vercel frontend build`.

### Open Risks / Follow-Ups

- Confirm the deployed program ID, IDL, and frontend env values match the current Anchor build.
- Quicknode integration is still framed as in progress in the README.
- Mainnet-beta deployment plan is not complete.
- Private auction flow is a prototype and should be described carefully as architecture/pre-alpha, not production privacy.
- Add a final demo script that covers wallet connect, market selection, buy/sell, chart movement, admin resolve, claim, and private auction.
- Re-run Anchor and Next builds before any public submission.

## TeiVF

Repo: `/Users/macbook/TeiVF`  
Primary type: Earlier or alternate Next.js Tei frontend prototype  
Status: Clean main branch.

### Purpose

TeiVF is a mobile-forward Tei front-end prototype focused on a social/live feed experience called "Match Moments." It appears to predate or sit alongside the full `tei1` protocol app.

### Current Capabilities

- Infinite live market feed.
- Simulated market updates.
- Trade tray.
- Wallet connect/disconnect demo state.
- Currency toggle.
- Market pulse panel.
- Haptics and hot-zone card interactions.

Key paths:

- `/Users/macbook/TeiVF/app/page.tsx`
- `/Users/macbook/TeiVF/components`
- `/Users/macbook/TeiVF/lib`
- `/Users/macbook/TeiVF/src/styles.css`

### Stack

- Next.js
- React
- TypeScript
- Local simulated market data

### Run Commands

```bash
npm run dev
npm run build
```

### Open Risks / Follow-Ups

- Decide whether TeiVF should be retired, archived, or merged into `tei1/app`.
- If keeping it, document how its simulated market model maps to real Tei accounts.
- README is missing; add a short one if this repo remains useful.

## Phlenjo

Repo: `/Users/macbook/phlenjo`  
Primary type: Next.js consumer app prototype  
Status: Clean main branch.

### Purpose

Phlenjo appears to be a Lagos activity/social discovery app. The UI uses a neon Lagos-night visual identity, onboarding, swipe-style activity cards, vibe/progress mechanics, and social activity matching.

### Current Capabilities

- Welcome screen routed into onboarding.
- App frame and mobile-first interaction model.
- Animated, swipe-card style UI.
- Activity art styles for beach, nightlife, food, and culture categories.
- "Squad Voting Feature" appears in git history.

Key paths:

- `/Users/macbook/phlenjo/app/page.tsx`
- `/Users/macbook/phlenjo/app/components`
- `/Users/macbook/phlenjo/app/globals.css`

### Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion

### Run Commands

```bash
npm run dev
npm run build
npm run lint
```

### Open Risks / Follow-Ups

- README is still the default Next.js scaffold; replace it with product-specific documentation.
- Clarify product scope: activity discovery, friend matching, nightlife planning, or all of the above.
- Add persistence/data model if moving beyond prototype.
- Verify onboarding, squad voting, and mobile layout in browser before demo.

## Inquisitor

Repo: `/Users/macbook/Documents/inquisitor`  
Primary type: Hackathon agent prototype  
Status: Clean main branch.

### Purpose

Inquisitor is a Gemini-powered release risk agent for GitLab. It investigates issues, merge requests, pipelines, and release blockers through a GitLab MCP-shaped workflow, then produces a release readiness score and follow-up plan.

### Challenge Context

- Challenge: Building Agents for Real-World Challenges
- Partner track: GitLab
- Agent platform: Google Cloud Agent Builder
- Reasoning model: Gemini 3
- Partner integration: GitLab MCP server

### Current Capabilities

- Local hosted demo UI on port 8787.
- Mock GitLab MCP adapter using `demo-data/release-snapshot.json`.
- Demo GitLab project modeled in `demo-data/gitlab-demo-project.json`.
- GitLab seeding script for labels, issues, merge requests, release branch, and failing pipeline demo state.
- Docs for architecture, demo script, judging guide, partner integration, safety, roadmap, and Devpost draft.

Key paths:

- `/Users/macbook/Documents/inquisitor/src/server/index.js`
- `/Users/macbook/Documents/inquisitor/src/frontend/app.js`
- `/Users/macbook/Documents/inquisitor/src/agent/release-investigator.js`
- `/Users/macbook/Documents/inquisitor/src/mcp`
- `/Users/macbook/Documents/inquisitor/scripts/seed-gitlab-demo.js`
- `/Users/macbook/Documents/inquisitor/docs`

### Stack

- Node.js built-ins
- Browser frontend
- Gemini/GitLab MCP architecture target
- No install required for current prototype

### Run Commands

```bash
npm run dev
npm run check
npm run seed:gitlab -- --dry-run
```

With credentials:

```bash
GITLAB_TOKEN=... GITLAB_PROJECT_ID=... npm run seed:gitlab
```

### Recent Git Context

Recent commits seeded release branches, merge requests, failing release pipeline state, and demo GitLab artifacts. `HEAD` was `c52b41a feat: seed failing release pipeline`.

### Open Risks / Follow-Ups

- Hosted project URL, public repository URL, demo video URL, and Devpost URL are still TBD in README.
- Real Google Cloud Agent Builder and live GitLab MCP integration still need final wiring if judges require live partner integration.
- Keep mock mode available as fallback for demo reliability.
- Verify seeded GitLab project before recording or live presentation.

## Probeur

Repo: `/Users/macbook/Documents/probeur`  
Primary type: Bounty-oriented autonomous agent  
Status: Clean main branch.

### Purpose

Probeur targets the OOBE Protocol x Ace Data Cloud challenge. It discovers SAP agents/tools, validates candidates with Synapse Sentinel, consumes at least three Ace Data Cloud AI services through x402, records SAP escrow/payment evidence, and publishes a run report.

### Bounty Context

- Primary target: Ace Data Cloud Usage / x402 Facilitator
- Secondary target: SAP on-chain escrow path for payment-volume qualification

### Current Capabilities

- Demo mode that runs without private keys or network funds.
- Live mode checklist for Ace, Synapse, Solana wallet, x402 payer, and service selection.
- Reports generated as JSON, Markdown, and HTML.
- Ace proof scripts for AI chat, Google search, and GitHub services.
- Conservative live mode with deduping, paid-action logging, and bounded execution.

Generated artifacts:

- `/Users/macbook/Documents/probeur/data/runs.jsonl`
- `/Users/macbook/Documents/probeur/data/ace-proof.jsonl`
- `/Users/macbook/Documents/probeur/reports/latest.json`
- `/Users/macbook/Documents/probeur/reports/latest.md`
- `/Users/macbook/Documents/probeur/reports/latest.html`
- `/Users/macbook/Documents/probeur/reports/bounty-proof.md`

Key paths:

- `/Users/macbook/Documents/probeur/src/index.js`
- `/Users/macbook/Documents/probeur/src/config.js`
- `/Users/macbook/Documents/probeur/src/report.js`
- `/Users/macbook/Documents/probeur/src/adapters`
- `/Users/macbook/Documents/probeur/src/ace-proof.js`

### Stack

- Node.js ESM
- Optional Ace Data Cloud SDK/client
- Optional OOBE Synapse SAP SDK
- Optional Solana web3.js / Anchor

### Run Commands

```bash
npm run demo
npm run once
npm run check
npm run report
npm run register
npm run ace:ai
npm run ace:google
npm run ace:github
```

### Security Note

The repo contains `.env` and `keys/agent.json`. Do not include those in handoff exports, screenshots, public repos, videos, or issue comments.

### Open Risks / Follow-Ups

- Live success depends on Ace service account availability, Synapse RPC access, and funded Solana/x402 credentials.
- Before submission, regenerate `reports/latest.md` in the exact live configuration to avoid stale proof.
- Make sure the three `ACE_SERVICE_*` values match available services in the Ace account.
- Keep demo mode ready in case live RPC or facilitator services are unstable.

## SolScout / Nosana Agent Challenge

Repo: `/Users/macbook/nosana-agent-challenge`  
Primary type: ElizaOS/Nosana Solana DeFi intelligence agent  
Status: Clean main branch.

### Purpose

SolScout is a personal AI agent for Solana DeFi intelligence. It analyzes Solana wallets, holdings, USD values, pool APYs, protocol comparisons, yield strategy questions, and DeFi concepts. It is built on ElizaOS v2 and deployed through Nosana decentralized GPU infrastructure.

### Current Capabilities

- ElizaOS agent scaffold.
- Character configuration.
- Dockerfile and Nosana job definition.
- Frontend dashboard folder.
- Helius and Jupiter/Birdeye style data positioning in README.
- Live deployment URL documented in README.

Key paths:

- `/Users/macbook/nosana-agent-challenge/src/index.ts`
- `/Users/macbook/nosana-agent-challenge/src/character.ts`
- `/Users/macbook/nosana-agent-challenge/characters/agent.character.json`
- `/Users/macbook/nosana-agent-challenge/frontend`
- `/Users/macbook/nosana-agent-challenge/nos_job_def/nosana_eliza_job_definition.json`

### Stack

- ElizaOS v2
- Nosana
- Next.js frontend
- Docker
- Helius API
- Jupiter Price API / Birdeye-style price data
- Bun / Node.js 23+

### Run Commands

```bash
bun install
elizaos dev
docker build -t solscout-agent .
docker run -p 3000:3000 --env-file .env solscout-agent
```

### Security Note

README examples include API-like values. Before publishing or resharing, rotate any real keys and move examples into `.env.example` placeholders only.

### Open Risks / Follow-Ups

- Verify the live Nosana deployment URL still resolves before demo.
- Confirm frontend and agent ports do not conflict.
- Ensure the agent works with current ElizaOS CLI and Nosana runtime.
- Add a short demo script around wallet analysis, pool APY question, and strategy explanation.

## AgentOracle

Repo/archive: `/Users/macbook/Downloads/agentoracle2`  
Primary type: Autonomous prediction market trader prototype  
Status: Not a git repo in the discovered local folder, but contains README and app files.

### Purpose

AgentOracle is an Agora Hackathon 2026 autonomous AI prediction market trader. It scans Polymarket, uses Gemini to estimate fair probability, sizes bets with Kelly, and executes autonomously in paper mode by default.

### Current Capabilities

- Next.js 14 app.
- Polymarket CLOB + Gamma API architecture.
- Gemini 1.5 Flash probability estimation.
- Half-Kelly sizing with 5% cap.
- Public reasoning trace.
- Arc L1 / Circle Wallets planned as Day 3 settlement layer.

Key paths:

- `/Users/macbook/Downloads/agentoracle2/README.md`
- `/Users/macbook/Downloads/agentoracle2/package.json`
- `/Users/macbook/Downloads/agentoracle2/scripts/generate-entity-secret.js`

### Run Commands

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### Open Risks / Follow-Ups

- This appears superseded or complemented by Edged, which has a fuller Circle/Arc implementation.
- Confirm whether AgentOracle should be archived, renamed, or folded into Edged.
- Do not publish `.env.local` or generated Circle entity secrets.

## Edged

Repo: `/Users/macbook/Downloads/edged`  
Primary type: Autonomous prediction market intelligence and execution app  
Status: Clean main branch.

### Purpose

Edged is a more complete autonomous prediction market agent. It scans Polymarket, estimates fair probability with DeepSeek or Gemini fallback, sizes exposure with half-Kelly, publishes reasoning traces, and can execute capped USDC actions through Circle developer-controlled wallets on Arc Testnet.

### Current Capabilities

- Next.js dashboard.
- `/api/agent/run` for scan/reason/size/execute loop.
- `/api/agent/watch` for repeated scans.
- `/api/agent/history` for in-memory run history.
- `/api/analyze` for DeepSeek/Gemini probability analysis.
- `/api/trace/[runId]` for JSON run trace.
- `/api/wallet` for Circle wallet status and balances.
- Paper mode by default.
- Capped live Arc Testnet USDC transfer mode.
- Watch mode, treasury balance, execution mode, escrow destination, action history, and trace links in UI.

Key paths:

- `/Users/macbook/Downloads/edged/app`
- `/Users/macbook/Downloads/edged/lib/agent.js`
- `/Users/macbook/Downloads/edged/lib/circle.js`
- `/Users/macbook/Downloads/edged/lib/polymarket.js`
- `/Users/macbook/Downloads/edged/lib/runs.js`
- `/Users/macbook/Downloads/edged/scripts/generate-entity-secret.js`

### Stack

- Next.js 14
- React 18
- DeepSeek
- Gemini fallback
- Polymarket Gamma and CLOB APIs
- Circle Developer-Controlled Wallets
- Arc Testnet
- Tailwind CSS

### Run Commands

```bash
npm install
cp .env.local.example .env.local
npm run dev
npm run build
```

### Demo Path

1. Show funded Circle Arc Testnet treasury.
2. Run Edged or open a previous run.
3. Open a market thesis card.
4. Show AI provider tag, probability edge, Kelly size, and reasoning trace.
5. Show Arc transfer in UI.
6. Show completed transfer in Circle Console.

### Open Risks / Follow-Ups

- Ensure `PAPER_TRADING=false` is only used when testnet wallet/escrow values are correct.
- Live mode should remain capped with `CIRCLE_MAX_LIVE_TRADE_USDC=1` or lower.
- Confirm DeepSeek API key and fallback Gemini behavior before demo.
- If submitting publicly, scrub all real env values and entity secrets.

## LP Intelligence

Repo: `/Users/macbook/lp-intelligence`  
Primary type: React research dashboard for Meteora DLMM LP behavior  
Status: Clean main branch.

### Purpose

LP Intelligence helps analyze Meteora DLMM pools and top liquidity provider behavior. It supports a disciplined 0.5 to 100 SOL compounding strategy through pool analysis, wallet drill-down, position history, strategy signals, and a compounding simulator.

### Current Capabilities

- Pool analysis through lpagent.io API.
- Wallet drill-down for LPer position history.
- This-pool/all-pools scope toggle.
- Insight strip for copy trades, dominant strategy, and win-rate quality.
- Compounder simulation with variance modeling.
- Demo mode with mock data.

Key paths:

- `/Users/macbook/lp-intelligence/src/App.jsx`
- `/Users/macbook/lp-intelligence/src/lib/api.js`
- `/Users/macbook/lp-intelligence/src/lib/utils.js`
- `/Users/macbook/lp-intelligence/src/components`

### Stack

- React 18
- Create React App
- Chart.js
- react-chartjs-2
- lpagent.io API

### Run Commands

```bash
npm install
cp .env.example .env
npm start
npm run build
```

### Open Risks / Follow-Ups

- Add own-wallet tracking for open and closed positions.
- Add pool discovery and filterable signal view.
- Add lookback window selector.
- Add CSV export.
- Add alerts when pool signal changes.

## wallet-tracker

Repo: `/Users/macbook/wallet-tracker`  
Primary type: Appears to be a duplicate or fork of LP Intelligence  
Status: Clean main branch.

### Notes

Despite the folder name, README and package metadata match LP Intelligence. Treat this as either:

- an accidental duplicate of `/Users/macbook/lp-intelligence`, or
- a future place to split out the "own wallet tracker" roadmap item.

### Open Risks / Follow-Ups

- Decide whether to delete/archive, rename, or repurpose.
- If repurposed, update README, package name, and UI scope to actual wallet tracking.
- Avoid maintaining two divergent copies of the same LP dashboard.

## Outstandingvick Portfolio

Repo: `/Users/macbook/Documents/projects/Outstandingvick`  
Primary type: Personal portfolio website  
Status: Clean main branch.

### Purpose

Outstandingvick is a personal Web3 writer/researcher portfolio. It showcases writing, research, community leadership, narrative strategy, marketing work, and social media management.

### Current Capabilities

- Responsive portfolio layout.
- Floating glassmorphism navigation.
- Typography-led hero.
- Featured works section.
- Bento-box experience grid.
- Magnetic/footer call to action.
- Mobile hamburger menu.
- Live site documented as `outstandingvick.vercel.app`.

### Stack

- React 18
- Tailwind CSS
- lucide-react
- react-icons
- react-router-dom
- Vercel deployment

### Run Commands

```bash
npm install
npm start
npm run build
```

### Open Risks / Follow-Ups

- The README includes a malformed clone command with Markdown link syntax inside a code block; clean this before public handoff.
- If this corresponds to the 2026-06-08 "Build frontend portfolio" session, this is the actual project; `/Users/macbook/my-project` is still only CRA scaffold.
- Verify production site after any content changes.

## my-project

Repo: `/Users/macbook/my-project`  
Primary type: Create React App placeholder  
Status: Clean main branch.

### Notes

This folder is still the default CRA starter app. It does not currently contain meaningful portfolio/product work.

### Recommendation

Archive or delete if unused. If it was meant to become a frontend portfolio, use `/Users/macbook/Documents/projects/Outstandingvick` instead as the real portfolio codebase.

## Strategy / Planning Threads Without Clear Repos

### Hackathon Strategy

Session title: `Summarize hackathon strategy` on 2026-05-26.

Likely connected projects:

- Tei for Solana Colosseum / Eitherway / Quicknode / Encrypt positioning.
- AgentOracle or Edged for Agora/Circle/Arc prediction-market agent positioning.
- SolScout for Nosana/ElizaOS.

Action for future handoff owner:

- Consolidate all hackathon submissions into a tracker with columns for project, bounty, required proof, demo URL, video URL, Devpost URL, repo URL, and final status.

### SAP Bounty Strategy

Session title: `Plan SAP bounty strategy` on 2026-05-26.

Likely connected project:

- Probeur.

Action for future handoff owner:

- Keep the bounty proof centered on autonomous paid action evidence: trigger, service selection, x402 payment evidence, SAP escrow evidence, and final report.

## Cross-Project Security Checklist

Before sharing any repo, video, screenshot, or zip:

- Do not expose `.env`, `.env.local`, `.env.example` values that are real credentials.
- Do not expose `/keys/agent.json`.
- Do not expose Circle entity secrets.
- Rotate any API keys that appeared in READMEs or screen recordings.
- Confirm public repos have placeholder env docs only.
- Keep live trading/execution modes capped and testnet-only unless explicitly productionized.

## Cross-Project Operational Checklist

For every active repo before demo/submission:

1. Run install with the intended package manager.
2. Run build or syntax check.
3. Start local app and verify the happy path in browser.
4. Confirm env vars match the target network/provider.
5. Record a short demo script and fallback path.
6. Commit only intentional changes.
7. Push and tag the final submission state if the platform allows it.

## Recommended Priority Order

1. Tei: strongest flagship project; finish Quicknode/public deployment and demo polish.
2. Edged: strongest autonomous market-agent execution story; verify Circle/Arc proof.
3. Inquisitor: strong GitLab/Gemini bounty artifact; finish hosted URL/demo assets.
4. Probeur: strong bounty proof generator; regenerate final live reports carefully.
5. SolScout: verify live Nosana deployment and tighten demo script.
6. Phlenjo: clarify product direction and replace scaffold README.
7. Outstandingvick portfolio: keep updated as public credibility layer.
8. LP Intelligence/wallet-tracker: consolidate duplicate folders and advance only one codebase.
9. AgentOracle: archive or merge into Edged unless there is a separate submission reason.

