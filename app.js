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
    signals: [
      "Whale rotation away from high beta wallets",
      "mETH pool depth stable across core routes",
      "RWA yield spread remains positive after slippage",
    ],
    queue: [
      "Reject volatile allocation above constitution cap",
      "Simulate mETH / USDY / MNT rebalance",
      "Publish thesis and action hash to registry",
    ],
    memory: { accuracy: 81, compliance: "Passed", delta: 1.6 },
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
    signals: [
      "MNT momentum confirmed by wallet clustering",
      "Liquidity depth supports controlled route size",
      "Social velocity rising without matching drawdown spike",
    ],
    queue: [
      "Check confidence against minimum threshold",
      "Increase MNT only inside risk cap",
      "Schedule emergency review on drawdown trigger",
    ],
    memory: { accuracy: 86, compliance: "Passed", delta: 2.1 },
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
    signals: [
      "USDY carry leads risk-adjusted opportunity set",
      "Volatility compression favors yield over beta",
      "Exit liquidity remains above agent threshold",
    ],
    queue: [
      "Rotate toward USDY carry allocation",
      "Keep mETH as liquidity and upside ballast",
      "Recheck oracle freshness before execution",
    ],
    memory: { accuracy: 83, compliance: "Passed", delta: 1.8 },
  },
};

const state = {
  scenario: "defensive",
  wallet: null,
  lastDecision: null,
  provider: null,
  signer: null,
  registryAddress: window.localStorage.getItem("yunoRegistryAddress") || window.YUNO_REGISTRY_ADDRESS || "",
  liveSignals: {
    chain: "Mantle Sepolia",
    blockNumber: null,
    gasGwei: null,
    walletBalance: null,
    updatedAt: null,
  },
};

const REGISTRY_ABI = [
  "function recordDecision(bytes32 thesisHash, bytes32 actionHash, uint16 confidenceBps, int32 expectedRoiBps, uint32 maxDrawdownBps, string metadataURI) external returns (uint256)",
];

const els = {
  connectWallet: document.querySelector("#connectWallet"),
  deployRegistry: document.querySelector("#deployRegistry"),
  refreshSignals: document.querySelector("#refreshSignals"),
  runCycle: document.querySelector("#runCycle"),
  publishDecision: document.querySelector("#publishDecision"),
  resetCycle: document.querySelector("#resetCycle"),
  walletState: document.querySelector("#walletState"),
  registryState: document.querySelector("#registryState"),
  proofModeState: document.querySelector("#proofModeState"),
  liveBlock: document.querySelector("#liveBlock"),
  liveGas: document.querySelector("#liveGas"),
  liveBalance: document.querySelector("#liveBalance"),
  decisionLog: document.querySelector("#decisionLog"),
  volatilityCap: document.querySelector("#volatilityCap"),
  volatilityValue: document.querySelector("#volatilityValue"),
  confidenceFloor: document.querySelector("#confidenceFloor"),
  confidenceValue: document.querySelector("#confidenceValue"),
  drawdownLimit: document.querySelector("#drawdownLimit"),
  drawdownValue: document.querySelector("#drawdownValue"),
  signalList: document.querySelector("#signalList"),
  actionQueue: document.querySelector("#actionQueue"),
  accuracyMetric: document.querySelector("#accuracyMetric"),
  complianceMetric: document.querySelector("#complianceMetric"),
  reputationDelta: document.querySelector("#reputationDelta"),
  cycleState: document.querySelector("#cycleState"),
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

function updateRegistryState() {
  if (state.registryAddress) {
    els.registryState.textContent = `Registry ready: ${state.registryAddress}`;
    els.deployRegistry.textContent = "Registry Ready";
    els.proofModeState.textContent =
      "Registry is ready. Publish Proof will submit on-chain when the wallet has Mantle Sepolia gas.";
    els.proofModeState.classList.add("ready");
    return;
  }

  els.registryState.textContent = "Registry not deployed";
  els.deployRegistry.textContent = "Deploy Registry";
  els.proofModeState.textContent =
    "Prepared proof mode is active until the registry is deployed or testnet MNT is available.";
  els.proofModeState.classList.remove("ready");
}

function formatMnt(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "unknown";
  }

  if (amount === 0) {
    return "0.000";
  }

  if (amount < 0.001) {
    return "<0.001";
  }

  return amount.toFixed(3);
}

function renderLiveSignals() {
  els.liveBlock.textContent = state.liveSignals.blockNumber
    ? Number(state.liveSignals.blockNumber).toLocaleString()
    : "unavailable";
  els.liveGas.textContent = state.liveSignals.gasGwei
    ? `${Number(state.liveSignals.gasGwei).toFixed(3)} gwei`
    : "unavailable";
  els.liveBalance.textContent =
    state.liveSignals.walletBalance === null ? "connect" : `${formatMnt(state.liveSignals.walletBalance)} MNT`;
}

async function fetchMantleSignals() {
  try {
    let provider = state.provider;
    if (!provider && window.ethers) {
      provider = new window.ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
    }

    if (!provider) {
      throw new Error("Ethers not loaded");
    }

    const [blockNumber, feeData] = await Promise.all([
      provider.getBlockNumber(),
      provider.getFeeData(),
    ]);
    const gasGwei = feeData.gasPrice ? Number(window.ethers.formatUnits(feeData.gasPrice, "gwei")) : null;
    let walletBalance = state.liveSignals.walletBalance;

    if (state.wallet) {
      const balance = await provider.getBalance(state.wallet);
      walletBalance = window.ethers.formatEther(balance);
    }

    state.liveSignals = {
      chain: "Mantle Sepolia",
      blockNumber,
      gasGwei,
      walletBalance,
      updatedAt: new Date().toISOString(),
    };
    renderLiveSignals();
  } catch (error) {
    els.liveBlock.textContent = "offline";
    els.liveGas.textContent = "offline";
    if (!state.wallet) {
      els.liveBalance.textContent = "connect";
    }
  }
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
  els.signalList.innerHTML = data.signals.map((signal) => `<li>${signal}</li>`).join("");
  els.actionQueue.innerHTML = data.queue.map((action) => `<li>${action}</li>`).join("");
  els.accuracyMetric.textContent = `${data.memory.accuracy}%`;
  els.complianceMetric.textContent = data.memory.compliance;
  els.reputationDelta.textContent = `+${data.memory.delta.toFixed(1)}`;

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
    signals: data.signals,
    actionQueue: data.queue,
    memoryUpdate: data.memory,
    liveSignals: state.liveSignals,
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
  const status = decision.payload.status ? ` • ${decision.payload.status}` : "";
  entry.innerHTML = `
    <time>${time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
    <div>
      <strong>${decision.payload.scenario}</strong>
      <p>${decision.payload.thesis}${status}</p>
    </div>
    <code>${decision.hash.slice(0, 18)}...</code>
  `;
  els.decisionLog.prepend(entry);
}

function prepareLocalProof(decision, reason) {
  state.lastDecision = {
    ...decision,
    payload: {
      ...decision.payload,
      status: "prepared-local-proof",
      fallbackReason: reason,
    },
  };
  els.cycleState.textContent = "Proof prepared";
  els.proofModeState.textContent = `Prepared proof saved locally: ${reason}`;
  els.proofModeState.classList.remove("ready");
  document.querySelector("#proofHash").textContent = `${decision.hash.slice(0, 18)}...`;
  addLedgerEntry(state.lastDecision);
}

function runCycle() {
  const decision = buildDecision("debated");
  state.lastDecision = decision;
  els.cycleState.textContent = "Cycle debated";
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

  if (window.ethers) {
    state.provider = new window.ethers.BrowserProvider(window.ethereum);
    state.signer = await state.provider.getSigner();
  }

  await fetchMantleSignals();
}

async function deployRegistry() {
  try {
    if (!state.wallet || !state.signer) {
      await connectWallet();
    }

    if (!state.signer || !window.ethers) {
      els.walletState.textContent = "Connect an EVM wallet before deploying.";
      return;
    }

    els.walletState.textContent = "Preparing registry deployment...";
    const response = await fetch("artifacts/YunoDecisionRegistry.json");
    if (!response.ok) {
      throw new Error("Compile the registry first with npm run compile.");
    }

    const artifact = await response.json();
    const factory = new window.ethers.ContractFactory(artifact.abi, artifact.bytecode, state.signer);
    els.walletState.textContent = "Waiting for deployment signature...";
    const contract = await factory.deploy();
    state.registryAddress = await contract.getAddress();
    updateRegistryState();
    els.walletState.textContent = `Deploying: ${state.registryAddress}`;
    await contract.deploymentTransaction().wait();
    window.localStorage.setItem("yunoRegistryAddress", state.registryAddress);
    updateRegistryState();
    els.walletState.textContent = `Registry deployed: ${shortAddress(state.registryAddress)}`;
  } catch (error) {
    els.walletState.textContent = error?.shortMessage || error?.message || "Deployment rejected";
  }
}

async function publishDecision() {
  const decision = state.lastDecision || buildDecision("ready");
  state.lastDecision = { ...decision, payload: { ...decision.payload, status: "published" } };
  els.cycleState.textContent = "Proof prepared";
  document.querySelector("#proofHash").textContent = `${decision.hash.slice(0, 18)}...`;

  if (!state.wallet) {
    prepareLocalProof(decision, "wallet not connected");
    els.walletState.textContent = "Proof prepared. Connect wallet to submit on Mantle.";
    return;
  }

  const registryAddress = state.registryAddress;
  if (!registryAddress || !window.ethers || !state.signer) {
    prepareLocalProof(decision, "registry not deployed yet");
    els.walletState.textContent =
      "Proof prepared locally. Deploy registry when testnet MNT is available.";
    return;
  }

  if (Number(state.liveSignals.walletBalance || 0) <= 0) {
    prepareLocalProof(decision, "wallet has no Mantle Sepolia MNT for gas");
    els.walletState.textContent = "Proof prepared locally. Waiting for Mantle Sepolia gas.";
    return;
  }

  try {
    els.walletState.textContent = "Waiting for wallet signature...";
    const registry = new window.ethers.Contract(registryAddress, REGISTRY_ABI, state.signer);
    const data = currentScenario();
    const thesisHash = window.ethers.id(decision.payload.thesis);
    const actionHash = window.ethers.id(JSON.stringify(decision.payload.actionQueue));
    const confidenceBps = data.confidence * 100;
    const expectedRoiBps = Math.round(data.roi * 100);
    const maxDrawdownBps = Math.round(data.drawdown * 100);
    const metadataURI = `data:application/json,${encodeURIComponent(JSON.stringify(decision.payload))}`;
    const tx = await registry.recordDecision(
      thesisHash,
      actionHash,
      confidenceBps,
      expectedRoiBps,
      maxDrawdownBps,
      metadataURI,
    );
    els.walletState.textContent = `Submitted: ${tx.hash.slice(0, 10)}...`;
    const receipt = await tx.wait();
    state.lastDecision = {
      ...state.lastDecision,
      payload: {
        ...state.lastDecision.payload,
        status: "recorded",
        transactionHash: receipt.hash,
      },
    };
    els.cycleState.textContent = "Proof recorded";
    addLedgerEntry(state.lastDecision);
    els.walletState.textContent = `Recorded on Mantle: ${receipt.hash.slice(0, 10)}...`;
  } catch (error) {
    const message = error?.shortMessage || error?.message || "Transaction rejected";
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes("insufficient funds") ||
      lowerMessage.includes("funds") ||
      lowerMessage.includes("gas")
    ) {
      prepareLocalProof(decision, "wallet needs Mantle Sepolia MNT for gas");
      els.walletState.textContent = "Proof prepared locally. Waiting for testnet gas.";
      return;
    }

    addLedgerEntry(state.lastDecision);
    els.walletState.textContent = error?.shortMessage || error?.message || "Transaction rejected";
  }
}

function resetCycle() {
  state.lastDecision = null;
  els.cycleState.textContent = "Cycle ready";
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
els.deployRegistry.addEventListener("click", deployRegistry);
els.refreshSignals.addEventListener("click", fetchMantleSignals);
els.runCycle.addEventListener("click", runCycle);
els.publishDecision.addEventListener("click", publishDecision);
els.resetCycle.addEventListener("click", resetCycle);

updateRangeLabels();
updateRegistryState();
renderLiveSignals();
applyScenario();
runCycle();
fetchMantleSignals();
window.setInterval(fetchMantleSignals, 30_000);

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
