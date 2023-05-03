use anyhow::Result;
use reqwest::{
    header::{HeaderMap, CONTENT_TYPE},
    Client, Response,
};
use serde::{de::DeserializeOwned, Serialize};

use crate::{SubmitPfbRequest, SubmitPfbResponse};

#[derive(Default, Debug)]
pub struct ApiService {
    base_url: String,
    client: Client,
}

impl ApiService {
    pub fn new(base_url: String, port: String) -> Self {
        let base_url = format!("http://{}:{}", base_url, port);
        let client = Client::builder()
            .timeout(std::time::Duration::from_secs(20))
            .build()
            .unwrap();

        ApiService { base_url, client }
    }

    async fn parse_api_response<T: DeserializeOwned>(&self, res: Response) -> Result<T> {
        let res = res.json::<T>().await?;
        Ok(res)
    }

    async fn send_request<T, B: DeserializeOwned>(
        &self,
        method: reqwest::Method,
        path: &str,
        body: Option<T>,
    ) -> Result<B>
    where
        T: Serialize,
    {
        let url = format!("{}{}", self.base_url, path);
        let headers = self.get_headers();

        let mut req = self
            .client
            .request(method.clone(), &url)
            .headers(headers.clone());

        if let Some(body) = body {
            let json = serde_json::to_string(&body)?;
            req = req.body(json);
        }

        let result = req.send().await?;

        let res = self.parse_api_response::<B>(result).await?;

        Ok(res)
    }

    pub async fn submit_pfb(&self, request: SubmitPfbRequest) -> Result<SubmitPfbResponse> {
        let path = "/submit_pfb";

        let res = self
            .send_request::<SubmitPfbRequest, SubmitPfbResponse>(
                reqwest::Method::POST,
                path,
                Some(request),
            )
            .await?;

        Ok(res)
    }

    fn get_headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
        headers
    }
}
