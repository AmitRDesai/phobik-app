import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import type { CustomDialogProps } from '@/store/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import { useJoinCommunity } from '../hooks/useCommunity';

const PRINCIPLES = [
  {
    icon: 'campaign' as const,
    title: 'Speak your truth',
    description: "Be real about what you're experiencing.",
  },
  {
    icon: 'forum' as const,
    title: "Name what's real",
    description: 'Putting feelings into words creates clarity.',
  },
  {
    icon: 'favorite' as const,
    title: "Notice what's here",
    description: 'Fear and struggle are part of being human.',
  },
  {
    icon: 'volunteer-activism' as const,
    title: 'Listen with compassion',
    description: 'Support others without judgment or fixing.',
  },
  {
    icon: 'auto-awesome' as const,
    title: 'Celebrate courage',
    description: 'Small brave steps matter.',
  },
  {
    icon: 'groups' as const,
    title: 'Move forward together',
    description: 'No one struggles alone here.',
  },
];

export function CommunityPrinciples({ close }: CustomDialogProps) {
  const joinMutation = useJoinCommunity();

  const handleJoin = async () => {
    await joinMutation.mutateAsync(undefined as any);
    close(true);
  };

  return (
    <View>
      {/* Header */}
      <View className="items-center pb-2">
        <Text className="text-[10px] font-bold uppercase tracking-[3px] text-primary-pink">
          PHOBIK COMMUNITY
        </Text>
        <Text className="mt-1 text-center text-2xl font-bold leading-tight text-foreground">
          Phobik Community Principles
        </Text>
        <Text className="mt-2 text-center text-[13px] leading-relaxed text-primary-muted">
          Kindness matters. Courage grows in Community.
        </Text>
      </View>

      {/* Principles List */}
      <ScrollView className="my-4" showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          {PRINCIPLES.map((principle) => (
            <View
              key={principle.title}
              className="flex-row items-start gap-4 rounded-2xl border border-foreground/5 bg-foreground/[0.03] px-4 py-3"
            >
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0px 2px 8px ${withAlpha(colors.primary.pink, 0.3)}`,
                }}
              >
                <MaterialIcons name={principle.icon} size={18} color="white" />
              </LinearGradient>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">
                  {principle.title}
                </Text>
                <Text className="mt-0.5 text-xs leading-tight text-foreground/60">
                  {principle.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Join Button */}
      <GradientButton
        onPress={handleJoin}
        loading={joinMutation.isPending}
        icon={<MaterialIcons name="arrow-forward" size={20} color="white" />}
      >
        I Understand & Join
      </GradientButton>

      {/* Footer */}
      <Text className="mt-4 text-center text-[9px] font-medium uppercase tracking-[2px] text-primary-muted/50">
        Safe-sharing protocol active
      </Text>
    </View>
  );
}
