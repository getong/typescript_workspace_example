import { ethers } from "ethers";
import fs from "fs";

// Load compiled ABI and Bytecode
const abi = JSON.parse(fs.readFileSync("./artifacts/Counter.abi", "utf8"));
const bytecode = fs.readFileSync("./artifacts/Counter.bin", "utf8");

async function deploy() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Replace this with your Anvil private key
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

  console.log("Deploying contract...");

  const CounterFactory = new ethers.ContractFactory(abi, bytecode, wallet);

  const contract = await CounterFactory.deploy(123); // initial count = 123

  await contract.waitForDeployment();

  console.log(`Contract deployed at address: ${await contract.getAddress()}`);
}

deploy().catch(console.error);
