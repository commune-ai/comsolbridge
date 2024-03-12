use anchor_lang::prelude::*;

#[account]
#[derive(Default, Debug)]
pub struct Bridge {
    pub fee: f32,
    pub admin: Pubkey,
    pub emergency_pause: bool,
    pub fee_vault: Pubkey,
}
