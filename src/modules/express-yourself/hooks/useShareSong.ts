import { rpcClient } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function sanitizeFileName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

/**
 * Opens the platform share sheet with the song's audio file attached.
 * Shares the cached copy if present, otherwise downloads to cache first.
 * The receiving app (Messages, Mail, etc.) gets a real audio attachment —
 * not just a link — so it can actually deliver to a loved one.
 */
export function useShareSong() {
  return useMutation({
    mutationFn: async (input: { id: string; title: string | null }) => {
      const { url } = await rpcClient.song.getPlaybackUrl({ id: input.id });
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Could not fetch audio: ${response.status}`);
      }
      const bytes = new Uint8Array(await response.arrayBuffer());

      const fileName = `${sanitizeFileName(input.title || 'Song')}.mp3`;
      const dir = new Directory(Paths.cache, 'songs');
      if (!dir.exists) dir.create();
      const file = new File(dir, fileName);
      if (file.exists) file.delete();
      file.create();
      file.write(bytes);

      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Sharing not available on this device');
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: 'audio/mpeg',
        dialogTitle: 'Share your song',
        UTI: 'public.mp3',
      });
      return { uri: file.uri };
    },
  });
}
