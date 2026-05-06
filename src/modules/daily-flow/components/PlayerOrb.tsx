import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

function Ring({
  size,
  borderColor,
  duration,
}: {
  size: number;
  borderColor: string;
  duration: number;
}) {
  return (
    <EaseView
      initialAnimate={{ scale: 1, opacity: 0.4 }}
      animate={{ scale: 1.05, opacity: 0.75 }}
      transition={{
        type: 'timing',
        duration,
        easing: 'easeInOut',
        loop: 'reverse',
      }}
      className="absolute rounded-full border"
      style={{
        width: size,
        height: size,
        borderColor,
      }}
    />
  );
}

type Props = {
  cue: string;
};

export function PlayerOrb({ cue }: Props) {
  return (
    <View className="h-[320px] w-[320px] items-center justify-center">
      <Ring
        size={320}
        borderColor={withAlpha(colors.primary.pink, 0.15)}
        duration={3600}
      />
      <Ring
        size={260}
        borderColor={withAlpha(colors.accent.yellow, 0.15)}
        duration={3800}
      />
      <Ring
        size={200}
        borderColor={withAlpha(colors.accent.purple, 0.15)}
        duration={4000}
      />
      <EaseView
        initialAnimate={{ scale: 1 }}
        animate={{ scale: 1.04 }}
        transition={{
          type: 'timing',
          duration: 3200,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
        className="h-[140px] w-[140px] overflow-hidden rounded-full"
        style={{
          boxShadow: `0 0 30px ${withAlpha(colors.primary.pink, 0.6)}`,
        }}
      >
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text className="text-base font-black uppercase tracking-[0.2em] text-black">
            {cue}
          </Text>
        </LinearGradient>
      </EaseView>
    </View>
  );
}
