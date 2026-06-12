import fs from "node:fs/promises";
import path from "node:path";
import solc from "solc";

const root = process.cwd();
const contractPath = path.join(root, "contracts", "YunoDecisionRegistry.sol");
const source = await fs.readFile(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "YunoDecisionRegistry.sol": {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const errors = output.errors || [];
const fatalErrors = errors.filter((item) => item.severity === "error");

for (const item of errors) {
  const label = item.severity === "error" ? "ERROR" : "WARN";
  console.log(`${label}: ${item.formattedMessage}`);
}

if (fatalErrors.length > 0) {
  process.exit(1);
}

const contract = output.contracts["YunoDecisionRegistry.sol"].YunoDecisionRegistry;
const artifact = {
  contractName: "YunoDecisionRegistry",
  abi: contract.abi,
  bytecode: `0x${contract.evm.bytecode.object}`,
};

await fs.mkdir(path.join(root, "artifacts"), { recursive: true });
await fs.writeFile(
  path.join(root, "artifacts", "YunoDecisionRegistry.json"),
  `${JSON.stringify(artifact, null, 2)}\n`,
);

console.log("Compiled artifacts/YunoDecisionRegistry.json");
