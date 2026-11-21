import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, options?: SpeechSynthesisUtterance) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    if (options) {
      utterance.volume = options.volume || 1;
      utterance.rate = options.rate || 1;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}