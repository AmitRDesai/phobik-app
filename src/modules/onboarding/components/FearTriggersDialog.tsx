import { GradientButton } from '@/components/ui/GradientButton';
import { SelectionCard } from '@/modules/account-creation/components/SelectionCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { Text, View } from 'react-native';
import {
  onboardingReminderPrefAtom,
  type ReminderPreference,
} from '../store/onboarding';

interface FearTriggersDialogProps {
  close: (result?: unknown) => void;
}

const OPTIONS: {
  value: ReminderPreference;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
}[] = [
  {
    value: 'yes-reminders',
    label: 'Yes, send me reminders',
    description: 'Proactive support for your triggers',
    icon: 'notifications-active',
    iconColor: '#f4258c',
  },
  {
    value: 'high-stress-only',
    label: 'Only for high-stress events',
    description: 'Manual trigger activation only',
    icon: 'calendar-month',
    iconColor: '#ff8e53',
  },
  {
    value: 'no-reminders',
    label: "No, I'll explore on my own",
    description: 'Silence all notifications for now',
    icon: 'explore',
    iconColor: 'rgba(255,255,255,0.4)',
  },
];

export function FearTriggersDialog({ close }: FearTriggersDialogProps) {
  const [selected, setSelected] = useAtom(onboardingReminderPrefAtom);

  return (
    <View className="px-2 pb-4">
      <Text className="mb-2 text-[22px] font-bold tracking-tight text-white">
        Would you like gentle support before these moments?
      </Text>
      <Text className="mb-6 text-sm leading-relaxed text-white/60">
        We can nudge you with breathwork or grounding tools based on your
        schedule.
      </Text>

      <View className="mb-6 gap-3">
        {OPTIONS.map((option) => (
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
