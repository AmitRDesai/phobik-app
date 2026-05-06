import { GradientButton } from '@/components/ui/GradientButton';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import {
  onboardingReminderPrefAtom,
  type ReminderPreference,
} from '../store/onboarding';

interface FearTriggersDialogProps {
  close: (result?: unknown) => void;
}

type Option = {
  value: ReminderPreference;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
};

export function FearTriggersDialog({ close }: FearTriggersDialogProps) {
  const [selected, setSelected] = useAtom(onboardingReminderPrefAtom);
  const scheme = useScheme();
  const neutralIconColor = foregroundFor(scheme, { dark: 0.4, light: 0.45 });

  const options: Option[] = [
    {
      value: 'yes-reminders',
      label: 'Yes, send me reminders',
      description: 'Proactive support for your triggers',
      icon: 'notifications-active',
      iconColor: colors.gradient.magenta,
    },
    {
      value: 'high-stress-only',
      label: 'Only for high-stress events',
      description: 'Manual trigger activation only',
      icon: 'calendar-month',
      iconColor: colors.accent.orange,
    },
    {
      value: 'no-reminders',
      label: "No, I'll explore on my own",
      description: 'Silence all notifications for now',
      icon: 'explore',
      iconColor: neutralIconColor,
    },
  ];

  return (
    <View className="px-2 pb-4">
      <Text className="mb-2 text-[22px] font-bold tracking-tight text-foreground">
        Would you like gentle support before these moments?
      </Text>
      <Text className="mb-6 text-sm leading-relaxed text-foreground/60">
        We can nudge you with breathwork or grounding tools based on your
        schedule.
      </Text>

      <View className="mb-6 gap-3">
        {options.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={option.description}
            icon={
              <MaterialIcons
                name={option.icon}
                size={22}
                color={option.iconColor}
              />
            }
            selected={selected === option.value}
            onPress={() => setSelected(option.value)}
            variant="radio"
          />
        ))}
      </View>

      <GradientButton onPress={() => close()}>
        Finish Personalizing
      </GradientButton>
    </View>
  );
}
