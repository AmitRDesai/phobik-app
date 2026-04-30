import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { useAudioSource } from '@/lib/audio/useAudioSource';

interface UseInstructionAudioOptions {
  /** Key from the audio manifest (e.g. "breathing-478-instructions"). */
  audioKey: string | null;
  skipInstruction: boolean;
  isPaused: boolean;
}

export function useInstructionAudio({
  audioKey,
  skipInstruction,
  isPaused,
}: UseInstructionAudioOptions) {
  const [instructionDone, setInstructionDone] = useState(skipInstruction);
  const [sessionReady, setSessionReady] = useState(skipInstruction);
  const [countdown, setCountdown] = useState<number | undefined>(undefined);

  const {
    source,
    isDownloading: audioIsDownloading,
    progress: audioProgress,
    error: audioError,
  } = useAudioSource(audioKey);

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  // Swap the player's source once the file is downloaded/cached.
  const lastSourceRef = useRef<string | null>(null);
  useEffect(() => {
    if (source && source !== lastSourceRef.current) {
      player.replace(source);
      lastSourceRef.current = source;
    }
  }, [source, player]);

  // Start playback once when source is ready (and not skipping).
  const playStartedRef = useRef(false);
  useEffect(() => {
    if (instructionDone || playStartedRef.current) return;
    if (!source) return;
    playStartedRef.current = true;
    player.play();
  }, [player, source, instructionDone]);

  // Detect when instruction audio finishes naturally
  useEffect(() => {
    if (
      !instructionDone &&
      status.duration > 0 &&
      status.currentTime >= status.duration &&
      !status.playing
    ) {
      setInstructionDone(true);
    }
  }, [instructionDone, status.playing, status.currentTime, status.duration]);

  // 3-second countdown after instruction before starting the exercise
  useEffect(() => {
    if (!instructionDone || sessionReady) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === undefined || prev <= 1) {
          clearInterval(interval);
          setSessionReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [instructionDone, sessionReady]);

  // Sync instruction audio with pause state
  useEffect(() => {
    if (isPaused) {
      player.pause();
    } else if (!instructionDone && playStartedRef.current) {
      player.play();
    }
  }, [isPaused, player, instructionDone]);

  /** Skip instruction and jump straight to session-ready (used by restart) */
  const skipToReady = () => {
    player.pause();
    setInstructionDone(true);
    setSessionReady(true);
    setCountdown(undefined);
  };

  /** Skip instruction but still run the countdown before starting */
  const skipToCountdown = () => {
    player.pause();
    setInstructionDone(true);
  };

  return {
    sessionReady,
    countdown,
    instructionDone,
    instructionPlayer: player,
    skipToReady,
    skipToCountdown,
    audioIsDownloading,
    audioProgress,
    audioError,
  };
}
