import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

export default function Chapter11() {
  return (
    <>
      <ChapterHeading label="Chapter 11" title="Executive Function Overload" />
      <ChapterParagraph>
        When the amygdala sounds the alarm during a flight, the prefrontal
        cortex—your center for executive function—goes offline. This is why you
        can't logic your way out of a panic attack while it's happening. Your
        brain is prioritizing immediate survival over complex problem-solving.
      </ChapterParagraph>

      <ChapterNumberedList
        items={[
          {
            title: 'Assess',
            description:
              "What's happening? Is it true? Is it really true? Am I in danger?",
          },
          {
            title: 'Build a plan',
            description: "What's my next step?",
          },
          {
            title: 'Commit',
            description:
              'Focus on one simple, grounding action. Grip the armrests, count backwards from 100 by 7s.',
          },
        ]}
      />

      <ChapterParagraph>
        By following this simple sequence, you bypass the overloaded prefrontal
        cortex and send direct safety signals to your nervous system. Don't try
        to analyze why you are scared; just manage the physical symptoms first.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
