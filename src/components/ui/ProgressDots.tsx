import { View } from 'react-native';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current - 1;
        return (
          <View
            key={index}
            className={
              isActive
                ? 'h-2 w-8 rounded-full bg-primary-pink'
                : 'h-2 w-2 rounded-full bg-white/20'
            }
          />
        );
      })}
    </View>
  );
}
