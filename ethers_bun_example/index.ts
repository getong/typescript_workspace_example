// $ anvil
// Private Keys
// ==================
// (0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

import { ethers } from "ethers";

async function main() {
  // Connect to local Anvil node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Example wallet from Anvil private key (replace with your Anvil private key)
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet Address: ${wallet.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

  // Send transaction example
  const recipient = ethers.Wallet.createRandom().address;

  const tx = await wallet.sendTransaction({
    to: recipient,
    value: ethers.parseEther("0.01"),
  });

  console.log("Transaction Hash:", tx.hash);

  await tx.wait();
  console.log("Transaction confirmed.");
}

main().catch(console.error);
