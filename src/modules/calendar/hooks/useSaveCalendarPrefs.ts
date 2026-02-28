import { orpc } from '@/lib/orpc';
import { useMutation } from '@tanstack/react-query';

export function useSaveCalendarPrefs() {
  return useMutation(orpc.calendar.savePreferences.mutationOptions());
}
