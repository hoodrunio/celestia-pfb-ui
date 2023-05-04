import { getBaseData } from '../../api/apiService';
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
  path: string;
  method: 'GET' | 'POST';
  data?: any;
}

export const fetcher = async ({ path }: BaseSWRParams) => {
  return getBaseData<any>({ path });
};
