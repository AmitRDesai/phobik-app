import { CalendarSettings } from '@/modules/calendar/components/CalendarSettings';
import { router } from 'expo-router';
import { OnboardingQuestionShell } from '../components/OnboardingQuestionShell';

export default function CalendarSupport() {
  const navigateNext = () => router.push('/onboarding/privacy-trust');

  return (
    <OnboardingQuestionShell
      step={6}
      title="Sync Your Schedule"
      subtitle="PHOBIK notices upcoming events so you can prepare your nervous system before the stress hits."
      subtitleClassName="mt-3 text-base font-normal leading-relaxed text-foreground/55"
      buttonLabel="Continue"
      onButtonPress={navigateNext}
    >
      <CalendarSettings onSkip={navigateNext} />
    </OnboardingQuestionShell>
  );
}
