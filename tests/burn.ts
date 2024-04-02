import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import fs from "fs";
import { SOURCE_KEYPAIR, TOKEN_MINT } from "./shared";

describe("Burn", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = anchor.workspace.BridgeSolana as Program<BridgeSolana>;

  const sourceAta = await getAssociatedTokenAddress(
    TOKEN_MINT,
    SOURCE_KEYPAIR.publicKey,
    true
  );

  const bridgePda = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("bridge"))],
    program.programId
  );

  const receiver = "zil15etcz530j7vtrzydk5gvjff6p0m3p89rsy7zjy";

  it("Burn", async () => {
    const tx = await program.methods
      .burn({
        amount: new anchor.BN(10 * LAMPORTS_PER_SOL),
        receiver: receiver,
      })
      .accounts({
        mint: TOKEN_MINT,
        // burnAuthority: wallet.publicKey,
        source: SOURCE_KEYPAIR.publicKey,
        sourceAta: sourceAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        bridgePda: bridgePda[0],
      })
      .signers([SOURCE_KEYPAIR])
      .rpc();
    console.log("Transaction hash: ", tx);
  });
});
