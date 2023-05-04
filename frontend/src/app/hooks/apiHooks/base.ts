import { KeyedMutator } from 'swr';

export interface APiError {
  error: string;
}

export interface FethcerHookReturn {
  isLoading: boolean;
  data?: any;
  error?: APiError;
  mutate: KeyedMutator<any>;
}

export interface BaseSWRParams {
  path: boolean;
  method: 'GET' | 'POST';
  data?: any;
}

const base_url = 'http://localhost:3000';

export const fetcher = async ({ path }: BaseSWRParams) => {
  return fetch(`${base_url}${path}`, {}).then((r) =>
    r.json().then((data) => data?.data)
  );
};

export const sendRequest = async (path: string, { arg }: any) => {
  return await fetch(`${base_url}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  }).then((r) => r.json().then((data) => data?.data));
};
