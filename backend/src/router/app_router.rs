use crate::router::handlers::*;
use axum::{
    routing::{get, post},
    Router,
};
use RouterPath::*;

pub async fn init_router() -> Router {
    Router::new()
        .route(path(Root), get(home))
        .route(path(SubmitPfbTx), post(submit_pfb_tx))
        .route(path(GeneratePfbTxData), get(generated_pfb_tx_data))
}
