import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import {
  getFeeling,
  type AccentToken,
  type FeelingActionItem,
  type FeelingContent,
  type MindfulCardContent,
  type VisualAnchor,
  type VisualCloud,
  type VisualEthereal,
  type VisualFocus,
} from '../data/feelings';
import type { FeelingId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const ACCENT_COLORS: Record<AccentToken, string> = {
  primary: colors.primary.pink,
  secondary: colors.accent.yellow,
  tertiary: colors.accent.purple,
};

export default function FeelingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ feelingId?: string }>();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const feelingId = (params.feelingId ?? session?.feeling) as
    | FeelingId
    | undefined;
  const feeling = feelingId ? getFeeling(feelingId) : undefined;

  if (isLoading || !session || !feeling) return <LoadingScreen />;

  const accent = ACCENT_COLORS[feeling.accentToken];

  const handleContinue = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'guide',
    });
    router.push('/daily-flow/guide');
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.18}
        intensity={0.5}
        startColor={accent}
        endColor={colors.accent.yellow}
      />
      <DailyFlowHeader wordmark />
      <ScrollView
        contentContainerClassName="px-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Hero feeling={feeling} />

        {feeling.actionItemStyle === 'bento' ? (
          <BigQuoteCard feeling={feeling} />
        ) : (
          <InsightCard feeling={feeling} />
        )}

        {feeling.actionItemStyle === 'bento' ? (
          <BentoGrid items={feeling.actionItems} />
        ) : null}

        {feeling.actionItemStyle === 'bento-tall' ? (
          <BentoTallGrid items={feeling.actionItems} />
        ) : null}

        {feeling.actionItemStyle === 'compact' &&
        feeling.actionItems.length > 0 &&
        feeling.insightLabel ? (
          <CompactActionList
            items={feeling.actionItems}
            label={feeling.actionsLabel}
          />
        ) : null}

        {feeling.visualAnchor ? (
          <VisualAnchorCard anchor={feeling.visualAnchor} />
        ) : null}

        {feeling.visualFocus ? (
          <VisualFocusCard focus={feeling.visualFocus} />
        ) : null}

        {feeling.visualCloud ? (
          <VisualCloudCard cloud={feeling.visualCloud} />
        ) : null}

        {feeling.visualEthereal ? (
          <VisualEtherealCard ethereal={feeling.visualEthereal} />
        ) : null}

        <View className="mt-8 items-center">
          <GradientButton
            onPress={handleContinue}
            loading={updateSession.isPending}
          >
            Continue
          </GradientButton>
          {feeling.ctaSubtitle ? (
            <Text className="mt-4 text-sm font-medium text-white/50">
              {feeling.ctaSubtitle}
            </Text>
          ) : null}
        </View>

        {feeling.mindfulCard ? (
          <MindfulCard card={feeling.mindfulCard} />
        ) : null}
      </ScrollView>
    </View>
  );
}

function Hero({ feeling }: { feeling: FeelingContent }) {
  const subtitleColor = ACCENT_COLORS[feeling.subtitleColor];
  const showCategory = feeling.showCategoryLabel !== false;
  return (
    <View className="mb-6 mt-2">
      {showCategory ? (
        <View className="flex-row items-center gap-2">
          <View
            className="h-[1px] w-12 opacity-40"
            style={{ backgroundColor: subtitleColor }}
          />
          <Text
            className="text-[11px] font-bold uppercase tracking-[0.3em]"
            style={{ color: subtitleColor }}
          >
            Emotional Regulation
          </Text>
        </View>
      ) : null}
      <Text
        className={`${showCategory ? 'mt-4' : ''} text-[64px] font-black leading-[0.95] tracking-tight text-white`}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {feeling.detailTitle}
      </Text>
      <Text
        className="mt-2 text-2xl font-medium"
        style={{
          color: subtitleColor,
          fontStyle: feeling.subtitleItalic ? 'italic' : 'normal',
        }}
      >
        {feeling.detailSubtitle}
      </Text>
    </View>
  );
}

function InsightCard({ feeling }: { feeling: FeelingContent }) {
  const accent = ACCENT_COLORS[feeling.accentToken];
  const style = feeling.emphasisStyle ?? 'split-muted';
  return (
    <View className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.04] p-7">
      {feeling.insightLabel ? (
        <Text className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white/55">
          {feeling.insightLabel}
        </Text>
      ) : null}

      {style === 'continuous-bold' ? (
        <Text className="text-2xl font-bold leading-[1.3] text-white">
          {feeling.descriptionLead}
          {feeling.descriptionEmphasis}
        </Text>
      ) : style === 'plain' ? (
        <Text className="text-xl leading-relaxed text-white/70">
          {feeling.descriptionLead}
          {feeling.descriptionEmphasis}
        </Text>
      ) : (
        <>
          <Text className="text-lg leading-7 text-white/70">
            {feeling.descriptionLead}
            <Text className="font-semibold text-white">
              {feeling.descriptionEmphasis}
            </Text>
          </Text>
          <View
            className="mt-5 h-[1px] w-20"
            style={{ backgroundColor: accent }}
          />
          {feeling.actionItems.length > 0 && !feeling.insightLabel ? (
            <View className="mt-6 gap-4">
              {feeling.actionItems.map((item) => (
                <CompactActionRow
                  key={item.label}
                  item={item}
                  accent={accent}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

function CompactActionList({
  items,
  label,
}: {
  items: FeelingActionItem[];
  label?: string;
}) {
  return (
    <View className="mt-8">
      {label ? (
        <Text className="mb-3 ml-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/55">
          {label}
        </Text>
      ) : null}
      <View className="gap-3">
        {items.map((item) => (
          <View
            key={item.label}
            className="flex-row items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-5"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
              <MaterialIcons
                name={item.icon as keyof typeof MaterialIcons.glyphMap}
                size={22}
                color={colors.primary.pink}
              />
            </View>
            <Text className="flex-1 text-base font-medium text-white">
              {item.label}
              {item.labelItalic ? (
                <Text className="italic" style={{ color: colors.primary.pink }}>
                  {' '}
                  {item.labelItalic}
                </Text>
              ) : null}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CompactActionRow({
  item,
  accent,
}: {
  item: FeelingActionItem;
  accent: string;
}) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]">
        <MaterialIcons
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={20}
          color={accent}
        />
      </View>
      <Text className="flex-1 text-base font-medium text-white">
        {item.label}
      </Text>
    </View>
  );
}

function BigQuoteCard({ feeling }: { feeling: FeelingContent }) {
  return (
    <View className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.04] p-8">
      <LinearGradient
        colors={['rgba(255,215,9,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Text className="text-[26px] font-bold leading-[1.25] text-white">
        {feeling.descriptionLead}
        {'\n'}
        <Text className="font-normal text-white/60">
          {feeling.descriptionEmphasis}
        </Text>
      </Text>
    </View>
  );
}

function BentoGrid({ items }: { items: FeelingActionItem[] }) {
  return (
    <View className="mt-4 gap-3">
      {items.map((item) => (
        <BentoCard key={item.label} item={item} />
      ))}
    </View>
  );
}

function BentoTallGrid({ items }: { items: FeelingActionItem[] }) {
  return (
    <View className="mt-4 gap-3">
      {items.map((item) => {
        const accent = ACCENT_COLORS[item.accent ?? 'primary'];
        return (
          <View
            key={item.label}
            className="h-40 justify-between rounded-2xl bg-white/[0.04] p-6"
          >
            <MaterialIcons
              name={item.icon as keyof typeof MaterialIcons.glyphMap}
              size={28}
              color={accent}
            />
            <Text className="text-lg font-bold leading-tight text-white">
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function VisualEtherealCard({ ethereal }: { ethereal: VisualEthereal }) {
  return (
    <View
      className="mt-8 w-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03]"
      style={{ aspectRatio: 4 / 5 }}
    >
      <Image
        source={ethereal.image}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.8,
        }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(14,14,14,0.8)']}
        locations={[0.3, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View className="flex-1 items-center justify-center px-8">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            padding: 2,
          }}
        >
          <View className="h-full w-full items-center justify-center rounded-full bg-background-charcoal">
            <MaterialIcons
              name={ethereal.icon as keyof typeof MaterialIcons.glyphMap}
              size={36}
              color={colors.primary.pink}
            />
          </View>
        </LinearGradient>
        <Text className="mt-8 text-center text-lg italic leading-7 text-white/90">
          &ldquo;{ethereal.quote}&rdquo;
        </Text>
      </View>
    </View>
  );
}

function VisualCloudCard({ cloud }: { cloud: VisualCloud }) {
  return (
    <View
      className="mt-8 w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: 3 / 2 }}
    >
      <Image
        source={cloud.image}
        style={{ width: '100%', height: '100%', opacity: 0.75 }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(14,14,14,0.9)']}
        locations={[0.5, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
}

function BentoCard({ item }: { item: FeelingActionItem }) {
  const accent = ACCENT_COLORS[item.accent ?? 'primary'];
  if (item.fullWidth) {
    return (
      <View
        className="overflow-hidden rounded-2xl border-l-4 bg-white/[0.04] p-6"
        style={{ borderLeftColor: `${accent}66` }}
      >
        <View className="flex-row items-center gap-4">
          <MaterialIcons
            name={item.icon as keyof typeof MaterialIcons.glyphMap}
            size={32}
            color={accent}
          />
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">
              {item.title ?? item.label}
            </Text>
            {item.description ? (
              <Text className="mt-1 text-sm text-white/60">
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
  return (
    <View className="rounded-2xl bg-white/[0.04] p-6">
      <MaterialIcons
        name={item.icon as keyof typeof MaterialIcons.glyphMap}
        size={26}
        color={accent}
      />
      <Text className="mt-4 text-lg font-bold leading-tight text-white">
        {item.title ?? item.label}
      </Text>
      {item.description ? (
        <Text className="mt-2 text-sm text-white/60">{item.description}</Text>
      ) : null}
    </View>
  );
}

function VisualAnchorCard({ anchor }: { anchor: VisualAnchor }) {
  return (
    <View
      className="mt-8 w-full overflow-hidden rounded-3xl shadow-2xl"
      style={{ aspectRatio: 21 / 9 }}
    >
      <Image
        source={anchor.image}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View className="absolute bottom-5 left-6">
        <Text
          className="text-[10px] font-black uppercase tracking-[0.25em]"
          style={{ color: colors.accent.yellow }}
        >
          {anchor.label}
        </Text>
        <Text className="mt-1 text-lg font-medium text-white/85">
          {anchor.title}
        </Text>
      </View>
    </View>
  );
}

function VisualFocusCard({ focus }: { focus: VisualFocus }) {
  return (
    <View className="mt-8 w-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-4">
      <View className="aspect-square w-full overflow-hidden rounded-2xl bg-black/50">
        <Image
          source={focus.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <Text className="mt-4 text-center text-sm leading-6 text-white/55">
        {focus.caption}
      </Text>
    </View>
  );
}

function MindfulCard({ card }: { card: MindfulCardContent }) {
  return (
    <View className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <View className="aspect-square w-full overflow-hidden rounded-2xl bg-black/40">
        <Image
          source={card.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <Text className="mt-4 text-center text-sm italic leading-6 text-white/65">
        &ldquo;{card.quote}&rdquo;
      </Text>
    </View>
  );
}
