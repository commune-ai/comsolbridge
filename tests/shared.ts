import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import fs from "fs";

export const FEE_VAULT = new anchor.web3.PublicKey(
  "BVJXViCLQM2aLnCCiEH4gr7Q5NbeqABFshgSUv7zk9eM"
);

export const TOKEN_MINT = new anchor.web3.PublicKey(
  "CR3Th2R2zjRjUmfmmLvemej5YN6BGQ2czJFV4BFaECqD"
);

export const ADMIN_KEYPAIR = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      fs.readFileSync(
        "/Users/chou/Developer/bridge-solana/tests/test_wallets/admin.json",
        "utf-8"
      )
    )
  )
);
