import {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} from "@solana/web3.js"

const wallet = Keypair.generate();
console.log(wallet)

const publicKey = new PublicKey(wallet.publicKey)
console.log("publicKey bs58 is " + publicKey.toBase58())
const secretKey = wallet.secretKey
console.log("secretkey is " + secretKey)

const getWalletBalance = async () => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const walletBalance = await connection.getBalance(publicKey)
        console.log(`Wallet balance is ${walletBalance}`)
    } catch (err) {
        console.error(err)
    }
}

const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const fromAirDropSingature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)
        await connection.confirmTransaction(fromAirDropSingature)
    } catch (err) {
        console.error(err)
    }
}

const main = async () => {
    await getWalletBalance()
    await airDropSol()
    await getWalletBalance()
}

main()