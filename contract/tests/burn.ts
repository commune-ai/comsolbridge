import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import fs from "fs";
import {
  DESTINATION_ADDRESS_COMMSOL,
  SOURCE_KEYPAIR,
  TOKEN_MINT,
} from "./shared";

describe("Burn", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = anchor.workspace.BridgeSolana as Program<BridgeSolana>;

  const sourceAta = await getAssociatedTokenAddress(
    TOKEN_MINT.address,
    SOURCE_KEYPAIR.publicKey,
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
        receiver: DESTINATION_ADDRESS_COMMSOL,
      })
      .accounts({
        mint: TOKEN_MINT.address,
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
