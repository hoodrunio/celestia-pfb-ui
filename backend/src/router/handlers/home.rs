use serde::{Deserialize, Serialize};

use crate::res;

use super::{HandlerResult, PfbGeneratedTxDataResponse};

pub async fn home() -> HandlerResult<HomeResponse> {
    let data = HomeResponse::new_with_pfb_tx_data();
    Ok(res(data))
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HomeResponse {
    pub pfb_tx_data: PfbGeneratedTxDataResponse,
}

impl HomeResponse {
    pub fn new_with_pfb_tx_data() -> Self {
        let pfb_tx_data = PfbGeneratedTxDataResponse::default();
        Self { pfb_tx_data }
    }
}
