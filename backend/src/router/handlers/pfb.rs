use axum::Json;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::{res, ApiService, SubmitPfbNodeResponse};

use super::{gen_pfb_tx_data, HandlerResult};

pub async fn submit_pfb_tx(
    Json(payload): Json<CreatePfbTxRequest>,
) -> HandlerResult<PfbTxResponse> {
    let CreatePfbTxRequest {
        node_url,
        port,
        seed,
        namespace_id,
        message,
    } = payload;

    let api = ApiService::new(node_url, port);
    let seed = seed.map(|s| s.parse::<u64>().ok()).unwrap_or(None);

    let response = api
        .submit_pfb(crate::SubmitPfbNodeRequest::new(
            namespace_id,
            message,
            seed,
        ))
        .await?;

    Ok(res(response.into()))
}

pub async fn generated_pfb_tx_data() -> HandlerResult<PfbGeneratedTxDataResponse> {
    Ok(res(PfbGeneratedTxDataResponse::default()))
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreatePfbTxRequest {
    pub namespace_id: Option<String>,
    pub message: Option<String>,
    pub seed: Option<String>,
    pub node_url: String,
    pub port: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PfbTxResponse {
    pub pfb_result: Value,
}

impl From<SubmitPfbNodeResponse> for PfbTxResponse {
    fn from(res: SubmitPfbNodeResponse) -> Self {
        Self {
            pfb_result: serde_json::to_value(res).unwrap_or_default(),
        }
    }
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

impl Default for PfbGeneratedTxDataResponse {
    fn default() -> Self {
        Self::new(None, None)
    }
}
