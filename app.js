const scenarios = {
  defensive: {
    title: "Defensive Rotation",
    alpha:
      "Smart wallets are reducing volatile exposure while mETH depth holds. Opportunity favors defensive yield with optional upside.",
    risk:
      "Cap volatile allocation at 30%. Avoid shallow pools and reject any route that increases drawdown risk beyond user limits.",
    execution:
      "Route into a 55% mETH, 30% USDY, 15% MNT strategy and monitor for slippage or abnormal liquidity movement.",
    thesis: "Defensive yield beats raw beta this cycle.",
    action: "Rebalance to mETH / USDY / MNT",
    confidence: 78,
    reputation: 82.4,
    roi: 4.8,
    drawdown: 3.2,
    allocation: { mETH: 55, USDY: 30, MNT: 15 },
  },
  momentum: {
    title: "Momentum Breakout",
    alpha:
      "MNT momentum is accelerating while liquidity remains healthy across core routes. Breakout strength is confirmed by wallet clustering.",
    risk:
      "Momentum is valid, but position size must stay below the volatility cap. Require confidence above the user floor before execution.",
    execution:
      "Allocate 45% MNT, 35% mETH, 20% USDY and place a stop condition if drawdown breaches the constitution.",
    thesis: "Momentum justifies controlled beta exposure.",
    action: "Increase MNT with mETH ballast",
    confidence: 84,
    reputation: 85.1,
    roi: 7.6,
    drawdown: 6.8,
    allocation: { mETH: 35, USDY: 20, MNT: 45 },
  },
  yield: {
    title: "RWA Yield Hunt",
    alpha:
      "USDY yield is attractive while market volatility compresses. Capital can earn without chasing unstable short-term token moves.",
    risk:
      "RWA concentration is acceptable if liquidity exit depth stays above threshold and oracle freshness remains within tolerance.",
    execution:
      "Allocate 60% USDY, 30% mETH, 10% MNT and schedule a review when yields or liquidity move outside bounds.",
    thesis: "Stable RWA yield is the highest quality return right now.",
    action: "Rotate toward USDY carry",
    confidence: 81,
    reputation: 83.8,
    roi: 5.4,
    drawdown: 2.4,
    allocation: { mETH: 30, USDY: 60, MNT: 10 },
  },
};

const state = {
  scenario: "defensive",
  wallet: null,
  lastDecision: null,
};

const els = {
  connectWallet: document.querySelector("#connectWallet"),
  runCycle: document.querySelector("#runCycle"),
  publishDecision: document.querySelector("#publishDecision"),
  resetCycle: document.querySelector("#resetCycle"),
  walletState: document.querySelector("#walletState"),
  decisionLog: document.querySelector("#decisionLog"),
  volatilityCap: document.querySelector("#volatilityCap"),
  volatilityValue: document.querySelector("#volatilityValue"),
  confidenceFloor: document.querySelector("#confidenceFloor"),
  confidenceValue: document.querySelector("#confidenceValue"),
  drawdownLimit: document.querySelector("#drawdownLimit"),
  drawdownValue: document.querySelector("#drawdownValue"),
};

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function pseudoHash(input) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const hex = ((h1 ^ (h2 >>> 0)) >>> 0).toString(16).padStart(8, "0");
  return `0x${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}`;
}

function currentScenario() {
  return scenarios[state.scenario];
}

function updateRangeLabels() {
  els.volatilityValue.textContent = els.volatilityCap.value;
  els.confidenceValue.textContent = els.confidenceFloor.value;
  els.drawdownValue.textContent = els.drawdownLimit.value;
}

function applyScenario() {
  const data = currentScenario();
  document.querySelector("#scenarioTitle").textContent = data.title;
  document.querySelector("#alphaVoice").textContent = data.alpha;
  document.querySelector("#riskVoice").textContent = data.risk;
  document.querySelector("#executionVoice").textContent = data.execution;
  document.querySelector("#thesisText").textContent = data.thesis;
  document.querySelector("#actionText").textContent = data.action;
  document.querySelector("#confidenceScore").textContent = `${data.confidence}%`;
  document.querySelector("#reputationScore").textContent = data.reputation.toFixed(1);
  document.querySelector("#roiMetric").textContent = `+${data.roi.toFixed(1)}%`;
  document.querySelector("#drawdownMetric").textContent = `-${data.drawdown.toFixed(1)}%`;

  const { mETH, USDY, MNT } = data.allocation;
  document.querySelector("#barMeth").style.width = `${mETH}%`;
  document.querySelector("#barUsdy").style.width = `${USDY}%`;
  document.querySelector("#barMnt").style.width = `${MNT}%`;
  document.querySelector("#allocMeth").textContent = `${mETH}%`;
  document.querySelector("#allocUsdy").textContent = `${USDY}%`;
  document.querySelector("#allocMnt").textContent = `${MNT}%`;

  document.querySelectorAll(".scenario-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === state.scenario);
  });
}

function buildDecision(status = "simulated") {
  const data = currentScenario();
  const timestamp = new Date().toISOString();
  const payload = {
    agent: "Yuno",
    track: "AI Alpha & Data / Agentic Wallets",
    scenario: data.title,
    thesis: data.thesis,
    action: data.action,
    confidence: data.confidence,
    roi: data.roi,
    drawdown: data.drawdown,
    allocation: data.allocation,
    constitution: {
      maxVolatileExposure: Number(els.volatilityCap.value),
      minimumConfidence: Number(els.confidenceFloor.value),
      maxDrawdown: Number(els.drawdownLimit.value),
    },
    timestamp,
    status,
  };

  return {
    payload,
    hash: pseudoHash(JSON.stringify(payload)),
  };
}

function addLedgerEntry(decision) {
  const entry = document.createElement("article");
  entry.className = "ledger-entry";
  const time = new Date(decision.payload.timestamp);
  entry.innerHTML = `
    <time>${time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
    <div>
      <strong>${decision.payload.scenario}</strong>
      <p>${decision.payload.thesis}</p>
    </div>
    <code>${decision.hash.slice(0, 18)}...</code>
  `;
  els.decisionLog.prepend(entry);
}

function runCycle() {
  const decision = buildDecision("debated");
  state.lastDecision = decision;
  document.querySelector("#proofHash").textContent = `${decision.hash.slice(0, 18)}...`;
  addLedgerEntry(decision);
}

async function connectWallet() {
  if (!window.ethereum) {
    els.walletState.textContent = "No EVM wallet detected";
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  state.wallet = accounts[0];
  els.connectWallet.textContent = shortAddress(state.wallet);
  els.walletState.textContent = `Connected: ${shortAddress(state.wallet)}`;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x138b" }],
    });
  } catch (error) {
    if (error && error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x138b",
            chainName: "Mantle Sepolia Testnet",
            nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
            rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
            blockExplorerUrls: ["https://sepolia.mantlescan.xyz"],
          },
        ],
      });
    }
  }
}

async function publishDecision() {
  const decision = state.lastDecision || buildDecision("ready");
  state.lastDecision = { ...decision, payload: { ...decision.payload, status: "published" } };
  document.querySelector("#proofHash").textContent = `${decision.hash.slice(0, 18)}...`;
  addLedgerEntry(state.lastDecision);

  if (!state.wallet) {
    els.walletState.textContent = "Proof prepared. Connect wallet to submit on Mantle.";
    return;
  }

  els.walletState.textContent =
    "Proof ready. Add deployed registry address in app.js to submit a real transaction.";
}

function resetCycle() {
  state.lastDecision = null;
  document.querySelector("#proofHash").textContent = "pending";
  els.decisionLog.innerHTML = "";
  applyScenario();
}

document.querySelectorAll(".scenario-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.scenario = button.dataset.scenario;
    applyScenario();
    runCycle();
  });
});

[els.volatilityCap, els.confidenceFloor, els.drawdownLimit].forEach((range) => {
  range.addEventListener("input", updateRangeLabels);
});

els.connectWallet.addEventListener("click", connectWallet);
els.runCycle.addEventListener("click", runCycle);
els.publishDecision.addEventListener("click", publishDecision);
els.resetCycle.addEventListener("click", resetCycle);

updateRangeLabels();
applyScenario();
runCycle();

const canvas = document.querySelector("#agentCanvas");
const ctx = canvas.getContext("2d");
let tick = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawAgentMap() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#070d09";
  ctx.fillRect(0, 0, w, h);

  const centerX = w / 2;
  const centerY = h / 2 - 12;
  const nodes = [
    { label: "Signals", angle: 0 },
    { label: "Risk", angle: Math.PI / 2 },
    { label: "Route", angle: Math.PI },
    { label: "Proof", angle: (Math.PI * 3) / 2 },
  ];
  const radius = Math.min(w, h) * 0.29;

  ctx.strokeStyle = "rgba(156, 255, 125, 0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + i * 26, 0, Math.PI * 2);
    ctx.stroke();
  }

  nodes.forEach((node, index) => {
    const pulse = Math.sin(tick * 0.025 + index) * 8;
    const x = centerX + Math.cos(node.angle + tick * 0.003) * (radius + pulse);
    const y = centerY + Math.sin(node.angle + tick * 0.003) * (radius + pulse);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(107, 231, 216, 0.22)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fillStyle = index % 2 === 0 ? "rgba(156, 255, 125, 0.16)" : "rgba(107, 231, 216, 0.16)";
    ctx.fill();
    ctx.strokeStyle = index % 2 === 0 ? "#9cff7d" : "#6be7d8";
    ctx.stroke();

    ctx.fillStyle = "#edf5ea";
    ctx.font = "700 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.label, x, y + 4);
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, 56 + Math.sin(tick * 0.04) * 4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 200, 87, 0.14)";
  ctx.fill();
  ctx.strokeStyle = "#ffc857";
  ctx.stroke();

  ctx.fillStyle = "#edf5ea";
  ctx.font = "900 28px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Yuno", centerX, centerY + 8);

  tick += 1;
  requestAnimationFrame(drawAgentMap);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawAgentMap();
