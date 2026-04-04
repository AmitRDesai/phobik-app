import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.gentleLetter.createLetter.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.gentleLetter.listLetters.key(),
      });
      queryClient.invalidateQueries({
        queryKey: orpc.gentleLetter.getLetterDatesForMonth.key(),
      });
    },
  });
}

export function useListLetters() {
  return useQuery(
    // @ts-expect-error -- oRPC optional input requires explicit arg
    orpc.gentleLetter.listLetters.queryOptions({}),
  );
}

export function useLettersForDate(date: string | null) {
  return useQuery({
    ...orpc.gentleLetter.listLetters.queryOptions({
      input: { date: date! },
    }),
    enabled: !!date,
  });
}

export function useGetLetter(id: string | undefined) {
  return useQuery({
    ...orpc.gentleLetter.getLetter.queryOptions({ input: { id: id! } }),
    enabled: !!id,
  });
}

export function useLetterDatesForMonth(month: number, year: number) {
  return useQuery(
    orpc.gentleLetter.getLetterDatesForMonth.queryOptions({
      input: { month, year },
    }),
  );
}
