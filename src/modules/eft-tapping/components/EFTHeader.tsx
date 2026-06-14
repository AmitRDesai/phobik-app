import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';

/** Shared title block for the EFT guide screens (Points Guide + TOH Focus). */
export function EFTHeader() {
  return (
    <View className="mt-2">
      <Text weight="black" className="text-[34px] leading-tight">
        EFT Tapping
      </Text>
      <GradientText className="text-[34px] font-black leading-tight">
        Points Quick Tutorial
      </GradientText>
      <Text size="sm" tone="secondary" className="mt-3 leading-5">
        Follow the sequence below to release emotional blocks and restore
        balance.
      </Text>
    </View>
  );
}
