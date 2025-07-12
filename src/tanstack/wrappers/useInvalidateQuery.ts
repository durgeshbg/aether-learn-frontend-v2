import { useQueryClient, type QueryKey } from '@tanstack/react-query';

export const useInvalidateQuery = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey });
  };
};
