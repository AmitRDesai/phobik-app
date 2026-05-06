import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { AssessmentMeta } from '../data/assessments';

interface AssessmentCardProps {
  assessment: AssessmentMeta;
  isInProgress?: boolean;
  onPress: () => void;
}

const cardShadow = {
  borderRadius: 28,
  boxShadow: [
    {
      offsetX: 0,
      offsetY: 16,
      blurRadius: 32,
      spreadDistance: -8,
      color: `${colors.primary.pink}1A`,
    },
  ],
} as const;

function renderIcon(assessment: AssessmentMeta) {
  const icon = assessment.icon;
  const size = 24;
  const color = colors.primary.pink;

  if ('family' in icon && icon.family === 'ionicons') {
    return <Ionicons name={icon.name} size={size} color={color} />;
  }

  return (
    <MaterialIcons
      name={(icon as { name: keyof typeof MaterialIcons.glyphMap }).name}
      size={size}
      color={color}
    />
  );
}

export function AssessmentCard({
  assessment,
  isInProgress,
  onPress,
}: AssessmentCardProps) {
  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View
        className="overflow-hidden rounded-[28px] border border-foreground/10 bg-foreground/5 p-6"
        style={cardShadow}
      >
        <View className="mb-5 flex-row items-center gap-4">
          <View
            className="h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-foreground/10"
            style={{
              shadowColor: withAlpha(colors.primary.pink, 0.5),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 12,
            }}
          >
            {renderIcon(assessment)}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              {assessment.title}
            </Text>
            <Text className="mt-1 text-xs leading-relaxed text-foreground/60">
              {assessment.description}
            </Text>
          </View>
        </View>

        <View className="self-start">
          <GradientButton
            compact
            onPress={onPress}
            icon={
              <MaterialIcons
                name={isInProgress ? 'play-arrow' : 'arrow-forward'}
                size={14}
                color="white"
              />
            }
          >
            {isInProgress ? 'Resume' : 'Start Test'}
          </GradientButton>
        </View>
      </View>
    </Pressable>
  );
}
