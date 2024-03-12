use anchor_lang::prelude::*;

mod instructions;
use instructions::*;
mod error;
use error::*;
mod state;
use state::*;

declare_id!("B2ekE2BKm8bZTUNz5UwsU3czMzF465kSJcdzYcS94NLF");

#[program]
pub mod bridge_solana {
    use super::*;

    pub fn mint(ctx: Context<MintToken>, params: MintTokenPrams) -> Result<()> {
        mint_token::handler(ctx, params)
    }

    pub fn burn(ctx: Context<BurnToken>, params: BurnTokenParams) -> Result<()> {
        burn_token::handler(ctx, params)
    }

    pub fn init_config(ctx: Context<InitConfig>, params: InitConfigParams) -> Result<()> {
        init_config::handler(ctx, params)
    }

    pub fn emergency_pause(ctx: Context<EmergencyPause>, pause: bool) -> Result<()> {
        emergency_pause::handler(ctx, pause)
    }

    pub fn set_fee(ctx: Context<SetFee>, fee: f32, fee_vault: Pubkey) -> Result<()> {
        set_fee::handler(ctx, fee, fee_vault)
    }
}
