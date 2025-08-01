# Sui dApp Kit Integration

This project demonstrates how to integrate Sui wallet functionality using the `@mysten/dapp-kit` package.

## Features

- **Wallet Connection**: Connect to any Sui-compatible wallet (Sui Wallet, Suiet, etc.)
- **Balance Display**: View your SUI token balance
- **Object Query**: See the total number of objects owned by your account
- **Transaction Execution**: Send test transactions to the Sui blockchain
- **Network Support**: Supports localnet, devnet, testnet, and mainnet

## Key Components

### 1. Providers Setup (`main.tsx`)
- `QueryClientProvider`: Manages React Query state
- `SuiClientProvider`: Provides Sui RPC client functionality
- `WalletProvider`: Manages wallet connection state

### 2. Wallet Connection (`components/WalletConnection.tsx`)
- Handles wallet connection/disconnection
- Prevents controlled/uncontrolled component warnings
- Client-side rendering to avoid SSR issues

### 3. Main App (`App.tsx`)
- Displays wallet connection status
- Shows account balance and owned objects
- Allows sending test transactions

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL

4. Install a Sui wallet browser extension (like Sui Wallet)

5. Click "Connect Wallet" to connect your wallet

6. Once connected, you can:
   - View your wallet address
   - See your SUI balance
   - View the number of objects you own
   - Send test transactions

## Important Notes

- The app is configured to use **devnet** by default for testing
- Test transactions transfer a small amount of SUI to yourself
- Make sure you have some SUI tokens in your wallet for gas fees
- Transaction links will open in Suiscan explorer for verification

## Network Configuration

The app supports multiple networks:
- **localnet**: For local development
- **devnet**: For testing (default)
- **testnet**: For pre-production testing
- **mainnet**: For production use

You can change the default network in `main.tsx` by modifying the `defaultNetwork` prop.

## Error Handling

The implementation includes:
- Client-side mounting to prevent SSR issues
- Proper error handling for failed transactions
- Loading states for all async operations
- Graceful handling of wallet disconnection
