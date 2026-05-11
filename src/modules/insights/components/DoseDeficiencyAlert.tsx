import { InfoCallout } from '@/components/ui/InfoCallout';
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
    <InfoCallout
      tone="cyan"
      title={`You're low on ${display.label} today`}
      description={`Smart Tip: ${tip}`}
      icon={(color) => (
        <MaterialIcons name="info-outline" size={20} color={color} />
      )}
    />
  );
}
