import { BackButton } from '@/components/ui/BackButton';
import { BlurView } from 'expo-blur';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StressorHeaderProps {
  title: string;
  subtitle: string;
}

export function StressorHeader({ title, subtitle }: StressorHeaderProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      className="border-b border-white/5 px-4 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center">
        <BackButton className="mr-4" />
        <View>
          <Text className="text-xl font-black uppercase leading-none tracking-tight text-white">
            {title}
          </Text>
          <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary-pink">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>{content}</View>
    );
  }

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      {content}
    </BlurView>
  );
}
