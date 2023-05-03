use crate::router::handlers::*;
use axum::{
    routing::{get, post},
    Router,
};
use RouterPath::*;

pub async fn init_router() -> Router {
    Router::new()
        .route(path(Root), get(home))
        .route(path(SubmitPfbTransaction), post(submit_pfb_transaction))
        .route(
            path(GeneratePfbTransactionData),
            get(submit_pfb_transaction),
        )
}
