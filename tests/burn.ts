import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import fs from "fs";
import { TOKEN_MINT } from "./shared";

describe("Burn", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = anchor.workspace.BridgeSolana as Program<BridgeSolana>;
  const sourceKeypair = Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        fs.readFileSync(
          "/Users/chou/Developer/bridge-solana/tests/test_wallets/test.json",
          "utf-8"
        )
      )
    )
  );
  console.log("Accout to burn from: ", sourceKeypair.publicKey.toBase58());

  const sourceAta = await getAssociatedTokenAddress(
    TOKEN_MINT,
    sourceKeypair.publicKey,
    true
  );

  const bridgePda = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("bridge"))],
    program.programId
  );

  it("Burn", async () => {
    const tx = await program.methods
      .burn({
        amount: new anchor.BN(10 * LAMPORTS_PER_SOL),
      })
      .accounts({
        mint: TOKEN_MINT,
        burnAuthority: wallet.publicKey,
        source: sourceKeypair.publicKey,
        sourceAta: sourceAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        bridgePda: bridgePda[0],
      })
      .signers([wallet.payer, sourceKeypair])
      .rpc();
    console.log("Transaction hash: ", tx);
  });
});
