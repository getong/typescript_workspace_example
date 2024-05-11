import { Keypair } from "@solana/web3.js";
import * as bs58 from 'bs58';

let keypairOrigin = Keypair.generate();
console.log(keypairOrigin);

let keypair = Keypair.fromSecretKey(Uint8Array.from([200, 155, 132, 67, 145, 19, 130, 91, 66, 237, 67,
    210, 211, 124, 20, 232, 13, 164, 207, 86, 239, 203,
    215, 196, 22, 72, 122, 121, 8, 22, 133, 22, 138,
    179, 6, 119, 22, 240, 167, 200, 23, 242, 120, 215,
    156, 45, 75, 237, 195, 155, 254, 164, 114, 250, 121,
    152, 48, 160, 124, 168, 132, 214, 74, 10]))
console.log(keypair);
console.log(keypair.publicKey.toBase58());

let keypairsb58 = bs58.encode(Uint8Array.from([200, 155, 132, 67, 145, 19, 130, 91, 66, 237, 67,
    210, 211, 124, 20, 232, 13, 164, 207, 86, 239, 203,
    215, 196, 22, 72, 122, 121, 8, 22, 133, 22, 138,
    179, 6, 119, 22, 240, 167, 200, 23, 242, 120, 215,
    156, 45, 75, 237, 195, 155, 254, 164, 114, 250, 121,
    152, 48, 160, 124, 168, 132, 214, 74, 10]))
console.log("bs58: " + keypairsb58);