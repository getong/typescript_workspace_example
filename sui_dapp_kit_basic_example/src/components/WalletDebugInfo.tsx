import { useWallets } from '@mysten/dapp-kit'

export function WalletDebugInfo() {
  const wallets = useWallets()

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '6px',
      fontSize: '12px',
      color: '#666'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Debug Information</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Detected Wallets ({wallets.length}):</strong>
        {wallets.length > 0 ? (
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {wallets.map((wallet, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <strong>{wallet.name}</strong>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  Version: {wallet.version || 'Unknown'}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  Accounts: {wallet.accounts.length}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  Icon: {wallet.icon ? '✓' : '✗'}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#dc3545', marginTop: '5px' }}>
            No wallets detected. Please:
            <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>Install Suiet or Sui Wallet browser extension</li>
              <li>Refresh the page after installation</li>
              <li>Make sure the wallet extension is enabled</li>
            </ol>
          </div>
        )}
      </div>

      <div>
        <strong>Browser Info:</strong>
        <div>User Agent: {navigator.userAgent.split(' ').slice(-2).join(' ')}</div>
        <div>Extensions API: {typeof (window as unknown as { chrome?: { runtime?: unknown } }).chrome?.runtime !== 'undefined' ? 'Available' : 'Not Available'}</div>
      </div>
    </div>
  )
}
