// DesiCraft - Synchronized Demo Voiceover Service
// Delivers confident, clear Indian English narration synchronized with scenes
// Handles audio ducking of Indian instrumental background music during speech

import { indianInstrumentalSynth } from './indianInstrumentalAudio';

class DemoVoiceoverService {
  private isMuted = false;
  private volume = 1.0;
  private playbackRate = 1.0;
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private indianVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoice();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();

    // Prioritize Indian English female or male voices
    const inVoice =
      voices.find((v) => v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en_in') ||
      voices.find((v) => v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('hindi')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    this.indianVoice = inVoice || null;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = Math.max(0.75, Math.min(2.0, rate));
  }

  public speakScene(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    this.stop();

    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      this.initVoice();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.indianVoice) {
        utterance.voice = this.indianVoice;
        utterance.lang = this.indianVoice.lang;
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.volume = this.volume;
      utterance.rate = 0.95 * this.playbackRate; // Calm, confident, authoritative medium Indian English pace
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        indianInstrumentalSynth.duck(true); // Duck background music gently during speech
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        indianInstrumentalSynth.duck(false); // Restore background music
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        indianInstrumentalSynth.duck(false);
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[Demo Voiceover] Speech error:', e);
        }
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[Demo Voiceover] Exception:', err);
    }
  }

  public stop() {
    this.isSpeaking = false;
    indianInstrumentalSynth.duck(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}

export const demoVoiceover = new DemoVoiceoverService();
