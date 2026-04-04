import { CourageHeader } from '@/modules/courage/components/CourageHeader';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AssessmentCard } from '../components/AssessmentCard';
import { ASSESSMENTS } from '../data/assessments';
import { useAssessmentList } from '../hooks/useSelfCheckIn';

export default function AssessmentHub() {
  const router = useRouter();
  const { data: assessments } = useAssessmentList();

  const getInProgress = (type: string) =>
    assessments?.find((a) => a.type === type && a.status === 'in_progress');

  return (
    <View className="flex-1 bg-background-charcoal">
      <CourageHeader title="Self Check-Ins" />
      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="mb-1 text-3xl font-extrabold tracking-tight text-white">
            Assessment Hub
          </Text>
          <Text className="text-sm font-medium text-slate-400">
            Deep insights for personal evolution.
          </Text>
        </View>

        <View className="gap-4">
          {ASSESSMENTS.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              isInProgress={!!getInProgress(assessment.id)}
              onPress={() => router.push(assessment.route as any)}
            />
          ))}
        </View>

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
