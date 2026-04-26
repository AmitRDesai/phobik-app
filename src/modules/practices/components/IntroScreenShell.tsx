import { GradientButton } from '@/components/ui/GradientButton';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { GradientText } from './GradientText';
import { PracticeScreenShell } from './PracticeScreenShell';

type IntroScreenShellProps = {
  image: ImageSource | number;
  eyebrow?: string;
  title: string;
  /** Optional second line that renders in pink→yellow gradient */
  titleAccent?: string;
  body: string | string[];
  meta?: string;
  pills?: string[];
  stats?: { label: string; value: string }[];
  ctaLabel: string;
  onPress: () => void;
};

export function IntroScreenShell({
  image,
  eyebrow,
  title,
  titleAccent,
  body,
  meta,
  pills,
  stats,
  ctaLabel,
  onPress,
}: IntroScreenShellProps) {
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <PracticeScreenShell wordmark="FLOW STUDIO" scrollContentClassName="pb-40">
      <View className="relative h-[320px] w-full overflow-hidden">
        <Image
          source={image}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          contentFit="cover"
        />
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.05)',
            'rgba(14,14,14,0.6)',
            'rgba(14,14,14,1)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        />
      </View>

      <View className="-mt-16 px-6">
        {eyebrow ? (
          <Text className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-primary-pink">
            {eyebrow}
          </Text>
        ) : null}
        <Text className="text-[36px] font-extrabold leading-tight tracking-tight text-white">
          {title}
        </Text>
        {titleAccent ? (
          <GradientText className="text-[36px] font-extrabold leading-tight tracking-tight">
            {titleAccent}
          </GradientText>
        ) : null}

        {pills && pills.length > 0 ? (
          <View className="mt-4 flex-row flex-wrap gap-2">
            {pills.map((pill) => (
              <View
                key={pill}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5"
              >
                <Text className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  {pill}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="mt-6 gap-4">
          {paragraphs.map((p, i) => (
            <Text key={i} className="text-base leading-relaxed text-white/75">
              {p}
            </Text>
          ))}
        </View>

        {stats && stats.length > 0 ? (
          <View className="mt-6 flex-row gap-3">
            {stats.map((stat) => (
              <View
                key={stat.label}
                className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <Text className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {stat.label}
                </Text>
                <Text className="mt-1 text-base font-bold text-white">
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {meta ? (
          <Text className="mt-6 text-xs uppercase tracking-widest text-white/50">
            {meta}
          </Text>
        ) : null}

        <View className="mt-8">
          <GradientButton onPress={onPress}>{ctaLabel}</GradientButton>
        </View>
      </View>
    </PracticeScreenShell>
  );
}
