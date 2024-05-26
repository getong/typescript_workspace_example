import Web3 from 'web3';

// Connect to an Ethereum node
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Example function to get the latest block number
// Example function to get the latest block number
async function getLatestBlockNumber(): Promise<bigint> {
    try {
        const blockNumber = await web3.eth.getBlockNumber();
        return blockNumber;
    } catch (error) {
        console.error('Error getting latest block number:', error);
        return BigInt(-1); // Return BigInt(-1) to indicate an error
    }
}

// Example usage
async function main() {
    const latestBlockNumber = await getLatestBlockNumber();
    if (latestBlockNumber !== BigInt(-1)) { // Compare with BigInt(-1)
        console.log('Latest block number:', latestBlockNumber.toString()); // Convert BigInt to string for logging
    } else {
        console.log('Failed to get the latest block number.');
    }
}

main();
