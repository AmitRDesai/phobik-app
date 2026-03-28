import { colors } from '@/constants/colors';
import { BlurView } from 'expo-blur';
import { Platform, Text, View } from 'react-native';
import { useJournalStats } from '../hooks/useJournalStats';

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center rounded-xl border border-white/10 bg-white/5 p-3">
      <Text className="mb-1 text-[10px] font-bold uppercase text-white/30">
        {label}
      </Text>
      <Text className="text-lg font-bold text-white">{value}</Text>
    </View>
  );
}

export function BlurredStats() {
  const { data } = useJournalStats();

  return (
    <View
      className="relative w-full overflow-hidden rounded-xl"
      style={{ opacity: 0.5 }}
    >
      <View className="flex-row gap-3">
        <StatBox label="Entries" value={data?.totalEntries ?? 0} />
        <StatBox label="Streak" value={data?.streak ?? 0} />
        <StatBox label="Avg HRV" value={72} />
      </View>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={8}
          tint="dark"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      ) : (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background.dashboard,
            opacity: 0.85,
          }}
        />
      )}
    </View>
  );
}
