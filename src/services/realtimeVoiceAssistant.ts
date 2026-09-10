// Desi Craft - Real-Time Voice Assistant Engine
// Native Web Speech Recognition, Web Audio API Realtime Visualizer, and Dynamic AI Extraction

import { LanguageCode } from '../types';
import { aiServices, VoiceParsedListing } from './aiServices';
import { universalVoiceEngine } from './voiceLanguageService';

// Mapping app language codes to Indian BCP-47 speech recognition codes
export const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
};

// Check if browser has native speech recognition
export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

export interface RealtimeListenerCallbacks {
  onInterim: (interimText: string, fullTranscript: string) => void;
  onFinal: (finalText: string, fullTranscript: string) => void;
  onError: (errorMessage: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onAudioLevel?: (level: number) => void; // 0 to 100 for live waveform
  onSilenceDetected?: () => void;
}

export class RealtimeVoiceSession {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isListening = false;
  private accumulatedText = '';
  private silenceTimer: any = null;
  private simulatedWaveInterval: any = null;

  constructor(private language: LanguageCode, private callbacks: RealtimeListenerCallbacks) {}

  public async start() {
    this.isListening = true;
    this.accumulatedText = '';

    // 1. Setup Native Web Speech Recognition FIRST without blocking on getUserMedia
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.callbacks.onError('Web Speech Recognition is not supported in this browser. You can use the quick test voice presets below.');
      this.isListening = false;
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = SPEECH_LANG_MAP[this.language] || 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (this.callbacks.onStart) this.callbacks.onStart();
        this.resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcriptChunk + ' ';
            this.accumulatedText += transcriptChunk + ' ';
          } else {
            interim += transcriptChunk;
          }
        }

        const fullDisplay = (this.accumulatedText + (interim ? ' ' + interim : '')).trim();

        if (interim) {
          this.callbacks.onInterim(interim.trim(), fullDisplay);
        }
        if (currentFinal) {
          this.callbacks.onFinal(currentFinal.trim(), fullDisplay);
        }

        // Reset silence timer whenever speech is received
        this.resetSilenceTimer();
      };

      recognition.onerror = (event: any) => {
        console.warn('[RealtimeVoice] Speech error:', event.error);
        if (event.error === 'no-speech') {
          // Normal pause in artisan speech; do not abort
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.isListening = false;
          this.stop();
          this.callbacks.onError('Microphone access denied. Please click the mic button and grant microphone permission in your browser bar.');
        } else if (event.error === 'audio-capture') {
          this.isListening = false;
          this.stop();
          this.callbacks.onError('Microphone is busy or not detected. You can also use the 1-click voice presets below.');
        } else if (event.error === 'network') {
          this.isListening = false;
          this.stop();
          this.callbacks.onError('Speech network service unavailable. Falling back to high-fidelity dialect simulation.');
        } else {
          this.callbacks.onError(`Speech recognition note: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (this.isListening) {
          try {
            recognition.start();
          } catch {
            // If restart fails, stop gracefully
            this.isListening = false;
            if (this.callbacks.onEnd) this.callbacks.onEnd();
          }
        } else {
          if (this.callbacks.onEnd) this.callbacks.onEnd();
        }
      };

      this.recognition = recognition;
      recognition.start();
    } catch (err: any) {
      this.isListening = false;
      this.callbacks.onError(`Speech recognition error: ${err?.message || err}`);
      return;
    }

    // 2. Setup Web Audio API in parallel for real-time waveform without blocking
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            if (!this.isListening) {
              stream.getTracks().forEach((t) => t.stop());
              return;
            }
            this.micStream = stream;
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              this.audioContext = new AudioCtx();
              const source = this.audioContext.createMediaStreamSource(stream);
              this.analyser = this.audioContext.createAnalyser();
              this.analyser.fftSize = 64;
              source.connect(this.analyser);

              const bufferLength = this.analyser.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);

              const monitorAudio = () => {
                if (!this.isListening) return;
                if (this.analyser) {
                  this.analyser.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                  }
                  const average = sum / bufferLength;
                  const level = Math.min(100, Math.round((average / 128) * 100));
                  if (this.callbacks.onAudioLevel) {
                    this.callbacks.onAudioLevel(level);
                  }
                }
                this.animFrameId = requestAnimationFrame(monitorAudio);
              };
              monitorAudio();
            }
          })
          .catch(() => {
            // If getUserMedia fails, fallback to animated speech waveform simulation
            this.startSimulatedWaveform();
          });
      } else {
        this.startSimulatedWaveform();
      }
    } catch {
      this.startSimulatedWaveform();
    }
  }

  private resetSilenceTimer() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    // If user stops speaking for 4.5 seconds after having spoken at least something, trigger silence detection
    if (this.callbacks.onSilenceDetected && this.accumulatedText.trim().length > 10) {
      this.silenceTimer = setTimeout(() => {
        if (this.isListening && this.callbacks.onSilenceDetected) {
          this.callbacks.onSilenceDetected();
        }
      }, 4500);
    }
  }

  private startSimulatedWaveform() {
    if (this.simulatedWaveInterval) clearInterval(this.simulatedWaveInterval);
    this.simulatedWaveInterval = setInterval(() => {
      if (!this.isListening) return;
      // Pulse between 20 and 75
      const mockLevel = Math.round(20 + Math.random() * 55);
      if (this.callbacks.onAudioLevel) {
        this.callbacks.onAudioLevel(mockLevel);
      }
    }, 120);
  }

  public stop(): string {
    this.isListening = false;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.simulatedWaveInterval) {
      clearInterval(this.simulatedWaveInterval);
      this.simulatedWaveInterval = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    if (this.callbacks.onAudioLevel) {
      this.callbacks.onAudioLevel(0);
    }
    if (this.callbacks.onEnd) {
      this.callbacks.onEnd();
    }

    return this.accumulatedText.trim();
  }

  public setLanguage(lang: LanguageCode) {
    this.language = lang;
    if (this.recognition && this.isListening) {
      this.recognition.lang = SPEECH_LANG_MAP[lang] || 'en-IN';
    }
  }
}

/**
 * Intelligent Real-Time Speech Synthesizer (Speaks confirmation back to artisan)
 */
export function speakAssistantFeedback(text: string, lang: LanguageCode = 'en') {
  universalVoiceEngine.play({
    text,
    lang,
  });
}

/**
 * High-fidelity Real-Time Voice Simulation Engine
 * Streams spoken text word-by-word with live audio frequency fluctuations and optional speech synthesis.
 */
export function simulateVoiceStreaming(
  fullText: string,
  lang: LanguageCode,
  callbacks: {
    onStart: () => void;
    onProgress: (currentTranscript: string, interim: string, audioLevel: number) => void;
    onComplete: (completedText: string) => void;
  },
  speakAloud = true
): () => void {
  callbacks.onStart();

  if (speakAloud) {
    speakAssistantFeedback(fullText, lang);
  }

  const words = fullText.split(' ');
  let currentIndex = 0;
  let accumulated = '';
  let isCancelled = false;

  const intervalId = setInterval(() => {
    if (isCancelled) {
      clearInterval(intervalId);
      return;
    }

    if (currentIndex < words.length) {
      const chunkSize = Math.min(3, words.length - currentIndex);
      const nextChunk = words.slice(currentIndex, currentIndex + chunkSize).join(' ');
      currentIndex += chunkSize;
      accumulated = (accumulated ? accumulated + ' ' : '') + nextChunk;

      const mockLevel = Math.round(30 + Math.random() * 55);
      callbacks.onProgress(accumulated, nextChunk, mockLevel);
    } else {
      clearInterval(intervalId);
      callbacks.onProgress(accumulated, '', 0);
      setTimeout(() => {
        if (!isCancelled) {
          callbacks.onComplete(accumulated);
        }
      }, 400);
    }
  }, 180);

  return () => {
    isCancelled = true;
    clearInterval(intervalId);
    universalVoiceEngine.stop();
  };
}

/**
 * Real-Time Natural Language Parser for Voice Product Cataloging
 */
export async function parseSpokenProductInRealTime(
  spokenText: string,
  language: LanguageCode = 'en'
): Promise<VoiceParsedListing> {
  return aiServices.parseVoiceListing(spokenText, language);
}
