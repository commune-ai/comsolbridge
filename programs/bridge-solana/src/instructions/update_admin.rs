use crate::{Bridge, BridgeError};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut)]
    /// CHECK::
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bridge"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
    /// CHECK::
    pub new_admin: AccountInfo<'info>,
}

pub fn handler(ctx: Context<UpdateAdmin>) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;
    require!(
        bridge.admin == *ctx.accounts.admin.key,
        BridgeError::Unauthorized
    );
    bridge.admin = *ctx.accounts.new_admin.key;
    Ok(())
}
