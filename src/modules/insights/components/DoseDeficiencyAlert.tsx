import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
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
    <Card
      className="overflow-hidden p-5"
      style={{ borderColor: withAlpha(colors.accent.info, 0.3) }}
    >
      <View className="flex-row items-center gap-4">
        <IconChip
          size="lg"
          shape="circle"
          bg={withAlpha(colors.accent.info, 0.2)}
        >
          <MaterialIcons
            name="info-outline"
            size={24}
            color={colors.accent.info}
          />
        </IconChip>
        <View className="flex-1">
          <Text variant="md" className="font-semibold">
            You&apos;re low on {display.label} today
          </Text>
          <Text variant="sm" muted className="mt-1">
            Smart Tip: {tip}
          </Text>
        </View>
      </View>
    </Card>
  );
}
