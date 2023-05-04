export interface IRequestOptions {
  path: string;
  data?: any;
  method?: 'GET' | 'POST';
}

const getBaseData = async <T>(options: IRequestOptions): Promise<T> => {
  const { path, method = 'GET', data: body } = options;

  const base_url = 'http://localhost:3000';
  // eslint-disable-next-line no-undef
  const response = await fetch(`${base_url}${path}`, {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (data?.error) {
    throw new Error(data.error);
  }

  if (data?.data) {
    return data.data;
  }

  return data;
};

export interface PbfTxDataResponse {
  namespace_id: string;
  message: string;
}

export interface InitialDataResponse {
  pfb_tx_data: PbfTxDataResponse;
}

export interface PbfTxDataResponse {
  pfb_result: object;
}

// export async function getInitialData(): Promise<InitialDataResponse> {
//   return await getBaseData<InitialDataResponse>({ path: '/' });
// }

// export async function getPbfTxData(): Promise<PbfTxDataResponse> {
//   return getBaseData<PbfTxDataResponse>({ path: '/generate_pfb_tx_data' });
// }

export const submitPbfTx = (data: any): Promise<PbfTxDataResponse> => {
  return getBaseData<PbfTxDataResponse>({
    path: '/submit_pfb_tx',
    method: 'POST',
    data,
  });
};
