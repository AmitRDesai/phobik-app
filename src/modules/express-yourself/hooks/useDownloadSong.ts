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
 * Downloads the song's audio to the on-device cache, then opens the
 * platform share sheet so the user can pick a destination (Files / Photos /
 * Messages / etc.). The file lands in `<cache>/songs/<title>.mp3`.
 */
export function useDownloadSong() {
  return useMutation({
    mutationFn: async (input: { id: string; title: string | null }) => {
      // Fresh presigned URL — the one the player is currently using may be
      // close to its 1-hour expiry by the time the user taps Download.
      const { url } = await rpcClient.song.getPlaybackUrl({ id: input.id });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
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
        dialogTitle: 'Save your song',
        UTI: 'public.mp3',
      });

      return { uri: file.uri };
    },
  });
}
