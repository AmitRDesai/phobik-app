import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterQuote } from '../../components/ChapterQuote';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

export default function Chapter8() {
  return (
    <>
      <ChapterHeading
        label="Chapter 8"
        title="Getting Trapped in Your Own Fear"
      />
      <ChapterParagraph>
        Fear during a flight is often fueled by our imagination rather than
        actual danger. Our minds create worst-case scenarios, replacing reality
        with terrifying 'what-ifs'.
      </ChapterParagraph>
      <ChapterParagraph>
        When the seatbelt sign illuminates, it's easy for the mind to leap to
        conclusions. A perfectly normal operational procedure becomes a signal
        of impending doom in the anxious mind. This is the 'fear trap' – where
        physiological arousal is misinterpreted as proof of danger.
      </ChapterParagraph>

      <ChapterCallout icon="self-improvement" title="Grounding Exercise">
        Use the 5-4-3-2-1 technique: see 5 things, feel 4, hear 3, smell 2, and
        taste 1. This anchors you back to reality.
      </ChapterCallout>

      <ChapterParagraph>
        By actively engaging your senses, you interrupt the cycle of anxious
        thoughts. You are reminding your brain that right now, in this moment,
        you are safe in your seat.
      </ChapterParagraph>

      <ChapterQuote>
        Worry does not empty tomorrow of its sorrow, it empties today of its
        strength.
      </ChapterQuote>

      <ChapterAffirmation />
    </>
  );
}
