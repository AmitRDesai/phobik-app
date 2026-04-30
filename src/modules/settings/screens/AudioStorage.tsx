import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { clearAudioCache, getCacheSizeBytes } from '@/lib/audio/cache';
import { audioVoiceAtom, type AudioVoice } from '@/lib/audio/voice';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAtom } from 'jotai';
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

type VoiceChoice = {
  value: AudioVoice;
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
};

const VOICE_CHOICES: VoiceChoice[] = [
  { value: 'female', label: 'Female', iconName: 'female' },
  { value: 'male', label: 'Male', iconName: 'male' },
];

export default function AudioStorage() {
  const insets = useSafeAreaInsets();
  const [cacheBytes, setCacheBytes] = useState(0);
  const [voice, setVoice] = useAtom(audioVoiceAtom);

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
        {/* Voice preference */}
        <Text className="px-2 text-[11px] uppercase tracking-widest text-white/30">
          Voice
        </Text>
        <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <View className="flex-row items-center gap-3">
            <View
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: withAlpha(colors.primary.pink, 0.15) }}
            >
              <MaterialIcons
                name="record-voice-over"
                size={22}
                color={colors.primary.pink}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white">
                Narrator voice
              </Text>
              <Text className="text-sm text-white/50">
                Default voice for guided audio. Override per-session from any
                screen.
              </Text>
            </View>
          </View>
          <View className="mt-4 flex-row gap-2">
            {VOICE_CHOICES.map((choice) => {
              const isSelected = voice === choice.value;
              return (
                <Pressable
                  key={choice.value}
                  onPress={() => setVoice(choice.value)}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border px-3 py-3 active:opacity-70"
                  style={{
                    borderColor: isSelected
                      ? withAlpha(colors.primary.pink, 0.45)
                      : withAlpha('#ffffff', 0.1),
                    backgroundColor: isSelected
                      ? withAlpha(colors.primary.pink, 0.1)
                      : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <MaterialIcons
                    name={choice.iconName}
                    size={16}
                    color={isSelected ? colors.primary.pink : 'white'}
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: isSelected ? colors.primary.pink : 'white',
                    }}
                  >
                    {choice.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {voice ? (
            <Pressable
              onPress={() => setVoice(null)}
              className="mt-3 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 active:opacity-70"
            >
              <Text className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                Clear preference
              </Text>
            </Pressable>
          ) : (
            <Text className="mt-3 text-xs text-white/40">
              No preference set yet — you&apos;ll be asked the first time you
              play guided audio.
            </Text>
          )}
        </View>

        {/* Storage */}
        <View className="h-2" />
        <Text className="px-2 text-[11px] uppercase tracking-widest text-white/30">
          Storage
        </Text>
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
