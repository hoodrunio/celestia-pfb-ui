use axum::{routing::get, Router};

use crate::router::handlers::*;

pub async fn init_router() -> Router {
    Router::new().route("/", get(home))
}
