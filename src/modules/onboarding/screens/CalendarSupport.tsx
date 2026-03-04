import { CalendarSettings } from '@/modules/calendar/components/CalendarSettings';
import { router } from 'expo-router';
import { OnboardingLayout } from '../components/OnboardingLayout';

export default function CalendarSupport() {
  const navigateNext = () => router.push('/onboarding/privacy-trust');

  return (
    <OnboardingLayout
      step={6}
      title="Sync Your Schedule"
      subtitle="PHOBIK notices upcoming events so you can prepare your nervous system before the stress hits."
      subtitleClassName="mt-3 text-base font-normal leading-relaxed text-primary-muted"
      onBack={() => router.back()}
      buttonLabel="Continue"
      onButtonPress={navigateNext}
    >
      <CalendarSettings onSkip={navigateNext} />
    </OnboardingLayout>
  );
}
