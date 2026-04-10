import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import {
  getChemicalDisplay,
  getDeficiencyTip,
  getLowestChemical,
} from '../data/dose-config';
import type { DoseTotals } from '../hooks/useDailyDose';

interface DoseDeficiencyAlertProps {
  totals: DoseTotals;
}

export function DoseDeficiencyAlert({ totals }: DoseDeficiencyAlertProps) {
  const lowestKey = getLowestChemical(totals);
  const display = getChemicalDisplay(lowestKey);
  const tip = getDeficiencyTip(lowestKey);

  return (
    <View className="overflow-hidden rounded-3xl border border-accent-info/30 bg-white/5 p-5">
      <View className="flex-row items-center gap-4">
        <View className="h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-info/20">
          <MaterialIcons
            name="info-outline"
            size={24}
            color={colors.accent.info}
          />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-white">
            You&apos;re low on {display.label} today
          </Text>
          <Text className="mt-1 text-sm text-white/60">Smart Tip: {tip}</Text>
        </View>
      </View>
    </View>
  );
}
