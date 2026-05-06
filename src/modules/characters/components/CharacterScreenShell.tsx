import { BackButton } from '@/components/ui/BackButton';
import { PropsWithChildren } from 'react';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = PropsWithChildren<{
  title: string;
}>;

export function CharacterScreenShell({ title, children }: Props) {
  return (
    <View className="flex-1" style={{ backgroundColor: '#0A0A0A' }}>
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center px-4 py-2">
          <BackButton />
          <Text variant="h3" className="ml-3 text-foreground">
            {title}
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">{children}</View>
      </SafeAreaView>
    </View>
  );
}
