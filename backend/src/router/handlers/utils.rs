use axum::Json;

use crate::{AppError, AppResponse};

pub enum RouterPath {
    Root,
    SubmitPfbTransaction,
    GeneratePfbTransactionData,
}

impl RouterPath {
    pub fn get_path(&self) -> &'static str {
        use RouterPath::*;

        match self {
            Root => "/",
            SubmitPfbTransaction => "/submit_pfb_transaction",
            GeneratePfbTransactionData => "/generate_pfb_transaction_data",
        }
    }
}

pub fn path(path: RouterPath) -> &'static str {
    path.get_path()
}

pub type HandlerResult<T> = Result<Json<AppResponse<T>>, AppError>;
