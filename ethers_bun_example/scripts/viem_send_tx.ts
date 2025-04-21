import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';

// Anvil default account private keys (use the private keys displayed by Anvil when it starts)
const senderPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const receiverAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Anvil account (1)

// Initialize sender account using private key
const senderAccount = privateKeyToAccount(senderPrivateKey);

// Set up public client (to query blockchain state)
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

// Set up wallet client (to sign/send transactions)
const walletClient = createWalletClient({
  account: senderAccount,
  chain: anvil,
  transport: http('http://127.0.0.1:8545'),
});

async function sendTransaction() {
  const senderBalanceBefore = await publicClient.getBalance({ address: senderAccount.address });
  const receiverBalanceBefore = await publicClient.getBalance({ address: receiverAddress });

  console.log(`Sender balance before: ${formatEther(senderBalanceBefore)} ETH`);
  console.log(`Receiver balance before: ${formatEther(receiverBalanceBefore)} ETH`);

  // Send 0.5 ETH from sender (account 0) to receiver (account 1)
  const txHash = await walletClient.sendTransaction({
    to: receiverAddress,
    value: parseEther('0.5'),
  });

  console.log(`Transaction sent with hash: ${txHash}`);

  // Wait for the transaction receipt
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  const senderBalanceAfter = await publicClient.getBalance({ address: senderAccount.address });
  const receiverBalanceAfter = await publicClient.getBalance({ address: receiverAddress });

  console.log(`Sender balance after: ${formatEther(senderBalanceAfter)} ETH`);
  console.log(`Receiver balance after: ${formatEther(receiverBalanceAfter)} ETH`);
}

sendTransaction().catch(console.error);
