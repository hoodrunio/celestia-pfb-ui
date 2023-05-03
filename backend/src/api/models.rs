use celestia_generators::generator::PayForBlobGen;
use serde::{Deserialize, Serialize};
use serde_json::Value;

const GAS_LIMIT: u64 = 80000;
const FEE: u64 = 2000;

#[derive(Debug, Serialize, Deserialize)]
pub struct SubmitPfbRequest {
    pub namespace_id: String,
    pub data: String,
    pub gas_limit: u64,
    pub fee: u64,
}

impl SubmitPfbRequest {
    pub fn new(namespace_id: Option<String>, message: Option<String>) -> Self {
        let mut gen = PayForBlobGen::new();
        Self {
            namespace_id: namespace_id.unwrap_or_else(|| gen.namespace_id()),
            data: message.unwrap_or_else(|| gen.message(100)),
            gas_limit: GAS_LIMIT,
            fee: FEE,
        }
    }
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmitPfbResponse {
    pub height: i64,
    pub txhash: Option<String>,
    pub codespace: Option<String>,
    pub code: Option<i64>,
    #[serde(rename = "raw_log")]
    pub raw_log: Option<String>,
    pub logs: Option<Value>,
    #[serde(rename = "gas_wanted")]
    pub gas_wanted: Option<i64>,
    #[serde(rename = "gas_used")]
    pub gas_used: Option<i64>,
    pub events: Vec<Event>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    #[serde(rename = "type")]
    pub type_field: String,
    pub attributes: Vec<Attribute>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Attribute {
    pub key: String,
    pub value: String,
    pub index: bool,
}
