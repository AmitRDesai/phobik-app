import { colors, withAlpha } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import type { AssessmentMeta } from '../data/assessments';

interface AssessmentCardProps {
  assessment: AssessmentMeta;
  isInProgress?: boolean;
  onPress: () => void;
}

function renderIcon(assessment: AssessmentMeta) {
  const icon = assessment.icon;
  const size = 28;
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
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-2xl bg-card-elevated active:opacity-95"
    >
      <View className="p-5">
        <View className="mb-4 flex-row items-center gap-4">
          <View
            className="h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor: withAlpha(colors.primary.pink, 0.1),
              borderWidth: 1,
              borderColor: withAlpha(colors.primary.pink, 0.3),
            }}
          >
            {renderIcon(assessment)}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">
              {assessment.title}
            </Text>
            <Text className="text-xs text-slate-400">
              {assessment.description}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={
            isInProgress
              ? [colors.accent.yellow, colors.accent.gold]
              : [colors.primary.pink, colors.accent.yellow]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <View className="flex-row items-center justify-center gap-2">
            <MaterialIcons
              name={isInProgress ? 'play-arrow' : 'arrow-forward'}
              size={16}
              color={isInProgress ? colors.background.dark : 'white'}
            />
            <Text
              className={`text-xs font-black uppercase tracking-widest ${isInProgress ? 'text-background-dark' : 'text-white'}`}
            >
              {isInProgress ? 'Resume' : 'Start Test'}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
