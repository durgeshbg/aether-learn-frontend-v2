import { useQueryClient, type QueryKey } from '@tanstack/react-query';

export const useIsFetching = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  const isFetching = queryClient.isFetching({ queryKey });

  return isFetching > 0;
};
