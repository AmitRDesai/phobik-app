import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';

function ToolCard({
  icon,
  title,
  description,
  helpText,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  helpText?: string;
}) {
  return (
    <Card className="p-5">
      <View className="mb-3 flex-row items-center gap-3">
        <IconChip
          size="lg"
          shape="rounded"
          tone="pink"
          border={withAlpha(colors.primary.pink, 0.2)}
        >
          <MaterialIcons name={icon} size={24} color={colors.primary.pink} />
        </IconChip>
        <Text variant="lg" className="font-black uppercase">
          {title}
        </Text>
      </View>
      <Text variant="sm" className="leading-5 text-foreground/60">
        {description}
      </Text>
      {helpText && (
        <View
          className="mt-3 rounded-xl p-3"
          style={{
            backgroundColor: withAlpha(colors.accent.yellow, 0.05),
            borderWidth: 1,
            borderColor: withAlpha(colors.accent.yellow, 0.15),
          }}
        >
          <Text variant="sm" className="leading-5 text-accent-yellow">
            {helpText}
          </Text>
        </View>
      )}
    </Card>
  );
}

export default function TurbulenceTools() {
  const router = useRouter();

  return (
    <Screen variant="default" scroll header={<Header />} className="px-6">
      <Text variant="display" className="mb-2 uppercase">
        Turbulence Tools
      </Text>

      {/* Gradient accent line */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 3, width: 64, borderRadius: 2, marginBottom: 16 }}
      />

      {/* Tool cards */}
      <View className="gap-4">
        <ToolCard
          icon="local-cafe"
          title="Cup of Water"
          description="Place a half-full cup or transparent bottle on the tray table. Notice how little the liquid moves."
          helpText="Why it helps: Shows the plane is moving fractions of an inch, even when it feels dramatic."
        />

        <ToolCard
          icon="edit-note"
          title="Sticky Note Check"
          description={
            "Write 'If I can read this, I'm okay.' and place it on the seat in front of you."
          }
        />

        <ToolCard
          icon="waves"
          title="Gelatin Visualization"
          description={
            'Picture the plane suspended in thick gelatin. It can jiggle — but it cannot fall.'
          }
        />
      </View>

      {/* Animated Reality section */}
      <View className="mt-6">
        <LinearGradient
          colors={[
            withAlpha(colors.primary.pink, 0.2),
            withAlpha(colors.accent.yellow, 0.05),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: withAlpha(colors.primary.pink, 0.2),
          }}
        >
          <Text variant="lg" className="mb-3 font-black uppercase">
            Animated Reality
          </Text>
          <Text variant="sm" className="leading-6 text-foreground/70">
            {
              "Next time fear pops up, immediately turn it into a ridiculous cartoon character. If you're on a plane and feel anxious, picture a tiny animated version of yourself sitting in the cockpit, pushing buttons randomly, with the plane flying just fine anyway! The more you practice, the easier it becomes to see fear as something lighthearted instead of overwhelming."
            }
          </Text>
        </LinearGradient>
      </View>

      <View className="mt-8">
        <GradientButton onPress={() => router.back()}>
          Continue Session
        </GradientButton>
      </View>
    </Screen>
  );
}
