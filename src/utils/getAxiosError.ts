import axios from 'axios';

export function getAxiosError(error: unknown): string {
  const defaultErrorMessage = 'An error occurred, please try again later.';
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultErrorMessage
    );
  }
  return error instanceof Error ? error.message : defaultErrorMessage;
}
