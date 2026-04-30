import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { clearAudioCache, getCacheSizeBytes } from '@/lib/audio/cache';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'] as const;
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function AudioStorage() {
  const insets = useSafeAreaInsets();
  const [cacheBytes, setCacheBytes] = useState(0);

  const refresh = useCallback(() => {
    setCacheBytes(getCacheSizeBytes());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleClear = async () => {
    if (cacheBytes === 0) return;
    const result = await dialog.error({
      title: 'Clear cached audio?',
      message: `This frees up ${formatBytes(cacheBytes)} of storage. Audio will redownload the next time you start a session.`,
      buttons: [
        { label: 'Clear', value: 'clear', variant: 'destructive' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (result === 'clear') {
      clearAudioCache();
      refresh();
    }
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.5}
      />

      <View
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold text-white">Audio & Storage</Text>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-4 py-4 pb-8">
        <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
          <View className="flex-row items-center gap-3">
            <View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: withAlpha(colors.accent.cyan, 0.15) }}
            >
              <MaterialIcons
                name="library-music"
                size={22}
                color={colors.accent.cyan}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white">
                Cached audio
              </Text>
              <Text className="text-sm text-white/50">
                Sessions you&apos;ve played are stored locally so they work
                offline.
              </Text>
            </View>
          </View>
          <View className="mt-4 flex-row items-baseline gap-2">
            <Text className="text-2xl font-bold text-white">
              {formatBytes(cacheBytes)}
            </Text>
            <Text className="text-sm text-white/50">on this device</Text>
          </View>
        </View>

        <Pressable
          onPress={handleClear}
          disabled={cacheBytes === 0}
          className="items-center rounded-2xl border border-red-500/20 bg-red-500/10 py-4 active:opacity-70"
          style={{ opacity: cacheBytes === 0 ? 0.4 : 1 }}
        >
          <Text className="text-base font-semibold text-red-400">
            Clear cached audio
          </Text>
        </Pressable>

        <Text className="px-2 text-xs leading-relaxed text-white/40">
          Audio re-downloads automatically the next time you open a session.
          Sessions cached on-device will keep working offline.
        </Text>

        <View className="h-2" />
        <Text className="px-2 text-[11px] uppercase tracking-widest text-white/30">
          About
        </Text>
        <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <View className="flex-row items-start gap-3">
            <MaterialIcons
              name="info"
              size={18}
              color={alpha.white50}
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-sm leading-relaxed text-white/60">
              Audio is downloaded on demand from your secure account. The cache
              is capped at 200 MB — older sessions are removed automatically
              when the limit is reached.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
