import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterQuote } from '../../components/ChapterQuote';

export default function Chapter9() {
  return (
    <>
      <ChapterHeading label="Chapter 9" title="Stories During Turbulence" />
      <ChapterParagraph>
        One of the most common sensations during turbulence is the sudden
        feeling of dropping. Your stomach does a flip, and your mind immediately
        assumes the worst.
      </ChapterParagraph>

      <ChapterCallout icon="science" title="The Gelatin Analogy">
        At cruising altitude, airplanes fly at around 500 mph. At this
        incredible speed, the air around the plane behaves like a thick, solid
        medium rather than a thin gas.
      </ChapterCallout>

      <ChapterQuote>
        Imagine a toy airplane suspended in a bowl of firm gelatin. If you tap
        the bowl, the plane jiggles and bounces around, but it never falls to
        the bottom. The airplane is fully supported by the dense gelatin around
        it.
      </ChapterQuote>

      <ChapterParagraph>
        When you feel that terrifying "drop," the plane is actually only
        descending a few feet or inches within this thick mass of air. Because
        of the speed and density, it is physically impossible for the plane to
        simply fall out of the sky.
      </ChapterParagraph>
      <ChapterParagraph>
        The rough patches are just ripples in the gelatin. Uncomfortable, yes,
        but entirely safe.
      </ChapterParagraph>
    </>
  );
}
