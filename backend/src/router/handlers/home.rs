use axum::Json;
use serde::{Deserialize, Serialize};

use crate::{res, AppError, AppResponse};

use super::PfbGeneratedTxDataResponse;

pub async fn home() -> Result<Json<AppResponse<HomeResponse>>, AppError> {
    let data = HomeResponse::new_with_pfb_tx_data();
    Ok(res(data))
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HomeResponse {
    pub pfb_tx_data: PfbGeneratedTxDataResponse,
}

impl HomeResponse {
    pub fn new_with_pfb_tx_data() -> Self {
        let pfb_tx_data = PfbGeneratedTxDataResponse::new(None, None);
        Self { pfb_tx_data }
    }
}
