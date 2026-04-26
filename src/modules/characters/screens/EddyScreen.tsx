import { CharacterScreenShell } from '../components/CharacterScreenShell';
import { EddyCharacter } from '../components/EddyCharacter';

export default function EddyScreen() {
  return (
    <CharacterScreenShell title="Eddy Endorphin">
      <EddyCharacter />
    </CharacterScreenShell>
  );
}
