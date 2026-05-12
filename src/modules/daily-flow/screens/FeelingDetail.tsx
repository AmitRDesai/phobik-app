import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { variantConfig } from '@/components/variant-config';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Image } from 'react-native';

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

function useAccentColors(): Record<AccentToken, string> {
  const scheme = useScheme();
  return {
    primary: colors.primary.pink,
    secondary: accentFor(scheme, 'yellow'),
    tertiary: colors.accent.purple,
  };
}

export default function FeelingDetail() {
  const router = useRouter();
  const scheme = useScheme();
  const accents = useAccentColors();
  const params = useLocalSearchParams<{ feelingId?: string }>();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const feelingId = (params.feelingId ?? session?.feeling) as
    | FeelingId
    | undefined;
  const feeling = feelingId ? getFeeling(feelingId) : undefined;

  if (isLoading || !session || !feeling) return <LoadingScreen />;

  const handleContinue = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'guide',
    });
    router.push('/daily-flow/guide');
  };

  return (
    <Screen
      scroll
      header={<DailyFlowHeader wordmark />}
      sticky={
        <View className="items-center">
          <Button onPress={handleContinue} loading={updateSession.isPending}>
            Continue
          </Button>
          {feeling.ctaSubtitle ? (
            <Text
              size="sm"
              align="center"
              weight="medium"
              className="mt-4 text-foreground/50"
            >
              {feeling.ctaSubtitle}
            </Text>
          ) : null}
        </View>
      }
      className="px-6"
      contentClassName="gap-8 pb-4"
    >
      <Hero feeling={feeling} accents={accents} />

      {feeling.actionItemStyle === 'bento' ? (
        <BigQuoteCard feeling={feeling} />
      ) : (
        <InsightCard feeling={feeling} accents={accents} />
      )}

      {feeling.actionItemStyle === 'bento' ? (
        <BentoGrid items={feeling.actionItems} accents={accents} />
      ) : null}

      {feeling.actionItemStyle === 'compact' &&
      feeling.actionItems.length > 0 ? (
        <CompactActionList
          items={feeling.actionItems}
          label={feeling.actionsLabel}
        />
      ) : null}

      {feeling.visualAnchor ? (
        <VisualAnchorCard
          anchor={feeling.visualAnchor}
          yellow={accents.secondary}
        />
      ) : null}

      {feeling.visualFocus ? (
        <VisualFocusCard focus={feeling.visualFocus} />
      ) : null}

      {feeling.visualCloud ? (
        <VisualCloudCard cloud={feeling.visualCloud} />
      ) : null}

      {feeling.visualEthereal ? (
        <VisualEtherealCard
          ethereal={feeling.visualEthereal}
          variantBg={variantConfig.default[scheme].bgHex}
        />
      ) : null}

      {feeling.mindfulCard ? <MindfulCard card={feeling.mindfulCard} /> : null}
    </Screen>
  );
}

function Hero({
  feeling,
  accents,
}: {
  feeling: FeelingContent;
  accents: Record<AccentToken, string>;
}) {
  const subtitleColor = accents[feeling.subtitleColor];
  const showCategory = feeling.showCategoryLabel !== false;
  return (
    <View className="mt-2 gap-3">
      {showCategory ? (
        <View className="flex-row items-center gap-2">
          <View
            className="h-[1px] w-10 opacity-40"
            style={{ backgroundColor: subtitleColor }}
          />
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="tracking-[0.3em]"
            style={{ color: subtitleColor, paddingRight: 3.3 }}
          >
            Emotional Regulation
          </Text>
        </View>
      ) : null}
      <Text weight="black" className="text-[44px] leading-[1.05]">
        {feeling.detailTitle}
      </Text>
      <Text size="h3" weight="medium" style={{ color: subtitleColor }}>
        {feeling.detailSubtitle}
      </Text>
    </View>
  );
}

function InsightCard({
  feeling,
  accents,
}: {
  feeling: FeelingContent;
  accents: Record<AccentToken, string>;
}) {
  const accent = accents[feeling.accentToken];
  const style = feeling.emphasisStyle ?? 'split-muted';
  return (
    <Card variant="raised" size="lg">
      {feeling.insightLabel ? (
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          weight="bold"
          className="mb-4 tracking-[0.25em]"
          style={{ paddingRight: 2.75 }}
        >
          {feeling.insightLabel}
        </Text>
      ) : null}

      {style === 'continuous-bold' ? (
        <Text size="h2" className="leading-[1.3]">
          {feeling.descriptionLead}
          {feeling.descriptionEmphasis}
        </Text>
      ) : style === 'plain' ? (
        <Text size="lg" className="leading-relaxed text-foreground/70">
          {feeling.descriptionLead}
          {feeling.descriptionEmphasis}
        </Text>
      ) : (
        <>
          <Text size="lg" className="leading-7 text-foreground/70">
            {feeling.descriptionLead}
            <Text size="lg" weight="semibold">
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
    </Card>
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
    <View>
      {label ? (
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          weight="bold"
          className="mb-3 ml-1 tracking-[0.25em]"
          style={{ paddingRight: 2.75 }}
        >
          {label}
        </Text>
      ) : null}
      <View className="gap-3">
        {items.map((item) => (
          <Card
            key={item.label}
            variant="raised"
            size="lg"
            className="flex-row items-center gap-4 p-5"
          >
            <IconChip size="lg" shape="circle">
              <MaterialIcons
                name={item.icon as keyof typeof MaterialIcons.glyphMap}
                size={22}
                color={colors.primary.pink}
              />
            </IconChip>
            <Text size="lg" weight="medium" className="flex-1">
              {item.label}
              {item.labelItalic ? (
                <Text style={{ color: colors.primary.pink }}>
                  {' '}
                  {item.labelItalic}
                </Text>
              ) : null}
            </Text>
          </Card>
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
      <IconChip size="md" shape="circle">
        <MaterialIcons
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={20}
          color={accent}
        />
      </IconChip>
      <Text size="lg" weight="medium" className="flex-1">
        {item.label}
      </Text>
    </View>
  );
}

function BigQuoteCard({ feeling }: { feeling: FeelingContent }) {
  return (
    <View className="overflow-hidden rounded-3xl border border-foreground/5 bg-foreground/[0.04] p-8">
      <LinearGradient
        colors={[withAlpha(colors.accent.yellow, 0.08), 'transparent']}
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
      <Text size="h2" className="leading-[1.3]">
        {feeling.descriptionLead}
        {'\n'}
        <Text
          size="h2"
          weight="normal"
          className="leading-[1.3] text-foreground/60"
        >
          {feeling.descriptionEmphasis}
        </Text>
      </Text>
    </View>
  );
}

function BentoGrid({
  items,
  accents,
}: {
  items: FeelingActionItem[];
  accents: Record<AccentToken, string>;
}) {
  return (
    <View className="gap-3">
      {items.map((item) => (
        <BentoCard key={item.label} item={item} accents={accents} />
      ))}
    </View>
  );
}

function VisualEtherealCard({
  ethereal,
  variantBg,
}: {
  ethereal: VisualEthereal;
  variantBg: string;
}) {
  return (
    <View
      className="w-full overflow-hidden rounded-3xl border border-foreground/5 bg-foreground/[0.03]"
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
      <ImageScrim strength={0.8} start={0.3} />
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
          <View
            className="h-full w-full items-center justify-center rounded-full"
            style={{ backgroundColor: variantBg }}
          >
            <MaterialIcons
              name={ethereal.icon as keyof typeof MaterialIcons.glyphMap}
              size={36}
              color={colors.primary.pink}
            />
          </View>
        </LinearGradient>
        <Text
          size="lg"
          align="center"
          className="mt-8 leading-7 text-foreground/90"
        >
          &ldquo;{ethereal.quote}&rdquo;
        </Text>
      </View>
    </View>
  );
}

function VisualCloudCard({ cloud }: { cloud: VisualCloud }) {
  return (
    <View
      className="w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: 3 / 2 }}
    >
      <Image
        source={cloud.image}
        style={{ width: '100%', height: '100%', opacity: 0.75 }}
        resizeMode="cover"
      />
      <ImageScrim strength={0.9} start={0.5} />
    </View>
  );
}

function BentoCard({
  item,
  accents,
}: {
  item: FeelingActionItem;
  accents: Record<AccentToken, string>;
}) {
  const accent = accents[item.accent ?? 'primary'];
  if (item.fullWidth) {
    return (
      <Card
        variant="raised"
        size="lg"
        className="overflow-hidden border-l-4"
        style={{ borderLeftColor: withAlpha(accent, 0.4) }}
      >
        <View className="flex-row items-center gap-4">
          <MaterialIcons
            name={item.icon as keyof typeof MaterialIcons.glyphMap}
            size={32}
            color={accent}
          />
          <View className="flex-1">
            <Text size="h3" weight="bold">
              {item.title ?? item.label}
            </Text>
            {item.description ? (
              <Text size="sm" tone="secondary" className="mt-1">
                {item.description}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>
    );
  }
  return (
    <Card variant="raised" size="lg">
      <MaterialIcons
        name={item.icon as keyof typeof MaterialIcons.glyphMap}
        size={26}
        color={accent}
      />
      <Text size="h3" weight="bold" className="mt-4 leading-tight">
        {item.title ?? item.label}
      </Text>
      {item.description ? (
        <Text size="sm" tone="secondary" className="mt-2">
          {item.description}
        </Text>
      ) : null}
    </Card>
  );
}

function VisualAnchorCard({
  anchor,
  yellow,
}: {
  anchor: VisualAnchor;
  yellow: string;
}) {
  return (
    <View
      className="w-full overflow-hidden rounded-3xl shadow-2xl"
      style={{ aspectRatio: 21 / 9 }}
    >
      <Image
        source={anchor.image}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      <ImageScrim strength={0.7} start={0} />
      <View className="absolute bottom-5 left-6">
        <Text
          size="xs"
          treatment="caption"
          weight="black"
          className="tracking-[0.25em]"
          style={{ color: yellow, paddingRight: 2.5 }}
        >
          {anchor.label}
        </Text>
        <Text size="lg" tone="inverse" weight="medium" className="mt-1">
          {anchor.title}
        </Text>
      </View>
    </View>
  );
}

function VisualFocusCard({ focus }: { focus: VisualFocus }) {
  return (
    <Card variant="raised" size="lg" className="overflow-hidden p-4">
      <View className="aspect-square w-full overflow-hidden rounded-2xl bg-black/50">
        <Image
          source={focus.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <Text
        size="sm"
        align="center"
        tone="secondary"
        className="mt-4 leading-6"
      >
        {focus.caption}
      </Text>
    </Card>
  );
}

function MindfulCard({ card }: { card: MindfulCardContent }) {
  return (
    <Card variant="raised" size="lg">
      <View className="aspect-square w-full overflow-hidden rounded-2xl bg-black/40">
        <Image
          source={card.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
      <Text
        size="sm"
        align="center"
        className="mt-4 leading-6 text-foreground/65"
      >
        &ldquo;{card.quote}&rdquo;
      </Text>
    </Card>
  );
}
