import { CharacterScreenShell } from '../components/CharacterScreenShell';
import { SunnyCharacter } from '../components/SunnyCharacter';

export default function SunnyScreen() {
  return (
    <CharacterScreenShell title="Sunny Serotonin">
      <SunnyCharacter />
    </CharacterScreenShell>
  );
}
