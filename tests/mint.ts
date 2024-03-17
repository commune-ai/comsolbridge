import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { FEE_VAULT, ORACLE_KEYPAIR, TOKEN_MINT } from "./shared";

describe("bridge-solana", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = anchor.workspace.BridgeSolana as Program<BridgeSolana>;
  console.log("program: ", program.programId.toBase58());

  const destinationAddress = new anchor.web3.PublicKey(
    "Hxtg59VfeWVo4bEAuW9qm9qmN2y2yYBtH3P9WEyTifkX"
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
    TOKEN_MINT,
    destinationAddress,
    true
  );

  it("Mint", async () => {
    const index = 301;
    const checkAccount = PublicKey.findProgramAddressSync(
      [new anchor.BN(index).toBuffer("le", 8)],
      program.programId
    );
    const tx = await program.methods
      .mint({
        amount: new anchor.BN(4815537890886079),
        index: new anchor.BN(index),
      })
      .accounts({
        mint: TOKEN_MINT,
        destination: destinationAddress,
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
      .rpc();
    console.log("Transaction hash: ", tx);
  });
});
