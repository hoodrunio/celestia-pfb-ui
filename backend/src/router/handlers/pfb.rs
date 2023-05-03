use serde::{Deserialize, Serialize};

use super::gen_pfb_tx_data;

pub async fn submit_pfb_transaction() -> &'static str {
    "Hello, World!"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PfbGeneratedTxDataResponse {
    pub namespace_id: String,
    pub message: String,
}

impl PfbGeneratedTxDataResponse {
    pub fn new(namespace_id: Option<String>, message: Option<String>) -> Self {
        let namespace_id = namespace_id.unwrap_or_else(|| gen_pfb_tx_data().namespace_id);
        let message = message.unwrap_or_else(|| gen_pfb_tx_data().message);

        Self {
            namespace_id,
            message,
        }
    }
}
