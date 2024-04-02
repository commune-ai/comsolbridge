import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import fs from "fs";

export const DESTINATION_ADDRESS = new anchor.web3.PublicKey(
  "Hxtg59VfeWVo4bEAuW9qm9qmN2y2yYBtH3P9WEyTifkX"
);

export const FEE_VAULT = new anchor.web3.PublicKey(
  "DkiifKebKVsjSHUWPMWejp4c5nQypmd58bNFjXkVKzWt"
);

export const TOKEN_MINT = new anchor.web3.PublicKey(
  "3CuTn8X3S4eMUvreDjFRpkatWmKxW8KV6TpuYJRyimzh"
);

export const ADMIN_KEYPAIR = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      fs.readFileSync(
        "/Users/chou/Developer/commai/sol-bridge/test_wallets/admin.json",
        "utf-8"
      )
    )
  )
);

export const ORACLE_KEYPAIR = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      fs.readFileSync(
        "/Users/chou/Developer/commai/sol-bridge/test_wallets/oracle.json",
        "utf-8"
      )
    )
  )
);

export const SOURCE_KEYPAIR = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(fs.readFileSync("/Users/chou/.config/solana/id.json", "utf-8"))
  )
);
