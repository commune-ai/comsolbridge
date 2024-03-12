import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { FEE_VAULT, TOKEN_MINT } from "./shared";

describe("bridge-solana", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = anchor.workspace.BridgeSolana as Program<BridgeSolana>;
  const tokenMintAddress = new anchor.web3.PublicKey(
    "CR3Th2R2zjRjUmfmmLvemej5YN6BGQ2czJFV4BFaECqD"
  );
  const destinationAddress = new anchor.web3.PublicKey(
    "HFtx9KED99Sa25kxKqbaWynrSUs1gWbVsJeBF42vjY9z"
  );

  const bridgePda = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("bridge"))],
    program.programId
  );

  const feeCollectorTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT,
    FEE_VAULT,
    true
  );

  const destinationTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    destinationAddress,
    true
  );

  it("Mint", async () => {
    const index = 3;
    const checkAccount = PublicKey.findProgramAddressSync(
      [new anchor.BN(index).toBuffer("le", 8)],
      program.programId
    );
    const tx = await program.methods
      .mint({
        amount: new anchor.BN(10 * LAMPORTS_PER_SOL),
        index: new anchor.BN(index),
      })
      .accounts({
        mint: tokenMintAddress,
        destination: destinationAddress,
        mintAuthority: wallet.publicKey,
        destinationAta: destinationTokenAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        bridgePda: bridgePda[0],
        checkAccount: checkAccount[0],
        feeVault: FEE_VAULT,
        feeCollectorTokenAccount: feeCollectorTokenAccount,
      })
      .signers([wallet.payer])
      .rpc();
    console.log("Transaction hash: ", tx);
  });
});
