import { ethers } from "ethers";
import fs from "fs";

// Load ABI
const abi = JSON.parse(fs.readFileSync("./artifacts/Counter.abi", "utf8"));

async function interact() {
  // ✅ Fix here: explicitly disable ENS
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", undefined, { ensAddress: null });

  // Replace with your Anvil private key
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);


  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Use the actual address here
  const counter = new ethers.Contract(contractAddress, abi, wallet);

  // Read initial value
  let count = await counter.count();
  console.log(`Initial count: ${count}`);

  // Increment
  console.log("Incrementing count...");
  await (await counter.increment()).wait();

  count = await counter.count();
  console.log(`Updated count: ${count}`);

  // Decrement
  console.log("Decrementing count...");
  await (await counter.decrement()).wait();

  count = await counter.count();
  console.log(`Updated count: ${count}`);

  // Set Count
  console.log("Setting count to 500...");
  await (await counter.setCount(500)).wait();

  count = await counter.count();
  console.log(`Final count: ${count}`);
}

interact().catch(console.error);
