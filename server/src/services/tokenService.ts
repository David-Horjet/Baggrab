import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

import dotenv from "dotenv";
dotenv.config();

const RPC_URL = "https://rpc.gorbagana.wtf";
const connection = new Connection(RPC_URL, "confirmed");

const rawPrivateKey = process.env.PRIVATE_KEY;

if (!rawPrivateKey) {
  throw new Error("PRIVATE_KEY is not set in the environment variables");
}

let fromWallet: Keypair;

try {
  const secretKey = bs58.decode(rawPrivateKey);
  fromWallet = Keypair.fromSecretKey(secretKey);
} catch (err) {
  throw new Error("Invalid base58-encoded PRIVATE_KEY. Failed to decode.");
}

export async function sendTestTokens(toWallet: string, lamports = 100_000): Promise<string> {
  const recipient = new PublicKey(toWallet);

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: recipient,
      lamports,
    })
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [fromWallet]);
  return sig;
}
