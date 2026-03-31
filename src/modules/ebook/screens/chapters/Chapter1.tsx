import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';

export default function Chapter1() {
  return (
    <>
      <ChapterHeading label="Chapter 1" title="How Flying Works" />
      <ChapterParagraph>
        Understanding the mechanics of flight is one of the most powerful tools
        to ease flight anxiety. When you know why an airplane stays in the air,
        the sensations you feel become expected rather than frightening.
      </ChapterParagraph>

      <ChapterSectionTitle>The Principle of Lift</ChapterSectionTitle>
      <ChapterParagraph>
        Airplanes do not stay up by magic; they rest on a solid bed of air. As
        the engines push the plane forward, air rushes over the wings. Because
        of the wing's special shape—curved on top and flatter on the bottom—the
        air moves faster over the top than underneath.
      </ChapterParagraph>
      <ChapterParagraph>
        This difference in speed creates lower pressure above the wing and
        higher pressure below. The higher pressure pushes up, generating what we
        call lift. Once the plane reaches cruising speed, the air is as firm as
        a mattress supporting the aircraft.
      </ChapterParagraph>

      <ChapterSectionTitle>Built-in Redundancy</ChapterSectionTitle>
      <ChapterParagraph>
        A common fear is: "What if something breaks?" Aviation engineering is
        built around a concept called redundancy. This means that for every
        critical system on an airplane, there is at least one backup, and often
        several.
      </ChapterParagraph>
      <ChapterParagraph>
        If an engine were to fail, a commercial jet is fully capable of flying
        and landing safely on the remaining engine(s). The electrical systems,
        hydraulics, and navigation computers all have multiple independent
        backups. The airplane is designed to handle almost any situation with
        safety as the absolute priority.
      </ChapterParagraph>
    </>
  );
}
