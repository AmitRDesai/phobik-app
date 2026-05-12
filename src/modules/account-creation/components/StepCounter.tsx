import { Text } from '@/components/themed/Text';

export interface StepCounterProps {
  current: number;
  total: number;
}

/**
 * "Step X of Y" caption rendered under the sticky CTA across the
 * account-creation / profile-setup flows. Uppercase + wide tracking to
 * match the eyebrow style; small right padding compensates for the
 * Android letter-spacing clip on the last character.
 */
export function StepCounter({ current, total }: StepCounterProps) {
  return (
    <Text
      size="xs"
      treatment="caption"
      tone="secondary"
      className="mt-3 tracking-[0.2em]"
      style={{ paddingRight: 2.2 }}
    >
      Step {current} of {total}
    </Text>
  );
}
