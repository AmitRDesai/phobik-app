import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { View } from 'react-native';

interface AuraFilterToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function AuraFilterToggle({ enabled, onToggle }: AuraFilterToggleProps) {
  return (
    <Card variant="flat" className="p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-1">
          <Text weight="bold" size="md">
            Apply Aura Filter
          </Text>
          <Text tone="secondary" size="sm">
            Enhance your photo with our signature glow
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={() => onToggle()}
          accessibilityLabel="Apply Aura Filter"
        />
      </View>
    </Card>
  );
}
