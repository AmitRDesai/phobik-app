import { useEffect, useState } from 'react';
import { CharacterScreenShell } from '../components/CharacterScreenShell';
import { EddyCharacter } from '../components/EddyCharacter';

const CELEBRATE_MS = 3300;

export default function EddyScreen() {
  const [celebrating, setCelebrating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCelebrating(false), CELEBRATE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <CharacterScreenShell title="Eddy Endorphin">
      <EddyCharacter celebrating={celebrating} />
    </CharacterScreenShell>
  );
}
