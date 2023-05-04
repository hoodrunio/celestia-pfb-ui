use axum::{
    response::{IntoResponse, Response},
    Json,
};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug)]
pub struct AppError(pub anyhow::Error);

// Tell axum how to convert `AppError` into a response.
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({ "error": self.0.to_string() })),
        )
            .into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}

pub struct JsonAppResponse<T>(pub AppResponse<T>);

pub fn res<T: Serialize>(data: T) -> Json<AppResponse<T>> {
    Json(AppResponse::new(data))
}

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct AppResponse<T> {
    pub data: T,
}

impl<T> AppResponse<T> {
    pub fn new(data: T) -> Self {
        Self { data }
    }
}
