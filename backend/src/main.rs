mod api;

pub use crate::api::*;

#[tokio::main]
async fn main() {
    let api = ApiService::new("15.235.119.27".to_string(), "26659".to_string());

    let req = api.submit_pfb(SubmitPfbRequest::new(None, None));

    match req.await {
        Ok(res) => {
            dbg!(serde_json::to_string(&res).unwrap_or_default());
        }
        Err(e) => {
            dbg!(e);
        }
    };
}
