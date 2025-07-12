import {
  MutationCache,
  QueryClient,
  type QueryKey,
  QueryClientProvider as QueryProvider,
} from '@tanstack/react-query';
import * as React from 'react';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const meta = mutation.meta as {
        invalidatesQuerys?: QueryKey;
        successMessage?: string;
        errorMessage?: string;
      };
      if (meta?.successMessage) {
        toast.success(meta.successMessage);
      }
      if (meta?.invalidatesQuerys) {
        queryClient.invalidateQueries({ queryKey: meta.invalidatesQuerys });
      }
      if (meta?.errorMessage) {
        toast.error(meta.errorMessage);
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      retry: 1,
    },
  },
});

export interface IQueryClientProviderProps {
  children: React.ReactNode;
}


export function QueryClientProvider({ children }: IQueryClientProviderProps) {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
}
