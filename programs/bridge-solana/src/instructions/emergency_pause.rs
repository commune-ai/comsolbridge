use anchor_lang::prelude::*;

use crate::{Bridge, BridgeError};

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    // The admin signer account authorized to pause or unpause the contract.
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bridge_commai"],
        bump
    )]
    // PDA that is used to store the bridge configs
    pub bridge_pda: Box<Account<'info, Bridge>>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<EmergencyPause>, pause: bool) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;

    // Ensure that the sender is authorized to pause or unpause the contract.
    require!(
        bridge.admin == *ctx.accounts.admin.key,
        BridgeError::Unauthorized
    );

    // Set the emergency pause flag based on the input parameter.
    bridge.emergency_pause = pause;
    Ok(())
}
