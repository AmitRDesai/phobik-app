import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { useRouter } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import { AssessmentCard } from '../components/AssessmentCard';
import { ASSESSMENTS } from '../data/assessments';
import { useAssessmentList } from '../hooks/useSelfCheckIn';

export default function AssessmentHub() {
  const router = useRouter();
  const { data: assessments } = useAssessmentList();

  const getInProgress = (type: string) =>
    assessments?.find((a) => a.type === type && a.status === 'in_progress');

  return (
    <PracticeScreenShell
      wordmark="Self Check-Ins"
      bgClassName="bg-surface"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      <View className="mb-8 mt-2">
        <Text className="text-3xl font-extrabold tracking-tight text-foreground">
          Assessment Hub
        </Text>
        <Text className="mt-1 text-sm font-medium text-foreground/60">
          Deep insights for personal evolution.
        </Text>
      </View>

      <View className="gap-5">
        {ASSESSMENTS.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            isInProgress={!!getInProgress(assessment.id)}
            onPress={() => router.push(assessment.route as any)}
          />
        ))}
      </View>
    </PracticeScreenShell>
  );
}
