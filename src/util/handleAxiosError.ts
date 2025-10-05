import axios from 'axios';
import type { FallbackProps } from 'react-error-boundary';

export const handleAxiosError = (
  error: FallbackProps,
  fallbackMessage: string
) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return message ? message : fallbackMessage;
  }
};
