import fs from "node:fs/promises";
import path from "node:path";
import "dotenv/config";
import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";

const root = process.cwd();
const rpcUrl = process.env.MANTLE_SEPOLIA_RPC_URL || "https://rpc.sepolia.mantle.xyz";
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey || privateKey === "replace_with_deployer_private_key") {
  console.error("Missing PRIVATE_KEY. Export it in your shell or create a local .env from .env.example.");
  process.exit(1);
}

const artifactPath = path.join(root, "artifacts", "YunoDecisionRegistry.json");
let artifact;

try {
  artifact = JSON.parse(await fs.readFile(artifactPath, "utf8"));
} catch {
  console.error("Missing artifact. Run `npm run compile` first.");
  process.exit(1);
}

const provider = new JsonRpcProvider(rpcUrl);
const wallet = new Wallet(privateKey, provider);
const network = await provider.getNetwork();

console.log(`Deploying YunoDecisionRegistry to chain ${network.chainId} from ${wallet.address}`);

const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
const contract = await factory.deploy();
const receipt = await contract.deploymentTransaction().wait();
const address = await contract.getAddress();

await fs.writeFile(
  path.join(root, "deployed-address.js"),
  `window.YUNO_REGISTRY_ADDRESS = "${address}";\n`,
);

const deployment = {
  contract: "YunoDecisionRegistry",
  address,
  chainId: Number(network.chainId),
  transactionHash: receipt.hash,
  blockNumber: receipt.blockNumber,
  deployedAt: new Date().toISOString(),
};

await fs.writeFile(path.join(root, "deployment.json"), `${JSON.stringify(deployment, null, 2)}\n`);

console.log(`Deployed at ${address}`);
console.log(`Transaction ${receipt.hash}`);
console.log("Updated deployed-address.js and deployment.json");
