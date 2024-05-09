const {
    Connection,
    PublicKey,
    clusterApiUrl,
    keyPair,
    LAMPORTS_PER_SOL

} = require('@solana/web3.js')

const wallet = new keyPair()

const publicKey = new PublicKey(wallet.__keypair.publicKey)
const secretKey = wallet.wallet._keypair.secretKey

const getWalletBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const walletBalance = await connection.getBalance(publicKey)
        console.log(`Wallet balance is ${walletBalance}`)
    } catch (err) {
        console.error(err)
    }
}

const airDropSol = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const fromAirDropSingature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)
        await connection.confirmTransaction(fromAirDropSingature)
    } catch (err) {
        console.error(err)
    }
}

const main = async() => {
    await getWalletBalance()
    await airDropSol()
    await getWalletBalance()
}

main()