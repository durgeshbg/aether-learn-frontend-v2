import { useQueryClient, type QueryKey } from '@tanstack/react-query';

export const useQueryData = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData(queryKey);

  return data;
};
