# Suiet Wallet Connection Troubleshooting

If you're experiencing "Connection failed" errors with Suiet wallet, here are some steps to resolve the issue:

## Common Solutions

### 1. Check Suiet Installation
- Make sure Suiet wallet extension is installed from the official Chrome Web Store
- Verify the extension is enabled in your browser's extension settings
- Try refreshing the page after installation

### 2. Network Settings
- Ensure Suiet is connected to the same network as the dApp (devnet by default)
- Check if Suiet has devnet configured in its network settings
- Switch networks in Suiet if necessary

### 3. Clear Browser Data
```bash
# Clear browser cache and cookies
# Go to: Chrome Settings > Privacy and Security > Clear browsing data
# Select: Cached images and files, Cookies and other site data
```

### 4. Reset Suiet Connection
- Open Suiet wallet extension
- Go to Settings → Connected Sites
- Remove any existing connections to localhost
- Try connecting again

### 5. Browser Compatibility
- Suiet works best with Chromium-based browsers (Chrome, Edge, Brave)
- Disable other wallet extensions temporarily to avoid conflicts
- Make sure your browser allows popups from the dApp

### 6. Manual Connection Steps
1. Open Suiet wallet extension
2. Make sure you're on the correct network (devnet)
3. Click "Connect Wallet" in the dApp
4. Select "Suiet Wallet" from the list
5. Approve the connection request in the Suiet popup

### 7. Debug Information
The dApp now includes debug information that shows:
- Which wallets are detected by the browser
- Wallet connection status
- Browser compatibility information

Look for this information at the bottom of the connection screen.

## Still Having Issues?

If none of the above solutions work:

1. Check the browser console for error messages (F12 → Console tab)
2. Try using Sui Wallet instead of Suiet as an alternative
3. Make sure you have some SUI tokens in your wallet for gas fees
4. Verify your wallet has accounts created (not just installed)

## Alternative Wallets

If Suiet continues to have issues, try these alternatives:
- **Sui Wallet** (Official Sui wallet)
- **Ethos Wallet**
- **Martian Wallet**

All of these wallets should work with the same dApp interface.
