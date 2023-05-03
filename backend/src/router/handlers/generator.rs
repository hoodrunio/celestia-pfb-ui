use celestia_generators::generator::PayForBlobGen;

pub fn gen_pfb_tx_data() -> PfbGeneratedTxData {
    PfbGeneratedTxData::new()
}

pub struct PfbGeneratedTxData {
    pub namespace_id: String,
    pub message: String,
}

impl PfbGeneratedTxData {
    pub fn new() -> Self {
        let mut gen = PayForBlobGen::new();
        Self {
            namespace_id: gen.namespace_id(),
            message: gen.message(100),
        }
    }
}
