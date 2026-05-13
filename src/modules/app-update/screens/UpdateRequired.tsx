import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';
import { Linking } from 'react-native';
import { updateRequiredAtom } from '../store/app-update';

export default function UpdateRequired() {
  const required = useAtomValue(updateRequiredAtom);
  const storeUrl = required?.storeUrl;

  return (
    <Screen className="flex-1 justify-center gap-8 px-6">
      <View className="items-center gap-5">
        <IconChip size="lg" shape="circle">
          {(color) => (
            <MaterialIcons name="system-update" size={32} color={color} />
          )}
        </IconChip>
        <View className="flex-row items-baseline justify-center">
          <Text size="display" weight="black">
            Time to{' '}
          </Text>
          <GradientText className="text-[40px] font-black leading-[44px]">
            update
          </GradientText>
        </View>
        <Text
          size="md"
          tone="secondary"
          align="center"
          className="max-w-[300px]"
        >
          There&apos;s a new version of Phobik. Please update to keep going.
        </Text>
      </View>

      <Button
        onPress={() => {
          if (!storeUrl) return;
          Linking.openURL(storeUrl).catch(() => {
            toast.error("Couldn't open the App Store. Please try again.");
          });
        }}
        prefixIcon={
          <MaterialIcons name="open-in-new" size={20} color="white" />
        }
      >
        Update Now
      </Button>
    </Screen>
  );
}
