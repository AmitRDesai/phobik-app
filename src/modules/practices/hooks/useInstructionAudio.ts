import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

interface UseInstructionAudioOptions {
  audioSource: number;
  skipInstruction: boolean;
  isPaused: boolean;
}

export function useInstructionAudio({
  audioSource,
  skipInstruction,
  isPaused,
}: UseInstructionAudioOptions) {
  const [instructionDone, setInstructionDone] = useState(skipInstruction);
  const [sessionReady, setSessionReady] = useState(skipInstruction);
  const [countdown, setCountdown] = useState<number | undefined>(undefined);

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  // Start instruction audio on mount (skip if resuming)
  useEffect(() => {
    if (!instructionDone) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

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
    } else if (!instructionDone) {
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
  };
}
