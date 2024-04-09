use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Bridge {
    pub fee: u32,
    pub admin: Pubkey,
    pub emergency_pause: bool,
    pub fee_vault: Pubkey,
    pub mint: Pubkey,
    pub min_bridge_amount: u64,
    pub min_fee_amount: u64,
}
