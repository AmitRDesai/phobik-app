import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { buildDoseChemicals } from '../data/dose-config';
import { useDailyDose } from '../hooks/useDailyDose';

export function DoseSummaryCard() {
  const router = useRouter();
  const { data: totals } = useDailyDose();
  const chemicals = buildDoseChemicals(totals);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text variant="caption" muted>
          Daily D.O.S.E.
        </Text>
        <Button
          variant="ghost"
          size="compact"
          onPress={() => router.push('/insights/dose-tracking')}
          icon={
            <MaterialIcons
              name="arrow-forward"
              size={12}
              color={colors.primary['pink-soft']}
            />
          }
        >
          View Full Report
        </Button>
      </View>
      <Pressable onPress={() => router.push('/insights/dose-tracking')}>
        <DashboardCard className="p-5">
          <View className="mb-4">
            <Text variant="sm" className="font-black">
              Daily D.O.S.E.
            </Text>
            <Text variant="caption" className="text-foreground/30">
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
                  <Text variant="caption" className="text-foreground/30">
                    {chem.label}
                  </Text>
                  <Text
                    variant="xs"
                    className="font-black"
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
