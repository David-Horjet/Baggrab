import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import bs58 from "bs58";

const RPC = "https://rpc.gorbagana.wtf";
const connection = new Connection(RPC, "confirmed");

const fromWallet = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));

export const sendGorToWallet = async (to: string, amount: number): Promise<string> => {
  const toPubkey = new PublicKey(to);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey,
      lamports: amount * 1_000_000, // assuming 1 GOR = 1M lamports
    })
  );

  const signature = await sendAndConfirmTransaction(connection, tx, [fromWallet]);
  return signature;
};
