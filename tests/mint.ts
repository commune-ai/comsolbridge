import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  DESTINATION_ADDRESS,
  FEE_VAULT,
  ORACLE_KEYPAIR,
  TOKEN_MINT,
} from "./shared";

describe("bridge-solana", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = anchor.workspace.BridgeSolana as Program<BridgeSolana>;
  console.log("program: ", program.programId.toBase58());

  const bridgePda = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("bridge"))],
    program.programId
  );

  const feeCollectorTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT.address,
    FEE_VAULT,
    true
  );

  const destinationTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT.address,
    DESTINATION_ADDRESS,
    true
  );

  it("Mint", async () => {
    const hash = "302";
    const checkAccount = PublicKey.findProgramAddressSync(
      [Buffer.from(anchor.utils.bytes.utf8.encode(hash))],
      program.programId
    );
    const tx = await program.methods
      .mint({
        amount: new anchor.BN(100000 * LAMPORTS_PER_SOL),
        hash: hash,
      })
      .accounts({
        mint: TOKEN_MINT.address,
        destination: DESTINATION_ADDRESS,
        mintAuthority: ORACLE_KEYPAIR.publicKey,
        destinationAta: destinationTokenAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        bridgePda: bridgePda[0],
        checkAccount: checkAccount[0],
        feeVault: FEE_VAULT,
        feeCollectorTokenAccount: feeCollectorTokenAccount,
      })
      .signers([ORACLE_KEYPAIR])
      .rpc({
        skipPreflight: true,
      });
    console.log("Transaction hash: ", tx);
  });
});
