use anchor_lang::error_code;

#[error_code]
pub enum BridgeError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Contract Paused")]
    ContractPaused,
    #[msg("Invalid Fee Collector")]
    InvalidFeeCollector,
}
