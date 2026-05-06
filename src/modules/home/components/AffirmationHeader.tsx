import { BackButton } from '@/components/ui/BackButton';
import { clsx } from 'clsx';
import { View } from 'react-native';

interface AffirmationHeaderProps {
  currentStep: number;
}

export function AffirmationHeader({ currentStep }: AffirmationHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pb-2 pt-2">
      <BackButton />

      <View className="flex-row gap-1.5">
        {[1, 2].map((step) => (
          <View
            key={step}
            className={clsx(
              'h-1 w-6 rounded-full',
              step === currentStep
                ? 'bg-primary-pink'
                : step < currentStep
                  ? 'bg-primary-pink/40'
                  : 'bg-foreground/10',
            )}
          />
        ))}
      </View>

      <View className="w-7" />
    </View>
  );
}
