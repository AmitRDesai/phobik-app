import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';

export default function Chapter17() {
  return (
    <>
      <ChapterHeading label="Chapter 17" title="Anticipatory Anxiety" />
      <ChapterParagraph>
        The days or even weeks leading up to a flight can often be more
        distressing than the flight itself. This unstructured worry is what we
        call anticipatory anxiety.
      </ChapterParagraph>

      <ChapterParagraph>
        Your mind naturally attempts to prepare for every possible negative
        outcome, spinning complex scenarios that rarely come to pass. To break
        this exhausting cycle, we use a cognitive technique called the
        'Container' strategy.
      </ChapterParagraph>

      <ChapterSectionTitle>The 'Container' Exercise</ChapterSectionTitle>

      <ChapterNumberedList
        items={[
          {
            title: 'Visualize a secure container:',
            description:
              'It could be a heavy steel safe, a wooden chest, or a futuristic vault. Ensure it has a strong lock and a secure lid.',
          },
          {
            title: 'Gather your worries:',
            description:
              "Whenever a flight-related intrusive thought or 'what-if' scenario appears throughout your day, acknowledge it without judgment.",
          },
          {
            title: 'Place it inside:',
            description:
              'Imagine physically putting that specific thought into your mental container and firmly locking it away.',
          },
          {
            title: 'Designate worry time:',
            description:
              'Allow yourself a strict 15-minute window each day (e.g., at 4:00 PM) to open the container and review the thoughts. Keep the container locked at all other times.',
          },
        ]}
      />

      <ChapterParagraph>
        By setting boundaries and limiting the time you spend actively engaging
        with these thoughts, you prevent anticipatory anxiety from dominating
        your daily routine and preserve your mental energy for the actual
        journey.
      </ChapterParagraph>
    </>
  );
}
