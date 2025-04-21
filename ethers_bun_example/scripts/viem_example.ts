import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';
import fs from 'fs';

// Use your Anvil private key here
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

// Initialize clients
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

const walletClient = createWalletClient({
  account,
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// Replace this with your deployed contract's address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Load ABI from your artifacts
const abi = JSON.parse(fs.readFileSync('./artifacts/Counter.abi', 'utf8'));

async function main() {
  // Read current count
  let count: bigint = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'count',
  });

  console.log(`Initial count: ${count}`);

  // Increment the count
  console.log('Incrementing count...');
  await walletClient.writeContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'increment',
  });

  count = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'count',
  });
  console.log(`After increment: ${count}`);

  // Decrement the count
  console.log('Decrementing count...');
  await walletClient.writeContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'decrement',
  });

  count = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'count',
  });
  console.log(`After decrement: ${count}`);

  // Set count explicitly
  console.log('Setting count to 777...');
  await walletClient.writeContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'setCount',
    args: [777n],
  });

  count = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'count',
  });
  console.log(`After setting explicitly: ${count}`);
}

main().catch(console.error);
