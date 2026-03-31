import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';
import ch18Hero from '@/assets/images/ebook/chapter-18-hero.jpg';

export default function Chapter21() {
  return (
    <>
      <ChapterHeading label="Chapter 21" title="The C.A.L.M. Method" />

      <ChapterHeroImage source={ch18Hero} />

      <ChapterParagraph>
        Mastering flight anxiety requires a structured approach. The C.A.L.M.
        method is designed to help you regain control, understand your physical
        responses, and reframe your thoughts during turbulence or moments of
        panic.
      </ChapterParagraph>

      <ChapterNumberedList
        items={[
          {
            title: 'Confidence',
            description:
              'Trust in the engineering of the aircraft and the training of the pilots. Remind yourself that planes are built to handle forces far beyond what you will experience today.',
          },
          {
            title: 'Attachment',
            description:
              'Ground yourself to the present moment. Feel your feet flat on the floor and the weight of your body in the seat. You are securely held in place.',
          },
          {
            title: 'Lift',
            description:
              'Understand the physics of flight. The air is acting like a solid substance beneath the wings, providing constant support similar to driving on a slightly bumpy road.',
          },
          {
            title: 'Motion',
            description:
              'Accept the movements of the plane instead of fighting them. Move with the turbulence like a leaf floating on a stream, relaxing your muscles as the plane shifts.',
          },
        ]}
      />
    </>
  );
}
