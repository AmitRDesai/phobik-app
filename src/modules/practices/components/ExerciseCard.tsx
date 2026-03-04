import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { Exercise } from '../types';

const GRID_PADDING = 24; // px-6 = 24px each side
const GRID_GAP = 16; // gap-4 = 16px

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - GRID_PADDING * 2 - GRID_GAP / 2) / 2;
  const isPink = exercise.iconColor === 'pink';
  const iconColor = isPink ? colors.primary.pink : colors.accent.yellow;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 active:opacity-80"
      style={{ width: cardWidth }}
    >
      <View className="gap-4">
        {/* Icon */}
        <View
          className={`h-10 w-10 items-center justify-center rounded-xl ${
            isPink ? 'bg-primary-pink/20' : 'bg-accent-yellow/20'
          }`}
        >
          <MaterialIcons
            name={exercise.icon as keyof typeof MaterialIcons.glyphMap}
            size={24}
            color={iconColor}
          />
        </View>

        {/* Text */}
        <View className="gap-1">
          <Text className="text-sm font-bold leading-snug text-white">
            {exercise.name}
          </Text>
          <View className="flex-row">
            <View
              className={`rounded px-2 py-0.5 ${
                isPink ? 'bg-primary-pink/10' : 'bg-accent-yellow/10'
              }`}
            >
              <Text
                className="text-[10px] font-bold uppercase"
                style={{ color: iconColor }}
              >
                {exercise.duration}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
