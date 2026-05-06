import { BackButton } from '@/components/ui/BackButton';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
interface EbookHeaderProps {
  label: string;
  onBack?: () => void;
}

export function EbookHeader({ label, onBack }: EbookHeaderProps) {
  return (
    <View className="flex-row items-center px-4 pb-3">
      <BackButton onPress={onBack} />
      <View className="flex-1 items-center">
        <Text className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-foreground/60">
          Calm Above the Clouds
        </Text>
        <Text className="text-sm font-bold leading-tight tracking-tight text-foreground">
          {label}
        </Text>
      </View>
      <View className="h-10 w-10" />
    </View>
  );
}
