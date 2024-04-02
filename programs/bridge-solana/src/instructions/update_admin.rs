use crate::{Bridge, BridgeError};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bridge_commai"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
    /// CHECK:: admin is checked
    pub new_admin: AccountInfo<'info>,
}

pub fn handler(ctx: Context<UpdateAdmin>) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;

    // Ensure that the sender is authorized to update the admin.
    require!(
        bridge.admin == *ctx.accounts.admin.key,
        BridgeError::Unauthorized
    );
    bridge.admin = *ctx.accounts.new_admin.key;
    Ok(())
}
