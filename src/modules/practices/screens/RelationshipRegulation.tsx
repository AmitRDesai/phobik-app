import { useActiveChallenge } from '@/modules/empathy-challenge/hooks/useEmpathyChallenge';
import { useAssessmentList } from '@/modules/self-check-ins/hooks/useSelfCheckIn';
import { Text, View } from 'react-native';

import { RELATIONSHIP_SUBMENU } from '../data/four-pillars';
import { PillarSubMenuScreen } from './PillarSubMenuScreen';

export default function RelationshipRegulation() {
  const { data: activeChallenge } = useActiveChallenge();
  const { data: assessments } = useAssessmentList();

  const hasActiveChallenge = !!activeChallenge;
  const hasIntimacyInProgress = !!assessments?.find(
    (a) => a.type === 'intimacy' && a.status === 'in_progress',
  );

  const liveItems = RELATIONSHIP_SUBMENU.items.map((item) => {
    if (item.id === 'empathy-challenge') {
      return {
        ...item,
        cta: hasActiveChallenge ? 'Continue Journey' : 'Start Challenge',
        ctaIcon: (hasActiveChallenge ? 'play-arrow' : 'bolt') as
          | 'play-arrow'
          | 'bolt',
      };
    }
    if (item.id === 'intimacy-test') {
      return {
        ...item,
        cta: hasIntimacyInProgress ? 'Resume Test' : 'Take Test',
        ctaIcon: (hasIntimacyInProgress ? 'play-arrow' : 'analytics') as
          | 'play-arrow'
          | 'analytics',
      };
    }
    return item;
  });

  return (
    <PillarSubMenuScreen
      submenu={{ ...RELATIONSHIP_SUBMENU, items: liveItems }}
      footer={
        <View className="mt-10 items-center">
          <Text className="max-w-[280px] text-center text-base leading-relaxed text-white/40">
            &ldquo;The quality of your life is the quality of your
            relationships.&rdquo;
          </Text>
        </View>
      }
    />
  );
}
