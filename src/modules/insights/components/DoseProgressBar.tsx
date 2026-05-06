import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { DoseChemical } from '../data/dose-config';

const WAVE_PATHS = [
  'M0,50 C150,20 350,80 500,50 C650,20 850,80 1000,50 L1000,100 L0,100 Z',
  'M0,50 C200,80 400,20 600,50 C800,80 1000,20 1200,50 L1200,100 L0,100 Z',
  'M0,50 C100,10 250,90 400,50 C550,10 750,90 900,50 L1000,100 L0,100 Z',
  'M0,50 C300,30 600,70 900,50 C1200,30 1500,70 1800,50 L1800,100 L0,100 Z',
];

interface DoseProgressBarProps {
  chemical: DoseChemical;
  index?: number;
}

export function DoseProgressBar({ chemical, index = 0 }: DoseProgressBarProps) {
  const progress = (chemical.coins / chemical.maxCoins) * 100;
  const wavePath = WAVE_PATHS[index % WAVE_PATHS.length];

  return (
    <View className="gap-2">
      <View className="flex-row items-end justify-between">
        <View className="gap-0.5">
          <Text className="font-medium" style={{ color: chemical.color }}>
            {chemical.label}
          </Text>
          <Text className="text-[10px] uppercase tracking-widest text-foreground/50">
            {chemical.subtitle}
          </Text>
        </View>
        <Text className="text-lg font-bold" style={{ color: chemical.color }}>
          {chemical.coins} Coins
        </Text>
      </View>
      <View className="h-12 w-full overflow-hidden rounded-2xl bg-foreground/5">
        {/* Progress fill — solid color at 20% opacity */}
        <View
          className="absolute inset-y-0 left-0 rounded-2xl"
          style={{
            width: `${progress}%`,
            backgroundColor: chemical.color + '33',
          }}
        />
        {/* Wave SVG — full width, blurred for soft glow */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.8,
          }}
        >
          <Svg
            width="150%"
            height="100%"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <Path d={wavePath} fill={chemical.color} fillOpacity={0.4} />
          </Svg>
        </View>
      </View>
    </View>
  );
}
