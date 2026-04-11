import { Redirect } from 'expo-router';

import { useActiveChallenge } from '../hooks/useEmpathyChallenge';

/**
 * Fallback route guard for deep links.
 * Normal navigation from LoveLanding goes directly to intro or calendar.
 */
export default function EmpathyChallengeIndex() {
  const { data: challenge } = useActiveChallenge();

  if (challenge) {
    return <Redirect href="/practices/empathy-challenge/calendar" />;
  }

  return <Redirect href="/practices/empathy-challenge/intro" />;
}
