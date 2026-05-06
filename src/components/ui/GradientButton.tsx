import { colors, withAlpha } from '@/constants/colors';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

interface GradientButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  prefixIcon?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

export function GradientButton({
  onPress,
  children,
  prefixIcon,
  icon,
  disabled,
  loading,
  compact,
  className,
}: GradientButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isInteractionDisabled = disabled || loading;

  const handlePressIn = () => {
    if (loading) return;
    setPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (loading) return;
    setPressed(false);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isInteractionDisabled}
      className={clsx(compact ? '' : 'w-full', className)}
    >
      <EaseView
        animate={{ scale: pressed ? 0.95 : 1, opacity: disabled ? 0.4 : 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 9999,
            paddingHorizontal: compact ? 20 : 32,
            paddingVertical: compact ? 8 : 16,
            minHeight: compact ? undefined : 56,
            justifyContent: 'center',
            boxShadow: `0 4px ${compact ? 15 : 12}px ${withAlpha(
              colors.primary.pink,
              compact ? 0.4 : 0.5,
            )}`,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              {prefixIcon}
              <Text
                className={clsx(
                  'text-center font-bold text-white',
                  compact ? 'text-[10px] uppercase tracking-wider' : 'text-lg',
                )}
              >
                {children}
              </Text>
              {icon}
            </View>
          )}
        </LinearGradient>
      </EaseView>
    </Pressable>
  );
}
