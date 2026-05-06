import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
import { buildDoseChemicals } from '../data/dose-config';
import { useDailyDose } from '../hooks/useDailyDose';

export function DoseSummaryCard() {
  const router = useRouter();
  const { data: totals } = useDailyDose();
  const chemicals = buildDoseChemicals(totals);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text variant="caption" className="text-foreground/40">
          Daily D.O.S.E.
        </Text>
        <Pressable
          onPress={() => router.push('/insights/dose-tracking')}
          className="flex-row items-center gap-1"
        >
          <Text variant="caption" className="text-primary-pink">
            View Full Report
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={12}
            color={colors.primary['pink-soft']}
          />
        </Pressable>
      </View>
      <Pressable onPress={() => router.push('/insights/dose-tracking')}>
        <DashboardCard className="p-5">
          <View className="mb-4">
            <Text className="text-sm font-black text-foreground">
              Daily D.O.S.E.
            </Text>
            <Text className="text-[10px] font-medium uppercase tracking-wider text-foreground/30">
              Neurochemical Balance
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-4">
            {chemicals.map((chem) => (
              <View
                key={chem.key}
                className="w-[45%] flex-row items-center gap-3"
              >
                <View
                  className="h-8 w-8 items-center justify-center rounded-xl"
                  style={{ backgroundColor: chem.color + '1A' }}
                >
                  <MaterialIcons
                    name={chem.icon}
                    size={18}
                    color={chem.color}
                  />
                </View>
                <View>
                  <Text className="text-[8px] font-bold uppercase tracking-tighter text-foreground/30">
                    {chem.label}
                  </Text>
                  <Text
                    className="text-xs font-black"
                    style={{ color: chem.color }}
                  >
                    {chem.coins} Coins
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </DashboardCard>
      </Pressable>
    </View>
  );
}
