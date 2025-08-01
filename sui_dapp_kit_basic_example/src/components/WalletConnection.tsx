import { 
  ConnectButton, 
  useCurrentAccount, 
  useDisconnectWallet, 
  useWallets,
  useConnectWallet
} from '@mysten/dapp-kit'
import { useState, useEffect } from 'react'

export function WalletConnection() {
  const currentAccount = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const { mutate: connect } = useConnectWallet()
  const wallets = useWallets()
  const [mounted, setMounted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true)
    setConnectionError(null)
    
    const wallet = wallets.find(w => w.name.toLowerCase().includes(walletName.toLowerCase()))
    
    if (!wallet) {
      setConnectionError(`${walletName} wallet not found. Please make sure it's installed.`)
      setIsConnecting(false)
      return
    }

    connect(
      { wallet },
      {
        onSuccess: () => {
          setIsConnecting(false)
          console.log(`Successfully connected to ${wallet.name}`)
        },
        onError: (error) => {
          setIsConnecting(false)
          setConnectionError(`Failed to connect to ${wallet.name}: ${error.message}`)
          console.error('Connection error:', error)
        },
      }
    )
  }

  const handleDisconnect = () => {
    disconnect()
    setConnectionError(null)
  }

  if (!mounted) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <div 
          style={{
            padding: '10px 20px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            color: '#6c757d'
          }}
        >
          Loading wallet...
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      {currentAccount ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Wallet Connected</span>
          <span style={{ 
            fontSize: '12px', 
            color: '#666', 
            fontFamily: 'monospace',
            backgroundColor: '#f8f9fa',
            padding: '2px 6px',
            borderRadius: '3px'
          }}>
            {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          </span>
          <button 
            onClick={handleDisconnect}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <ConnectButton 
              connectText="Connect Wallet"
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                borderRadius: '6px'
              }}
            />
          </div>
          
          {/* Custom wallet selection */}
          <div style={{ marginBottom: '15px' }}>
            <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              Or connect directly to:
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleConnect('suiet')}
                disabled={isConnecting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isConnecting ? 'not-allowed' : 'pointer',
                  opacity: isConnecting ? 0.6 : 1,
                  fontSize: '14px'
                }}
              >
                {isConnecting ? 'Connecting...' : 'Suiet Wallet'}
              </button>
              
              <button
                onClick={() => handleConnect('sui')}
                disabled={isConnecting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isConnecting ? 'not-allowed' : 'pointer',
                  opacity: isConnecting ? 0.6 : 1,
                  fontSize: '14px'
                }}
              >
                {isConnecting ? 'Connecting...' : 'Sui Wallet'}
              </button>
            </div>
          </div>

          {/* Available wallets */}
          {wallets.length > 0 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <p>Detected wallets: {wallets.map(w => w.name).join(', ')}</p>
            </div>
          )}

          {/* Connection error */}
          {connectionError && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c66',
              fontSize: '14px'
            }}>
              {connectionError}
            </div>
          )}

          {/* No wallets detected */}
          {wallets.length === 0 && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              color: '#856404',
              fontSize: '14px'
            }}>
              No Sui wallets detected. Please install Suiet or Sui Wallet browser extension.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
