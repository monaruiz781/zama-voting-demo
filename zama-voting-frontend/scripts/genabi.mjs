import fs from "fs";
import path from "path";

const HARDHAT_TEMPLATE_DIR = "../fhevm-hardhat-template";
const DEPLOYMENTS_DIR = path.join(HARDHAT_TEMPLATE_DIR, "deployments");
const ABI_OUTPUT_DIR = "./abi";

// Ensure ABI output directory exists
if (!fs.existsSync(ABI_OUTPUT_DIR)) {
  fs.mkdirSync(ABI_OUTPUT_DIR, { recursive: true });
}

function generateABI() {
  console.log("🔄 Generating ABI files...");

  // Check if deployments directory exists
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    console.warn("⚠️  Deployments directory not found. Please deploy contracts first.");
    return;
  }

  const networks = fs.readdirSync(DEPLOYMENTS_DIR).filter(item => {
    return fs.statSync(path.join(DEPLOYMENTS_DIR, item)).isDirectory();
  });

  if (networks.length === 0) {
    console.warn("⚠️  No deployment networks found.");
    return;
  }

  // Generate VotingSystem ABI and addresses
  generateVotingSystemFiles(networks);

  console.log("✅ ABI files generated successfully!");
}

function generateVotingSystemFiles(networks) {
  const addresses = {};
  let abi = null;

  // Collect addresses from all networks
  for (const network of networks) {
    const contractPath = path.join(DEPLOYMENTS_DIR, network, "VotingSystem.json");
    
    if (fs.existsSync(contractPath)) {
      const contractData = JSON.parse(fs.readFileSync(contractPath, "utf8"));
      
      if (!abi) {
        abi = contractData.abi;
      }

      // Map network names to chain IDs
      const chainIdMap = {
        localhost: 31337,
        hardhat: 31337,
        sepolia: 11155111,
      };

      const chainId = chainIdMap[network] || 31337;
      
      addresses[chainId] = {
        address: contractData.address,
        chainId: chainId,
        chainName: network,
      };
    }
  }

  // Generate ABI file
  if (abi) {
    const abiContent = `// This file is auto-generated. Do not edit manually.
export const VotingSystemABI = {
  abi: ${JSON.stringify(abi, null, 2)}
} as const;
`;

    fs.writeFileSync(path.join(ABI_OUTPUT_DIR, "VotingSystemABI.ts"), abiContent);
    console.log("📝 Generated VotingSystemABI.ts");
  }

  // Generate addresses file
  const addressesContent = `// This file is auto-generated. Do not edit manually.
export const VotingSystemAddresses = ${JSON.stringify(addresses, null, 2)} as const;
`;

  fs.writeFileSync(path.join(ABI_OUTPUT_DIR, "VotingSystemAddresses.ts"), addressesContent);
  console.log("📝 Generated VotingSystemAddresses.ts");
}

// Run the generator
generateABI();
