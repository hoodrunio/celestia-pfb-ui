import { URL } from 'url';

interface IRequestOptions {
  path: string;
  data?: any;
  method?: 'GET' | 'POST';
}

export async function getBaseData<T>(options: IRequestOptions): Promise<T> {
  const { path, method = 'GET', data: body } = options;

  const url = new URL(process.env.NEXT_PUBLIC_API_URL + path);
  // eslint-disable-next-line no-undef
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  if (data?.error) {
    throw new Error(data.error);
  }

  if (data?.data?.value) {
    return data.data.value;
  }

  return data;
}

interface PbfTxDataResponse {
  namespace_id: string;
  message: string;
}

interface InitialDataResponse {
  pfb_tx_data: PbfTxDataResponse;
}

interface PbfTxDataResponse {
  value: object;
}

export async function getInitialData(): Promise<InitialDataResponse> {
  return getBaseData<InitialDataResponse>({ path: '/' });
}

export async function getPbfTxData(): Promise<PbfTxDataResponse> {
  return getBaseData<PbfTxDataResponse>({ path: '/generate_pfb_tx_data' });
}

export async function submitPbfTx(data: any): Promise<PbfTxDataResponse> {
  return getBaseData<PbfTxDataResponse>({
    path: '/submit_pfb_tx',
    method: 'POST',
    data,
  });
}
