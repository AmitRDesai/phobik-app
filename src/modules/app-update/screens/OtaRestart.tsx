import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { MaterialIcons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

async function applyUpdate() {
  try {
    await Updates.reloadAsync();
  } catch {
    // Best-effort — if reload fails the next cold start picks up the
    // downloaded bundle anyway. Never surface to the user.
  }
}

export default function OtaRestart() {
  return (
    <Screen className="flex-1 justify-center gap-8 px-6">
      <View className="items-center gap-5">
        <IconChip size="lg" shape="circle">
          {(color) => (
            <MaterialIcons name="autorenew" size={32} color={color} />
          )}
        </IconChip>
        <View className="flex-row items-baseline justify-center">
          <Text size="display" weight="black">
            Time to{' '}
          </Text>
          <GradientText className="text-[40px] font-black leading-[44px]">
            restart
          </GradientText>
        </View>
        <Text
          size="md"
          tone="secondary"
          align="center"
          className="max-w-[300px]"
        >
          A new version is ready. Restart to keep going.
        </Text>
      </View>

      <Button
        onPress={() => {
          applyUpdate();
        }}
        prefixIcon={<MaterialIcons name="refresh" size={20} color="white" />}
      >
        Restart Now
      </Button>
    </Screen>
  );
}
