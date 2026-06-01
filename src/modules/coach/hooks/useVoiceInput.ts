import { useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import * as Haptics from 'expo-haptics';

type UseVoiceInputOptions = {
  onResult: (text: string) => void;
};

function stopRecognition() {
  ExpoSpeechRecognitionModule.stop();
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function useVoiceInput({ onResult }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAvailable] = useState(() =>
    ExpoSpeechRecognitionModule.isRecognitionAvailable(),
  );

  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    setTranscript(text);

    if (event.isFinal && text.trim()) {
      onResult(text.trim());
      setTranscript('');
    }
  });

  useSpeechRecognitionEvent('error', () => {
    setIsListening(false);
    setTranscript('');
  });

  const start = async () => {
    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTranscript('');

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
    });
  };

  return {
    isListening,
    transcript,
    isAvailable,
    start,
    stop: stopRecognition,
  };
}
