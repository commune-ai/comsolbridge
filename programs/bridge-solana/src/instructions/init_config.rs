use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::Token,
};

use crate::Bridge;

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(mut)]
    /// CHECK::
    pub admin: Signer<'info>,
    #[account(
        init,   
        payer = admin,
        space = 8 + std::mem::size_of::<Bridge>(),
        seeds = [b"bridge"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
    /// CHECK::
    pub fee_vault: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitConfigParams {
    pub fee: f32,
}

pub fn handler(ctx: Context<InitConfig>, params: InitConfigParams) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;
    bridge.fee = params.fee;
    bridge.emergency_pause = false;
    bridge.admin = *ctx.accounts.admin.key;
    bridge.fee_vault = *ctx.accounts.fee_vault.key;

    Ok(())
}