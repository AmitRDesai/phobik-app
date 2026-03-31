import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';

export default function Chapter16() {
  return (
    <>
      <ChapterHeading
        label="Chapter 16"
        title="Strengthening the Nervous System"
      />
      <ChapterParagraph>
        Building resilience is a journey of repetition and recovery. Your
        nervous system learns through safe exposure and adequate rest. When you
        intentionally practice calming techniques, you're not just managing
        anxiety in the moment—you're fundamentally rewiring your brain to
        respond to stress with greater equanimity.
      </ChapterParagraph>

      <ChapterCallout icon="psychology" title="The Neuroplasticity Factor">
        Every time you successfully navigate a stressful situation using your
        tools, you strengthen the neural pathways associated with calm and
        control.
      </ChapterCallout>

      <ChapterParagraph>
        Think of it like building a muscle. You wouldn't expect to lift a heavy
        weight without prior training. Similarly, facing the 'heavy weight' of
        flight anxiety requires the foundational strength built through
        consistent, daily practice of grounding and breathing exercises.
      </ChapterParagraph>

      <ChapterSectionTitle>Key Principles for Growth</ChapterSectionTitle>

      <ChapterNumberedList
        items={[
          {
            title: 'Consistent, small exposures.',
            description: '',
          },
          {
            title: 'Prioritizing deep rest and recovery.',
            description: '',
          },
          {
            title: 'Reframing anxiety as a signal, not a threat.',
            description: '',
          },
        ]}
      />
    </>
  );
}
