import { Text, View } from '@/components/themed';
import { BackButton } from '@/components/ui/BackButton';

interface EbookHeaderProps {
  label: string;
  onBack?: () => void;
}

export function EbookHeader({ label, onBack }: EbookHeaderProps) {
  return (
    <View className="flex-row items-center px-4 pb-3">
      <BackButton onPress={onBack} />
      <View className="flex-1 items-center">
        <Text variant="caption" muted className="mb-0.5">
          Calm Above the Clouds
        </Text>
        <Text variant="sm" className="font-bold leading-tight">
          {label}
        </Text>
      </View>
      <View className="h-10 w-10" />
    </View>
  );
}
