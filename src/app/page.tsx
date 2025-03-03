"use client";
import { BalanceDisplay } from "@/components/balance-display";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useState } from "react";

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [TSign, setTSign] = useState("");

  const sendSol = async (event: any) => {
    event.preventDefault();

    if (!publicKey) {
      alert("Wallet not connected");
      return;
    }

    try {
      // const recipientPubKey = new PublicKey(event.currentTarget.recipient.value);
      const recipientPubKey = new PublicKey(
        prompt("enter the wallet address: ")!
      );

      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      const signature = await sendTransaction(transaction, connection);
      console.log(
        `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
      setTSign(signature);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  const pingProgram = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      alert("Wallet not collected or connection not availble.");
    }

    try {
      const programId = new PublicKey(
        "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
      );
      const programDataAccount = new PublicKey(
        "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
      );

      const transaction = new Transaction();

      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: programDataAccount,
            isSigner: false,
            isWritable: true,
          },
        ],
        programId,
      });

      transaction.add(instruction);

      const signature = await sendTransaction(transaction, connection);
      console.log(
        `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
      setTSign(signature);
    } catch (error) {
      console.error("Transaction Failed:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-semibold">SOLANA dapp</h1>
        <BalanceDisplay />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <WalletMultiButton />
          {
            <button
              onClick={sendSol}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Send SOL to someone <p className="px-1">(0.01 SOL)</p>
            </button>
          }
          {
            <button
              onClick={pingProgram}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Ping the program
            </button>
          }
        </div>
        {TSign && (
          <p className="max-w-lg">
            <a
              target="_blank"
              className="underline text-purple-400"
              href={`https://explorer.solana.com/tx/${TSign}?cluster=devnet`}
            >
              Visit explorer.
            </a>{" "}
            to View your recent transaction details.
          </p>
        )}
      </main>
    </div>
  );
}
