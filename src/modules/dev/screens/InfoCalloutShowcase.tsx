import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import {
  InfoCallout,
  type InfoCalloutVariant,
} from '@/components/ui/InfoCallout';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const VARIANT_NOTES: Record<InfoCalloutVariant, string> = {
  tinted:
    'Tinted bg + border at low alpha matching `tone`. Default — for accent-coded info.',
  plain:
    'Neutral foreground/5 bg + foreground/10 border. Use when the surrounding screen already has a strong accent.',
};

const TONES: AccentHue[] = ['cyan', 'pink', 'yellow', 'purple', 'orange'];

export default function InfoCalloutShowcase() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="InfoCallout" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Inline informational callout — tips, hints, soft warnings, promotional
          moments. Stays visible while the user reads the surrounding content.
        </Text>
        <Text size="sm" tone="tertiary">
          Choose vs. neighbors: `Toast` for transient confirmations, `Dialog`
          for choices needing an OK tap, `NetworkBanner` for always-on offline
          status, `EmptyState` for no-data screens. InfoCallout is the
          persistent inline one.
        </Text>
      </Section>

      <Section title="Variants">
        <PropRow label='variant="tinted" (default)' note={VARIANT_NOTES.tinted}>
          <InfoCallout
            tone="cyan"
            icon={(color) => (
              <MaterialIcons name="lightbulb" size={20} color={color} />
            )}
            title="Smart Tip"
            description="Try a 4-7-8 breath when you feel tension building — it engages the parasympathetic system in under a minute."
          />
        </PropRow>

        <PropRow label='variant="plain"' note={VARIANT_NOTES.plain}>
          <InfoCallout
            variant="plain"
            icon={(color) => (
              <MaterialIcons name="info-outline" size={20} color={color} />
            )}
            title="Note"
            description="Plain callout sits quietly next to colorful content without competing for attention."
          />
        </PropRow>
      </Section>

      <Section title="Tones">
        <Text size="sm" tone="tertiary">
          Tones tint the icon chip + (in `tinted` variant) the bg + border. Pick
          a tone that matches the message&apos;s emotional register — cyan for
          tips, yellow for soft warnings, pink for energy / motivation, etc.
        </Text>
        {TONES.map((tone) => (
          <PropRow key={tone} label={`tone="${tone}"`}>
            <InfoCallout
              tone={tone}
              icon={(color) => (
                <MaterialIcons name="auto-awesome" size={20} color={color} />
              )}
              title={`${tone.charAt(0).toUpperCase() + tone.slice(1)} accent`}
              description={`Tone="${tone}" tints the chip + container border.`}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Sizes">
        <PropRow
          label='size="md" (default)'
          note="Standard. IconChip lg, h3-ish title, comfortable padding."
        >
          <InfoCallout
            tone="pink"
            icon={(color) => (
              <MaterialIcons name="favorite" size={20} color={color} />
            )}
            title="14-day streak"
            description="You've checked in every day for two weeks. That's compounding."
          />
        </PropRow>

        <PropRow
          label='size="sm"'
          note="Compact. IconChip md, smaller title, tighter padding. Use inside cards or dense list rows."
        >
          <InfoCallout
            size="sm"
            tone="cyan"
            icon={(color) => (
              <MaterialIcons name="info-outline" size={18} color={color} />
            )}
            title="Pro tip"
            description="Drag the slider, or tap anywhere on the track to jump."
          />
        </PropRow>
      </Section>

      <Section title="Content variants">
        <PropRow
          label="Title only"
          note="Minimum surface — no description, no icon, no action."
        >
          <InfoCallout title="Single-line callout" />
        </PropRow>

        <PropRow
          label="With icon + description (no action)"
          note="The most common shape — eye-catching hint."
        >
          <InfoCallout
            tone="yellow"
            icon={(color) => (
              <MaterialIcons name="bolt" size={20} color={color} />
            )}
            title="Energy boost incoming"
            description="A 5-minute movement break increases focus for the next 90 minutes."
          />
        </PropRow>

        <PropRow
          label="With CTA button"
          note="Pass `action` for callouts that invite a next step (try a practice, upgrade, learn more)."
        >
          <InfoCallout
            tone="purple"
            icon={(color) => (
              <MaterialIcons name="auto-awesome" size={20} color={color} />
            )}
            title="New: AI Coach"
            description="Get personalized guidance through your reflections in real time."
            action={
              <Button size="sm" variant="secondary">
                Try it
              </Button>
            }
          />
        </PropRow>

        <PropRow
          label="Dismissible (X button)"
          note="Pass `onDismiss` for one-time tips the user should be able to clear. The component doesn't persist dismissal — caller stores it (Jotai atom, AsyncStorage, etc.)."
        >
          {dismissed ? (
            <View className="items-center gap-2 py-3">
              <Text size="sm" tone="tertiary">
                Callout dismissed.
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onPress={() => setDismissed(false)}
              >
                Restore
              </Button>
            </View>
          ) : (
            <InfoCallout
              tone="orange"
              icon={(color) => (
                <MaterialIcons
                  name="tips-and-updates"
                  size={20}
                  color={color}
                />
              )}
              title="Pull down to refresh"
              description="On most lists you can pull down from the top to fetch new entries."
              onDismiss={() => setDismissed(true)}
            />
          )}
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Insights tip (cyan, with action)"
          note="Promote a related practice from inside an insight screen."
        >
          <InfoCallout
            tone="cyan"
            icon={(color) => (
              <MaterialIcons name="lightbulb" size={20} color={color} />
            )}
            title="You're low on Dopamine today"
            description="Try a 5-minute movement break or a small task you can finish — both release dopamine."
            action={
              <Button size="sm" variant="secondary">
                Start practice
              </Button>
            }
          />
        </PropRow>

        <PropRow
          label="Soft warning (yellow, dismissible)"
          note="Non-blocking warning that the user can clear."
        >
          <InfoCallout
            tone="yellow"
            icon={(color) => (
              <MaterialIcons name="schedule" size={20} color={color} />
            )}
            title="Subscription expires in 3 days"
            description="Your premium features will pause on April 15."
            action={
              <Button size="sm" variant="secondary">
                Manage
              </Button>
            }
            onDismiss={() => toast.info('Dismissed for now')}
          />
        </PropRow>

        <PropRow
          label="Onboarding hint (sm, inside a card)"
          note="Tight callout that fits inline below a related control."
        >
          <Card variant="raised" size="md" className="gap-3">
            <Text size="md" weight="bold">
              Daily reflection
            </Text>
            <Text size="sm" tone="secondary">
              A short journal entry takes 2 minutes.
            </Text>
            <InfoCallout
              size="sm"
              tone="pink"
              icon={(color) => (
                <MaterialIcons name="auto-awesome" size={18} color={color} />
              )}
              title="First time?"
              description="Start with a single feeling word — you can expand later."
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Stacking 3+ callouts on the same screen"
          good="Callouts compete for attention; multiple = noise. One persistent callout per surface; if more info is needed, link to Help or use an Accordion."
        />

        <DontRow
          bad="Using InfoCallout for actions that need acknowledgement"
          good="If the user must choose 'OK' to proceed, use Dialog. Callout is reading material that lives alongside the content."
        />

        <DontRow
          bad="Long-form essays as the description"
          good="Keep description to ~2 lines. For more detail, add an action button that opens a Help / Settings screen."
        />

        <DontRow
          bad="Tone mismatched to the message (yellow warning for a celebration)"
          good="Match the tone to the emotional register: cyan/info for tips, yellow for warnings, pink/yellow for celebrations, orange for energy hints."
        />

        <DontRow
          bad="Dismissible callout without persistence in the caller"
          good="`onDismiss` only hides for the session unless the caller stores the dismissed state. For one-time-only tips, persist a flag in Jotai / AsyncStorage."
        />
      </Section>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <Text size="xs" treatment="caption" tone="tertiary" className="px-2">
        {title}
      </Text>
      <Card variant="raised" size="lg" className="gap-5">
        {children}
      </Card>
    </View>
  );
}

function PropRow({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text size="xs" tone="tertiary" className="font-mono">
        {label}
      </Text>
      {note ? (
        <Text size="xs" tone="disabled">
          {note}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function DontRow({ bad, good }: { bad: string; good: string }) {
  return (
    <View className="gap-1 rounded-md border border-status-danger/30 bg-status-danger/[0.05] p-3">
      <Text size="xs" tone="danger" weight="bold">
        ✕ {bad}
      </Text>
      <Text size="xs" tone="success">
        ✓ {good}
      </Text>
    </View>
  );
}
