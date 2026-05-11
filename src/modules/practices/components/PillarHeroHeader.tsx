import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';

type PillarHeroHeaderProps = {
  title: string;
  accent?: string;
  subtitle?: string;
};

export function PillarHeroHeader({
  title,
  accent,
  subtitle,
}: PillarHeroHeaderProps) {
  return (
    <View className="mb-10 mt-6">
      <Text size="display" className="uppercase leading-[1.05]">
        {title}
      </Text>
      {accent ? (
        <GradientText className="text-4xl font-extrabold uppercase leading-[1.05]">
          {accent}
        </GradientText>
      ) : null}
      {subtitle ? (
        <Text
          size="lg"
          tone="secondary"
          className="mt-4 max-w-[320px] leading-relaxed"
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
