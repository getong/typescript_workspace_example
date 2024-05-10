import { Connection, Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection("https://api.devnet.solana.com");

const alice = Keypair.fromSecretKey(
    // TODO: change your account here
    bs58.decode("G5gy7E6WFxNvGhs9iGyTYEUAy8NvuCCEjxNpWXzY44VL")
);

const bob = Keypair.fromSecretKey(
    // TODO: change your account here
    bs58.decode("G5gy7E6WFxNvGhs9iGyTYEUAy8NvuCCEjxNpWXzY44VL")
);


(async () => {
    let tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: alice.publicKey,
            // TODO: change your account here
            toPubkey: bob.publicKey,
            lamports: 1 * LAMPORTS_PER_SOL
        })
    );
    tx.feePayer = alice.publicKey;

    let txhash = await connection.sendTransaction(tx, [alice, bob]);
    console.log("${txhash");
})();