use anchor_lang::prelude::*;

mod instructions;
use instructions::*;
mod error;
use error::*;
mod state;
use state::*;

declare_id!("A7EAge4jj5xNdXUnALwg4ucbECvU66M2kPS8ueD9VhCW");

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

    pub fn update_token_config(
        ctx: Context<UpdateTokenConfig>,
        fee: u32,
        min_bridge_amount: u64,
        min_fee_amount: u64,
    ) -> Result<()> {
        update_token_config::handler(ctx, fee, min_bridge_amount, min_fee_amount)
    }

    pub fn update_admin(ctx: Context<UpdateAdmin>) -> Result<()> {
        update_admin::handler(ctx)
    }
}
