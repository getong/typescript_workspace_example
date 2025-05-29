import { createPublicClient, http, formatEther } from 'viem'
import { mainnet } from 'viem/chains'

// Create a public client to interact with Ethereum mainnet
const client = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum.publicnode.com') // Using a free public RPC endpoint
})

async function main() {
  try {
    console.log("🔗 Connecting to Ethereum mainnet...");

    // Get the latest block number
    const blockNumber = await client.getBlockNumber()
    console.log(`📦 Latest block number: ${blockNumber}`);

    // Get block details
    const block = await client.getBlock({ blockNumber })
    console.log(`⛽ Block gas used: ${block.gasUsed}`);
    console.log(`💰 Block base fee: ${formatEther(block.baseFeePerGas || 0n)} ETH`);
    console.log(`⏰ Block timestamp: ${new Date(Number(block.timestamp) * 1000).toISOString()}`);

    // Get ETH balance of Vitalik's address (example)
    const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    const balance = await client.getBalance({ address: vitalikAddress })
    console.log(`💎 Vitalik's ETH balance: ${formatEther(balance)} ETH`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();