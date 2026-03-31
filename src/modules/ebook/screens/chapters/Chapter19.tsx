import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';

export default function Chapter19() {
  return (
    <>
      <ChapterHeading label="Chapter 19" title="Setbacks & Slips" />
      <ChapterParagraph>
        Healing is rarely a straight line. It's entirely normal to experience a
        setback after a period of calm, successful flights. A sudden bout of
        turbulence or an unexpected delay can trigger old anxieties, but this
        does not mean you are back at square one.
      </ChapterParagraph>

      <ChapterParagraph>
        Progress is non-linear. What matters most is how you respond in the
        aftermath. Don't let one difficult journey erase the profound progress
        you've made. Instead, utilize the reset protocol.
      </ChapterParagraph>

      <ChapterSectionTitle>Reset Protocol</ChapterSectionTitle>

      <ChapterNumberedList
        items={[
          {
            title: 'Acknowledge Without Judgment',
            description:
              'Accept that the flight was difficult without criticizing yourself for feeling anxious.',
          },
          {
            title: 'Re-calibrate Grounding',
            description:
              'Practice your 5-4-3-2-1 technique in a safe space to regain emotional equilibrium.',
          },
          {
            title: 'Set a Micro-Goal',
            description:
              'Define one small, achievable intention for your next flight to build back confidence.',
          },
        ]}
      />
    </>
  );
}
