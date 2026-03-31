import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterQuote } from '../../components/ChapterQuote';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

export default function Chapter6() {
  return (
    <>
      <ChapterHeading label="Chapter 6" title="Your Inner CEO" />
      <ChapterParagraph>
        Imagine your brain as a large corporation. The amygdala, which we
        discussed in Chapter 4, is the overly enthusiastic alarm system. But who
        is actually in charge? Meet your Inner CEO: the Prefrontal Cortex.
      </ChapterParagraph>
      <ChapterParagraph>
        Located right behind your forehead, the prefrontal cortex is responsible
        for executive functions. These include decision-making, logical
        reasoning, and, most importantly for us, emotional regulation.
      </ChapterParagraph>
      <ChapterQuote>
        When turbulence hits, the alarm system screams 'Danger!'. The Inner
        CEO's job is to look at the data and say, 'Actually, this is just rough
        air. We are safe.'
      </ChapterQuote>
      <ChapterParagraph>
        The problem during flight anxiety is that the alarm system is so loud,
        the CEO gets locked out of the boardroom. The grounding techniques
        you've learned are the key to letting the CEO back in to take control.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
