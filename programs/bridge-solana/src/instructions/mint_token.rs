use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::{Bridge, BridgeError};

#[derive(Accounts)]
#[instruction(params: MintTokenPrams)]
pub struct MintToken<'info> {
    #[account(
        mut,
        mint::authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,
    // The signer account authorized to mint tokens.
    #[account(mut)]
    /// CHECK:: mint_authority is checked
    pub mint_authority: Signer<'info>,
    #[account(
        seeds = [b"bridge_commai"],
        bump
    )]
    pub bridge_pda: Box<Account<'info, Bridge>>,
    #[account(mut)]
    /// CHECK::
    /// The receiver account where the tokens will be minted.
    pub destination: AccountInfo<'info>,
    #[account(
        init,
        payer = mint_authority,
        space = 0,
        seeds = [&params.hash.as_bytes()],
        bump
    )]
    /// CHECK:: seeds has been checked
    // This account is to validate if the minting is already processed or not for oracle.
    // This account is used to prevent replay attacks. Same hash can't be used twice.
    pub check_account: AccountInfo<'info>,
    // token account for destination
    #[account(
        init_if_needed,
        payer = mint_authority,
        associated_token::mint = mint,
        associated_token::authority = destination,
    )]
    pub destination_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = fee_vault.key() == bridge_pda.fee_vault,
    )]
    /// CHECK:: checked if the fee vault is same as the bridge fee vault
    // The fee vault account where the fees will be collected.
    pub fee_vault: AccountInfo<'info>,
    #[account(
        init_if_needed,
        payer = mint_authority,
        associated_token::mint = mint,
        associated_token::authority = fee_vault,
    )]
    pub fee_collector_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct MintTokenPrams {
    pub amount: u64,
    pub hash: String,
}

pub fn handler(ctx: Context<MintToken>, params: MintTokenPrams) -> Result<()> {
    let bridge_pda = &ctx.accounts.bridge_pda;
    let mint = &ctx.accounts.mint;

    // check if the mint is same as the bridge config mint
    require!(bridge_pda.mint == mint.key(), BridgeError::InvalidMint);

    // check if the bridge is not paused
    require!(
        ctx.accounts.bridge_pda.emergency_pause == false,
        crate::error::BridgeError::ContractPaused
    );

    // check if the fee vault is same as the bridge fee vault
    require!(
        bridge_pda.fee_vault == *ctx.accounts.fee_vault.key,
        BridgeError::InvalidFeeCollector
    );

    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.destination_ata.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    let mut fee_amount = params.amount as f64 * (bridge_pda.fee as f64 / 100.0);

    // Ensure that the fee amount is not less than the min fee amount
    if fee_amount < bridge_pda.min_fee_amount as f64 {
        fee_amount = bridge_pda.min_fee_amount as f64;
    }
    let amount_to_mint = params.amount - fee_amount as u64;

    mint_to(cpi_ctx, amount_to_mint)?;

    // Mint revenue to fee collector account
    let cpi_accounts_fee = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.fee_collector_token_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
    };
    let cpi_program_fee = ctx.accounts.token_program.to_account_info();
    let cpi_ctx_fee = CpiContext::new(cpi_program_fee, cpi_accounts_fee);

    mint_to(cpi_ctx_fee, fee_amount as u64)?;

    Ok(())
}
