import { Header } from '@/components/ui/Header';
import { clsx } from 'clsx';
import { View } from 'react-native';

interface AffirmationHeaderProps {
  currentStep: number;
}

export function AffirmationHeader({ currentStep }: AffirmationHeaderProps) {
  return (
    <Header
      center={
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
      }
    />
  );
}
