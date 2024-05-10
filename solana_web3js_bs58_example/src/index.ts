import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection("https://api.devnet.solana.com");

const keypair = Keypair.fromSecretKey(
    // TODO: change your account here
    bs58.decode("G5gy7E6WFxNvGhs9iGyTYEUAy8NvuCCEjxNpWXzY44VL")
);


(async () => {
    let txhash = await connection.requestAirdrop(keypair.publicKey, 1e9);
    console.log(`txhash: ${txhash}`);
})();