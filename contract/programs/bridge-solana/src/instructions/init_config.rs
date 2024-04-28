use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token},
};

use crate::Bridge;

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,   
        payer = admin,
        space = 8 + Bridge::INIT_SPACE,
        seeds = [b"bridge_commai"],
        bump
    )]
    // PDA that will be used to store the bridge configs. 
    // This account can only be initialized once.
    pub bridge_pda: Box<Account<'info, Bridge>>,
    /// CHECK:: set by the admin
    pub fee_vault: AccountInfo<'info>,
    // comai mint
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitConfigParams {
    pub fee: u32,
    pub min_bridge_amount: u64,
    pub min_fee_amount: u64,
}

pub fn handler(ctx: Context<InitConfig>, params: InitConfigParams) -> Result<()> {
    let bridge = &mut ctx.accounts.bridge_pda;
    bridge.fee = params.fee;
    bridge.emergency_pause = false;
    bridge.admin = *ctx.accounts.admin.key;
    bridge.fee_vault = *ctx.accounts.fee_vault.key;
    bridge.mint = *ctx.accounts.mint.to_account_info().key;
    bridge.min_bridge_amount = params.min_bridge_amount;
    bridge.min_fee_amount = params.min_fee_amount;

    Ok(())
}
