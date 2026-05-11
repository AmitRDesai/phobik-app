import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  Line,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

const CONTAINER_SIZE = 320;
const CENTER = CONTAINER_SIZE / 2;
const RADIUS = 120;
const NODE_SIZE = 56;
const HUB_SIZE = 80;

const FEELINGS = [
  {
    id: 'courage',
    label: 'Courage',
    icon: 'bolt' as const,
    angle: -Math.PI / 2,
  },
  { id: 'calm', label: 'Calm', icon: 'cloud' as const, angle: -Math.PI / 4 },
  {
    id: 'confidence',
    label: 'Confidence',
    icon: 'auto-awesome' as const,
    angle: 0,
  },
  {
    id: 'clarity',
    label: 'Clarity',
    icon: 'wb-sunny' as const,
    angle: Math.PI / 4,
  },
  {
    id: 'compassion',
    label: 'Compassion',
    icon: 'favorite' as const,
    angle: Math.PI / 2,
  },
  {
    id: 'curiosity',
    label: 'Curiosity',
    icon: 'psychology' as const,
    angle: (3 * Math.PI) / 4,
  },
  {
    id: 'creativity',
    label: 'Creativity',
    icon: 'palette' as const,
    angle: Math.PI,
  },
  {
    id: 'connection',
    label: 'Connection',
    icon: 'groups' as const,
    angle: -(3 * Math.PI) / 4,
  },
];

interface FeelingCompassProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function FeelingCompass({ selected, onSelect }: FeelingCompassProps) {
  const scheme = useScheme();
  const handleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(id);
  };

  const selectedFeeling = FEELINGS.find((f) => f.id === selected);
  const selectedX = selectedFeeling
    ? CENTER + RADIUS * Math.cos(selectedFeeling.angle)
    : 0;
  const selectedY = selectedFeeling
    ? CENTER + RADIUS * Math.sin(selectedFeeling.angle)
    : 0;

  return (
    <View style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
      {/* Energy line from center to selected node */}
      {selectedFeeling && (
        <Svg
          width={CONTAINER_SIZE}
          height={CONTAINER_SIZE}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <SvgLinearGradient
              id="lineGrad"
              x1={CENTER.toString()}
              y1={CENTER.toString()}
              x2={selectedX.toString()}
              y2={selectedY.toString()}
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={colors.primary.pink}
                stopOpacity={0.1}
              />
              <Stop
                offset="1"
                stopColor={colors.primary.pink}
                stopOpacity={0.8}
              />
            </SvgLinearGradient>
          </Defs>
          <Line
            x1={CENTER}
            y1={CENTER}
            x2={selectedX}
            y2={selectedY}
            stroke="url(#lineGrad)"
            strokeWidth={1.5}
          />
        </Svg>
      )}

      <View
        style={{
          position: 'absolute',
          left: CENTER - HUB_SIZE / 2,
          top: CENTER - HUB_SIZE / 2,
          width: HUB_SIZE,
          height: HUB_SIZE,
          borderRadius: HUB_SIZE / 2,
          backgroundColor: foregroundFor(scheme, 0.05),
          borderWidth: 1,
          borderColor: foregroundFor(scheme, 0.2),
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Text
          size="xs"
          treatment="caption"
          className={clsx(
            'font-bold',
            selected ? 'text-primary-pink' : 'text-foreground/50',
          )}
        >
          Core
        </Text>
      </View>

      {/* Feeling nodes */}
      {FEELINGS.map((feeling) => {
        const x = CENTER + RADIUS * Math.cos(feeling.angle);
        const y = CENTER + RADIUS * Math.sin(feeling.angle);
        const isSelected = selected === feeling.id;

        return (
          <View
            key={feeling.id}
            style={{
              position: 'absolute',
              left: x - 40,
              top: y - NODE_SIZE / 2,
              width: 80,
              alignItems: 'center',
              zIndex: 20,
            }}
          >
            <Pressable onPress={() => handleSelect(feeling.id)}>
              {isSelected ? (
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: NODE_SIZE + 4,
                    height: NODE_SIZE + 4,
                    borderRadius: (NODE_SIZE + 4) / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${withAlpha(colors.primary.pink, 0.6)}`,
                  }}
                >
                  <View
                    style={{
                      width: NODE_SIZE,
                      height: NODE_SIZE,
                      borderRadius: NODE_SIZE / 2,
                      backgroundColor: foregroundFor(scheme, 0.1),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons
                      name={feeling.icon}
                      size={22}
                      color="white"
                    />
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={{
                    width: NODE_SIZE,
                    height: NODE_SIZE,
                    borderRadius: NODE_SIZE / 2,
                    backgroundColor: foregroundFor(scheme, 0.03),
                    borderWidth: 1,
                    borderColor: foregroundFor(scheme, 0.1),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 2,
                  }}
                >
                  <MaterialIcons
                    name={feeling.icon}
                    size={22}
                    color={foregroundFor(scheme, 0.4)}
                  />
                </View>
              )}
            </Pressable>
            <Text
              size="xs"
              className={clsx(
                'mt-1 text-center text-[8px] font-semibold tracking-wider',
                isSelected ? 'text-foreground' : 'text-foreground/40',
              )}
              style={{ paddingRight: 1.6 }}
            >
              {feeling.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
