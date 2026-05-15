import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { type ScrollViewProps } from 'react-native';

type PracticeScreenShellProps = {
  /** Title rendered in the top Header. Required — pick a screen-specific title; no global fallback. */
  wordmark: string;
  hideHeader?: boolean;
  hideBack?: boolean;
  children: React.ReactNode;
  scrollContentClassName?: string;
  scrollProps?: ScrollViewProps;
};

export function PracticeScreenShell({
  wordmark,
  hideHeader,
  hideBack,
  children,
  scrollContentClassName = 'pb-8',
  scrollProps,
}: PracticeScreenShellProps) {
  return (
    <Screen
      scroll
      header={
        hideHeader ? null : (
          <Header
            variant="back"
            title={wordmark}
            left={hideBack ? <></> : undefined}
          />
        )
      }
      className="px-6"
      contentClassName={scrollContentClassName}
      scrollViewProps={scrollProps}
    >
      {children}
    </Screen>
  );
}
