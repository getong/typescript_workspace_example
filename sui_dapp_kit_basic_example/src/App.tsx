import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClientQuery
} from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { useState } from 'react'
import { WalletConnection } from './components/WalletConnection'
import { WalletDebugInfo } from './components/WalletDebugInfo'
import './App.css'

function App() {
  const currentAccount = useCurrentAccount()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const [digest, setDigest] = useState('')

  // Query the account's objects when connected
  const { data: objects, isPending: objectsLoading } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address as string,
    },
    {
      enabled: !!currentAccount,
    },
  )

  // Query SUI balance
  const { data: balance, isPending: balanceLoading } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address as string,
      coinType: '0x2::sui::SUI',
    },
    {
      enabled: !!currentAccount,
    },
  )

  const handleSendTransaction = () => {
    if (!currentAccount) return

    const tx = new Transaction()

    // Add a simple transaction - transfer some SUI to yourself (this is just for demo)
    const [coin] = tx.splitCoins(tx.gas, [1000]) // Split 1000 MIST (0.000001 SUI)
    tx.transferObjects([coin], currentAccount.address)

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Transaction successful:', result)
          setDigest(result.digest)
        },
        onError: (error) => {
          console.error('Transaction failed:', error)
        },
      },
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sui dApp Kit Example</h1>

      <WalletConnection />

      {currentAccount ? (
        <div>
          <h2>Wallet Connected</h2>
          <p><strong>Address:</strong> {currentAccount.address}</p>

          <div style={{ marginBottom: '20px' }}>
            <h3>SUI Balance</h3>
            {balanceLoading ? (
              <p>Loading balance...</p>
            ) : (
              <p>{balance ? `${parseInt(balance.totalBalance) / 1000000000} SUI` : 'No balance'}</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Owned Objects</h3>
            {objectsLoading ? (
              <p>Loading objects...</p>
            ) : (
              <p>Total objects: {objects?.data?.length || 0}</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleSendTransaction}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Send Test Transaction
            </button>
            {digest && (
              <p style={{ marginTop: '10px' }}>
                <strong>Last Transaction:</strong>
                <a
                  href={`https://suiscan.xyz/devnet/tx/${digest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0066cc', marginLeft: '5px' }}
                >
                  {digest.slice(0, 20)}...
                </a>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your Sui wallet to interact with the blockchain.</p>
          <WalletDebugInfo />
        </div>
      )}
    </div>
  )
}

export default App
