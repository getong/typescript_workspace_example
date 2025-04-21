import { createPublicClient, http, parseEther, createWalletClient, serializeTransaction, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';

// Replace these with actual keys/addresses from Anvil
const senderPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const receiverAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Anvil account (1)

// Initialize account
const account = privateKeyToAccount(senderPrivateKey);

// Public client to read blockchain data
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

async function signAndSendTransaction() {
  const nonce = await publicClient.getTransactionCount({ address: account.address });
  const chainId = anvil.id;

  const tx = {
    to: receiverAddress,
    value: parseEther('0.25'), // Sending 0.25 ETH
    gas: 21000n, // Standard gas limit for ETH transfer
    gasPrice: await publicClient.getGasPrice(),
    nonce,
    chainId,
  };

  console.log('Transaction:', tx);

  // Sign transaction manually
  const signedTx = await account.signTransaction(tx);
  console.log(`Signed Transaction: ${signedTx}`);

  // Send signed transaction
  const txHash = await publicClient.sendRawTransaction({ serializedTransaction: signedTx });
  console.log(`Transaction Hash: ${txHash}`);

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log('Transaction Receipt:', receipt);

  const senderBalance = await publicClient.getBalance({ address: account.address });
  const receiverBalance = await publicClient.getBalance({ address: receiverAddress });

  console.log(`Sender balance after: ${formatEther(senderBalance)} ETH`);
  console.log(`Receiver balance after: ${formatEther(receiverBalance)} ETH`);
}

signAndSendTransaction().catch(console.error);
