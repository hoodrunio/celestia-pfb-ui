use axum::Json;

use crate::{AppError, AppResponse};

pub enum RouterPath {
    Root,
    SubmitPfbTx,
    GeneratePfbTxData,
}

impl RouterPath {
    pub fn get_path(&self) -> &'static str {
        use RouterPath::*;

        match self {
            Root => "/",
            SubmitPfbTx => "/submit_pfb_tx",
            GeneratePfbTxData => "/generate_pfb_tx_data",
        }
    }
}

pub fn path(path: RouterPath) -> &'static str {
    path.get_path()
}

pub type HandlerResult<T> = Result<Json<AppResponse<T>>, AppError>;
