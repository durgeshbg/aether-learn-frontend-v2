import type { QueryKey } from '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidatesQueries?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
      notify: boolean;
    };
  }
}
