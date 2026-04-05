import { useCallback, useState } from 'react';

/**
 * Wraps an async function to provide a React Query-compatible mutation API shape.
 * Screens can use `.mutate()`, `.mutateAsync()`, `.isPending`, `.error`, `.isError`
 * without needing any changes.
 */
export function useLocalMutation<TInput, TOutput = void>(
  fn: (input: TInput) => Promise<TOutput>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(
    async (input: TInput) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await fn(input);
        return result;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [fn],
  );

  const mutate = useCallback(
    (
      input: TInput,
      options?: {
        onSuccess?: (data: TOutput) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      mutateAsync(input).then(
        (data) => options?.onSuccess?.(data),
        (err) => options?.onError?.(err),
      );
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending, error, isError: !!error };
}
