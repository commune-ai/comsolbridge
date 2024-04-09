import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { IDL } from "../target/types/bridge_solana";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ADMIN_KEYPAIR, FEE_VAULT, TOKEN_MINT } from "./shared";

describe("Init Config", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = new anchor.Program(
    IDL,
    anchor.workspace.BridgeSolana.programId.toBase58(),
    provider
  ) as Program<BridgeSolana>;
  console.log("Program ID: ", program.programId.toBase58());

  const adminKeypair = ADMIN_KEYPAIR;
  const bridgePda = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("bridge_commai"))],
    program.programId
  );

  it("Init", async () => {
    const tx = await program.methods
      .initConfig({
        fee: 30,
        minBridgeAmount: new anchor.BN(10 * LAMPORTS_PER_SOL),
        minFeeAmount: new anchor.BN(LAMPORTS_PER_SOL),
      })
      .accounts({
        admin: adminKeypair.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        bridgePda: bridgePda[0],
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        feeVault: FEE_VAULT,
        mint: TOKEN_MINT.address,
      })
      .signers([adminKeypair])
      .rpc();
    console.log("Transaction hash: ", tx);

    const bridgeData = await program.account.bridge.fetch(bridgePda[0]);
    console.log("admin: ", bridgeData.admin.toBase58());
    console.log("paused: ", bridgeData.emergencyPause);
    console.log("feeVault: ", bridgeData.feeVault.toBase58());
    console.log("fee: ", bridgeData.fee);
    console.log("minBridgeAmount: ", bridgeData.minBridgeAmount.toNumber());
    console.log("mint ", bridgeData.mint.toBase58());
    console.log("minFeeAmount: ", bridgeData.minFeeAmount.toNumber());
  });
});
