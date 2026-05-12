import { Screen } from '@/components/ui/Screen';
import { type ScrollViewProps } from 'react-native';

import { PracticeStackHeader } from './PracticeStackHeader';

type PracticeScreenShellProps = {
  /** Brand wordmark or screen title shown in the top header */
  wordmark?: string;
  hideHeader?: boolean;
  hideBack?: boolean;
  children: React.ReactNode;
  scrollContentClassName?: string;
  scrollProps?: ScrollViewProps;
};

export function PracticeScreenShell({
  wordmark = 'FOUR PILLARS',
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
          <PracticeStackHeader wordmark={wordmark} hideBack={hideBack} />
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
