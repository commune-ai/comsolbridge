import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import fs from "fs";

// export const FEE_VAULT = new anchor.web3.PublicKey(
//   "CcVXmsXWwVdVHQJ3xirFyJ47XrHpyxEDKATWLGMd3eVK"
// );

// export const TOKEN_MINT = new anchor.web3.PublicKey(
//   "ZPEPEuSDb7DKQtM7SMaZpLC2ggHjvP8VmsBfhfgfqQt"
// );

// export const ADMIN_KEYPAIR = Keypair.fromSecretKey(
//   Buffer.from(
//     JSON.parse(
//       fs.readFileSync(
//         "/Users/chou/Developer/bridge-solana/tests/test_wallets/mainnet-admin.json",
//         "utf-8"
//       )
//     )
//   )
// );

export const FEE_VAULT = new anchor.web3.PublicKey(
  "CcVXmsXWwVdVHQJ3xirFyJ47XrHpyxEDKATWLGMd3eVK"
);

export const TOKEN_MINT = new anchor.web3.PublicKey(
  "CF3yVmkZv3ZNQU1vpGLDXwT2aKxjPTekScv8wX7D3dCe"
);

export const ADMIN_KEYPAIR = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      fs.readFileSync(
        "/Users/chou/Developer/bridge-solana/tests/test_wallets/mainnet-admin.json",
        "utf-8"
      )
    )
  )
);

export const ORACLE_KEYPAIR = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      fs.readFileSync(
        "/Users/chou/Developer/bridge-solana/tests/test_wallets/oracle-mainnet.json",
        "utf-8"
      )
    )
  )
);
