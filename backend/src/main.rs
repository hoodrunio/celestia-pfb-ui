mod api;
mod router;
mod utils;

use router::init_router;
use tracing_subscriber::prelude::__tracing_subscriber_SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

pub use crate::api::*;
pub use crate::utils::*;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_consume_body_in_extractor_or_middleware=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = init_router().await;

    tracing::info!("Starting server...");
    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();

    tracing::info!("Server is running on localhost::3000!");
}
