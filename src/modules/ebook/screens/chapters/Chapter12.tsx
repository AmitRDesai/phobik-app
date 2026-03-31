import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterQuote } from '../../components/ChapterQuote';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

export default function Chapter12() {
  return (
    <>
      <ChapterHeading label="Chapter 12" title="Frozen Executive Function" />
      <ChapterParagraph>
        During high-stress situations like turbulence, the brain's executive
        function can become overwhelmed, leading to a 'freeze' response where
        decision-making stalls.
      </ChapterParagraph>
      <ChapterParagraph>
        The prefrontal cortex, responsible for logical thought and executive
        function, requires significant energy to operate. When anxiety strikes,
        the amygdala signals a perceived threat, diverting resources away from
        the prefrontal cortex.
      </ChapterParagraph>

      <ChapterQuote>
        The 'freeze' response is not a sign of weakness; it's a temporary system
        overload.
      </ChapterQuote>

      <ChapterCallout icon="rule" title="The Perfectionist">
        Seeks absolute certainty before acting. Under stress, the lack of
        complete information leads to decision paralysis. They may obsessively
        check flight paths.
      </ChapterCallout>

      <ChapterCallout icon="group" title="The Harmonizer">
        Focuses on not inconveniencing others. The freeze response manifests as
        internal panic while outwardly trying to appear calm, preventing them
        from asking for help.
      </ChapterCallout>

      <ChapterParagraph>
        Recognizing your default style is the first step in unfreezing your
        executive function. Below are tools to help you recalibrate in the
        moment.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
