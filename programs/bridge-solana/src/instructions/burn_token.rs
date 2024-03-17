use anchor_lang::prelude::*;
use anchor_spl::token::{burn, Burn, Mint, Token, TokenAccount};

use crate::{Bridge, BridgeError};

#[derive(Accounts)]
pub struct BurnToken<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(
        seeds = [b"bridge"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
    // source account
    #[account(mut)]
    /// CHECK::
    pub source: Signer<'info>,
    // source token account
    #[account(
        mut,
        constraint = source_ata.owner == source.key(),
        constraint = source_ata.mint == mint.key()
    )]
    pub source_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct BurnTokenParams {
    pub amount: u64,
    pub receiver: String,
}

#[event]
pub struct BurnEvent {
    from: Pubkey,
    amount: u64,
    receiver: String,
}

pub fn handler(ctx: Context<BurnToken>, params: BurnTokenParams) -> Result<()> {
    let bridge = &ctx.accounts.bridge_pda;
    let source = &ctx.accounts.source;
    let mint: &Account<'_, Mint> = &ctx.accounts.mint;

    require!(bridge.emergency_pause == false, BridgeError::ContractPaused);

    require!(bridge.mint == mint.key(), BridgeError::InvalidMint);

    require!(
        bridge.min_bridge_amount <= params.amount,
        BridgeError::MinAmountNotMet
    );

    let cpi_accounts = Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.source_ata.to_account_info(),
        authority: ctx.accounts.source.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    burn(cpi_ctx, params.amount)?;

    emit!(BurnEvent {
        from: *source.key,
        amount: params.amount,
        receiver: params.receiver
    });

    Ok(())
}
