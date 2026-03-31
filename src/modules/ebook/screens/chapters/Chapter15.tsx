import ch15Hero from '@/assets/images/ebook/chapter-15-hero.jpg';
import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';

export default function Chapter15() {
  return (
    <>
      <ChapterHeading
        label="Chapter 15"
        title="Building Tolerance Without Avoidance"
      />
      <ChapterParagraph>
        Avoidance is the most common response to fear. When we feel anxious
        about flying, our instinct is to avoid the situation entirely or rely on
        safety behaviors to get through it. However, avoidance prevents us from
        learning that the situation is actually safe.
      </ChapterParagraph>

      <ChapterCallout
        icon="psychology"
        title="Tolerance Matters More Than Comfort"
      >
        The goal is not to immediately feel comfortable, but to build tolerance
        to the discomfort. Each time you face the fear without avoiding it, your
        tolerance grows.
      </ChapterCallout>

      <ChapterParagraph>
        Think of tolerance as a muscle. The more you exercise it by staying in
        uncomfortable situations without escaping, the stronger it gets.
        Eventually, what once felt intolerable becomes just another manageable
        experience.
      </ChapterParagraph>

      <ChapterHeroImage source={ch15Hero} />
    </>
  );
}
