use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{Bridge, BridgeError};

#[derive(Accounts)]
pub struct UpdateTokenConfig<'info> {
    #[account(mut)]
    /// CHECK::
    pub admin: Signer<'info>,
    /// CHECK::
    #[account(
        mut,
        seeds = [b"bridge"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
    pub mint: Account<'info, Mint>,
    /// CHECK::
    pub fee_vault: AccountInfo<'info>,
}

pub fn handler(ctx: Context<UpdateTokenConfig>, fee: f32, min_bridge_amount: u64) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;
    let fee_vault = &ctx.accounts.fee_vault;
    require!(
        bridge.admin == *ctx.accounts.admin.key,
        BridgeError::Unauthorized
    );
    bridge.fee = fee;
    bridge.fee_vault = fee_vault.key();
    bridge.min_bridge_amount = min_bridge_amount;
    bridge.mint = *ctx.accounts.mint.to_account_info().key;
    Ok(())
}
