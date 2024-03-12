use anchor_lang::prelude::*;

use crate::{Bridge, BridgeError};

#[derive(Accounts)]
pub struct SetFee<'info> {
    #[account(mut)]
    /// CHECK::
    pub admin: Signer<'info>,
    /// CHECK::
    #[account(
        seeds = [b"bridge"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
}

pub fn handler(ctx: Context<SetFee>, fee: f32, fee_vault: Pubkey) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;
    require!(
        bridge.admin == *ctx.accounts.admin.key,
        BridgeError::Unauthorized
    );
    let bridge = &mut ctx.accounts.bridge_pda;
    bridge.fee = fee;
    bridge.fee_vault = fee_vault;
    Ok(())
}
