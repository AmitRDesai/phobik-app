import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { BODY_AREAS, type BodyArea } from '../data/body-areas';

interface BodySilhouetteProps {
  selectedArea: string | null;
  onSelectArea: (id: string) => void;
}

const BODY_PATH =
  'M50,10 C40,10 35,18 35,25 C35,32 40,40 50,40 C60,40 65,32 65,25 C65,18 60,10 50,10 M35,42 Q20,45 20,60 L20,110 Q20,120 30,120 L35,120 L35,190 Q35,200 45,200 L55,200 Q65,200 65,190 L65,120 L70,120 Q80,120 80,110 L80,60 Q80,45 65,42 Z';

export function BodySilhouette({
  selectedArea,
  onSelectArea,
}: BodySilhouetteProps) {
  const handlePress = (area: BodyArea) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectArea(area.id);
  };

  return (
    <View
      className="relative items-center overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5"
      style={{ height: 360 }}
    >
      {/* Pink radial glow behind body */}
      <Svg
        width={300}
        height={300}
        viewBox="0 0 300 300"
        style={{ position: 'absolute', top: 30, opacity: 0.1 }}
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient id="bodyGlow" cx="50%" cy="40%" r="50%">
            <Stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
            <Stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="150" cy="130" rx="120" ry="140" fill="url(#bodyGlow)" />
      </Svg>

      {/* Body SVG */}
      <View className="absolute items-center" style={{ top: 30 }}>
        <Svg width={160} height={280} viewBox="0 0 100 200">
          <Path
            d={BODY_PATH}
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={0.5}
          />
        </Svg>
      </View>

      {/* Hotspot buttons — always show their accent color */}
      {BODY_AREAS.map((area) => {
        const isSelected = selectedArea === area.id;
        return (
          <Pressable
            key={area.id}
            onPress={() => handlePress(area)}
            className="absolute items-center justify-center self-center rounded-full px-4 py-1.5"
            style={{
              top: 30 + (area.topPercent / 100) * 280,
              backgroundColor: area.bgColor,
              borderWidth: 1,
              borderColor: isSelected ? area.accentColor : area.borderColor,
              transform: [{ scale: isSelected ? 1.08 : 1 }],
            }}
          >
            <Text
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: area.accentColor }}
            >
              {area.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
