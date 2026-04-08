import { useState, useCallback } from 'react';
import type { AsyncState, Nullable } from '@types/common.types';

interface UseAsyncOptions<T> {
  initialData?: Nullable<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useAsync<T>(options: UseAsyncOptions<T> = {}) {
  const { initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    status: 'idle',
    error: null,
  });

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>) => {
      setState(prev => ({ ...prev, status: 'loading', error: null }));

      try {
        const data = await asyncFunction();
        setState({ data, status: 'success', error: null });
        onSuccess?.(data);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setState(prev => ({ ...prev, status: 'error', error: errorMessage }));
        onError?.(errorMessage);
        throw err;
      }
    },
    [onSuccess, onError],
  );

  const reset = useCallback(() => {
    setState({ data: initialData, status: 'idle', error: null });
  }, [initialData]);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
    execute,
    reset,
  };
}
