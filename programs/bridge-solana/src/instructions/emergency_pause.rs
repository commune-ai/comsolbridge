use anchor_lang::prelude::*;

use crate::{Bridge, BridgeError};

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
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
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<EmergencyPause>, pause: bool) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;
    require!(
        bridge.admin == *ctx.accounts.admin.key,
        BridgeError::Unauthorized
    );
    bridge.emergency_pause = pause;
    Ok(())
}
