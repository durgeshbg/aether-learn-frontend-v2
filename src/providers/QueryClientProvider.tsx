import {
  MutationCache,
  QueryClient,
  type QueryKey,
  QueryClientProvider as QueryProvider,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { toast } from 'sonner';

const toastMap = new Map<number, string | number>();

interface QueryMeta {
  invalidatesQueries?: QueryKey;
  successMessage?: string;
  errorMessage?: string;
  notify?: boolean;
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const meta = mutation.meta as QueryMeta;

      if (meta?.notify && meta?.successMessage) {
        toast.success(meta.successMessage);
      }

      if (meta?.invalidatesQueries) {
        queryClient.invalidateQueries({ queryKey: meta.invalidatesQueries });
      }
    },
    onError: (_error, _variables, _context, mutation) => {
      const meta = mutation.meta as QueryMeta;
      const { response } = _error as AxiosError;
      const { error } = response?.data as { error: string };

      if (meta?.notify) {
        toast.error(error || meta?.errorMessage);
      }
    },
    onMutate: (_variables, mutation) => {
      const meta = mutation.meta as QueryMeta;
      if (meta?.notify) {
        const loadingToastId = toast.loading('Processing request...');
        toastMap.set(mutation.mutationId, loadingToastId);
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      const loadingToastId = toastMap.get(mutation.mutationId);
      toast.dismiss(loadingToastId);
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

export interface IQueryClientProviderProps {
  children: React.ReactNode;
}

export function QueryClientProvider({ children }: IQueryClientProviderProps) {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
}
