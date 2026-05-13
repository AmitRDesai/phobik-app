import { Text } from '@/components/themed/Text';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { dialog } from '@/utils/dialog';
import {
  Stack,
  useGlobalSearchParams,
  useNavigation,
  usePathname,
  useRouter,
} from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { QuestionProgress } from '../components/QuestionProgress';
import { INTIMACY_QUESTIONS } from '../data/intimacy-questions';
import { TOTAL_PIVOT_QUESTIONS } from '../data/pivot-point-questions';

function clampIndex(raw: string | string[] | undefined, max: number): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(n)) return 0;
  return Math.min(max - 1, Math.max(0, Math.floor(n)));
}

export default function SelfCheckInsLayout() {
  const pathname = usePathname();
  // useGlobalSearchParams (not useLocalSearchParams) — when this layout
  // renders, the params from the currently active nested route need to
  // be reactive here so the persistent QuestionProgress + section label
  // update as the user pushes between question indices.
  const params = useGlobalSearchParams<{ index?: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const last = pathname.split('/').pop() ?? '';

  const handleClose = async () => {
    const result = await dialog.info({
      title: 'Quit Assessment?',
      message: 'Your progress will be saved.',
      buttons: [
        { label: 'Quit', value: 'quit', variant: 'primary' },
        { label: 'Continue', value: 'continue', variant: 'secondary' },
      ],
    });
    if (result !== 'quit') return;

    if (last === 'intimacy-question') {
      // Intimacy is launched from /practices/relationship-regulation,
      // not the assessment hub. `dismissAll` here only pops to Q0 (the
      // first entry of this nested stack); we need to leave the nested
      // stack entirely so the user returns to the pillar screen.
      navigation.getParent()?.goBack();
    } else {
      // Pivot-point launches from the assessment hub (at index 0 of
      // this nested stack) — pop all questions off down to the hub.
      router.dismissAll();
    }
  };

  let questionChrome: ReactNode = null;
  if (last === 'intimacy-question') {
    const idx = clampIndex(params.index, INTIMACY_QUESTIONS.length);
    const question = INTIMACY_QUESTIONS[idx];
    questionChrome = (
      <View>
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              Intimacy Quiz
            </Text>
          }
          right={<BackButton icon="close" onPress={handleClose} />}
        />
        <View className="px-6">
          <QuestionProgress
            current={idx + 1}
            total={INTIMACY_QUESTIONS.length}
            sectionLabel={question.section}
          />
        </View>
      </View>
    );
  } else if (last === 'pivot-point-question') {
    const idx = clampIndex(params.index, TOTAL_PIVOT_QUESTIONS);
    questionChrome = (
      <View>
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              The Pivot Point
            </Text>
          }
          right={<BackButton icon="close" onPress={handleClose} />}
        />
        <View className="px-6">
          <QuestionProgress
            current={idx + 1}
            total={TOTAL_PIVOT_QUESTIONS}
            showPercentage
          />
        </View>
      </View>
    );
  }

  return (
    <Screen insetBottom={false} className="">
      {questionChrome}
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right',
          }}
        />
      </View>
    </Screen>
  );
}
