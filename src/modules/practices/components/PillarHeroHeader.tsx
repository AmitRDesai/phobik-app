import { Text, View } from 'react-native';

import { GradientText } from './GradientText';

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
      <Text className="text-[44px] font-extrabold uppercase leading-none tracking-tighter text-white">
        {title}
      </Text>
      {accent ? (
        <GradientText className="text-[44px] font-extrabold uppercase leading-none tracking-tighter">
          {accent}
        </GradientText>
      ) : null}
      {subtitle ? (
        <Text className="mt-4 max-w-[320px] text-base leading-relaxed text-white/60">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
