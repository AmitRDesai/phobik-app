import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';

export default function Chapter20() {
  return (
    <>
      <ChapterHeading label="Chapter 20" title="The Goal is Freedom" />
      <ChapterParagraph>
        Freedom from flight anxiety isn't necessarily about loving every single
        moment of a turbulent flight. True freedom is subtler, yet infinitely
        more powerful. It is the ability to choose.
      </ChapterParagraph>

      <ChapterParagraph>
        When you are free, you no longer build your life around avoiding
        airports. You can say "yes" to the destination wedding, the dream
        vacation, or the critical business trip. The fear no longer dictates
        your geography.
      </ChapterParagraph>

      <ChapterSectionTitle>The Pillars of Freedom</ChapterSectionTitle>

      <ChapterNumberedList
        items={[
          {
            title: 'Choice',
            description:
              'The ability to fly when you want or need to, without weeks of dread.',
          },
          {
            title: 'Flexibility',
            description:
              'Changing plans comfortably, even if it means a different route or aircraft.',
          },
          {
            title: 'Self-Trust',
            description:
              'Knowing you have the tools to handle discomfort if it arises in the air.',
          },
        ]}
      />

      <ChapterParagraph>
        Remember the techniques you've learned. The grounding exercises, the
        biological understanding of turbulence, and the cognitive reframing.
        These are your tools. Freedom is simply trusting that you can use them
        effectively.
      </ChapterParagraph>
    </>
  );
}
