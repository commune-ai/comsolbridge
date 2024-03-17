import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BridgeSolana } from "../target/types/bridge_solana";
import { IDL } from "../target/types/bridge_solana";
import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ADMIN_KEYPAIR, FEE_VAULT, TOKEN_MINT } from "./shared";
import { assert } from "chai";

describe("Init Config", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const wallet = anchor.Wallet.local();
  console.log(wallet.publicKey.toBase58());

  const program = new anchor.Program(
    IDL,
    new anchor.web3.PublicKey("56aoBWVLjwpHD8HHS4i7hBicbznFGMdYjWPVBprVWi6k"),
    provider
  ) as Program<BridgeSolana>;
  console.log("Program ID: ", program.programId.toBase58());

  const adminKeypair = ADMIN_KEYPAIR;
  const bridgePda = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("bridge"))],
    program.programId
  );

  it("Init", async () => {
    const tx = await program.methods
      .initConfig({
        fee: 0.5,
        minBridgeAmount: new anchor.BN(540000000000000),
      })
      .accounts({
        admin: adminKeypair.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        bridgePda: bridgePda[0],
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        feeVault: FEE_VAULT,
        mint: TOKEN_MINT,
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
  });
});
