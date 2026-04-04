import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type AssessmentType = 'intimacy' | 'pivot-point' | 'stress-compass';

const listKey = orpc.selfCheckIn.listAssessments.queryOptions().queryKey;

export function useAssessmentList() {
  return useQuery(orpc.selfCheckIn.listAssessments.queryOptions());
}

export function useStartAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.selfCheckIn.startAssessment.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

export function useSaveAnswer() {
  return useMutation(orpc.selfCheckIn.saveAnswer.mutationOptions());
}

export function useCompleteAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.selfCheckIn.completeAssessment.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

export function useAbandonAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.selfCheckIn.abandonAssessment.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

/** Helper: find the latest in-progress assessment of a given type */
export function useInProgressAssessment(type: AssessmentType) {
  const { data: assessments } = useAssessmentList();
  return assessments?.find(
    (a) => a.type === type && a.status === 'in_progress',
  );
}
