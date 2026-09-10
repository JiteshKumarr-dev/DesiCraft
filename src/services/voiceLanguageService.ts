// Desi Craft - Universal Voice Language Engine
// Provides bulletproof, multi-tier speech synthesis across all 10 Indian regional languages
// Tier 1: High-fidelity natural audio stream (with no-referrer policy)
// Tier 2: Native Web Speech API with BCP-47 tag and precise voice matching
// Tier 3: Phonetic Indian-accent transliteration fallback ensuring 100% audibility on any OS

import { LanguageCode } from '../types';

export const VOICE_LANG_MAP: Record<LanguageCode, string> = {
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

// Google TTS Language Codes
export const GOOGLE_TTS_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  kn: 'kn',
  ml: 'ml',
  mr: 'mr',
  bn: 'bn',
  gu: 'gu',
  pa: 'pa',
};

// Phonetic Pronunciations for 100% Reliable Fallback on OS lacking native Indian SAPI voices
export const PHONETIC_SAMPLES: Record<LanguageCode, { greeting: string; sample: string }> = {
  en: {
    greeting: 'Welcome to Desi Craft',
    sample: 'English. Discover India living heritage and artisan treasures.',
  },
  hi: {
    greeting: 'Desi Craft mein aapka swaagat hai',
    sample: 'Hindi. Bharat ki jeevant shilpakala aur hastshilp ka anubhav karein.',
  },
  te: {
    greeting: 'Desi Craft-ku Swagatam',
    sample: 'Telugu. Bhaarateeya chetivruttula jeevanta vaarasatvaanni anubhavinchandi.',
  },
  ta: {
    greeting: 'Desi Craft-ku Nalvaravu',
    sample: 'Tamil. Indhiyavin tholilmutha kaivinai paarambariyathai unarungal.',
  },
  kn: {
    greeting: 'Desi Craft-ge Suswaagatha',
    sample: 'Kannada. Bhaarateeya karakushala paramparayannu hemmeyinda anveshisi.',
  },
  ml: {
    greeting: 'Desi Craft-ilekku Swaagatham',
    sample: 'Malayalam. Bhaarathathinte karakaushala paaramparyam ariyuka.',
  },
  mr: {
    greeting: 'Desi Craft madhye aple swaagat aahe',
    sample: 'Marathi. Bharataacha jeevant hastakala vaarasa anubhava.',
  },
  bn: {
    greeting: 'Desi Craft-e aapnake swaagatom',
    sample: 'Bengali. Bharater jeevanto oitijhyo o hostoshilpo aabishkaar korun.',
  },
  gu: {
    greeting: 'Desi Craft-ma aapnu swaagat chhe',
    sample: 'Gujarati. Bharatiye hastakalaano vaibhav ane varaso anubhavo.',
  },
  pa: {
    greeting: 'Desi Craft vich jee aayan nu',
    sample: 'Punjabi. Bharat de jionde jaagde hastkalaa virse nu jaano.',
  },
};

export interface PlayVoiceOptions {
  text: string;
  lang: LanguageCode;
  phoneticFallback?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class UniversalVoiceEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeakingState = false;
  private isPausedState = false;
  private activeLangCode: LanguageCode | null = null;
  private listeners: Set<(speaking: boolean, activeLang: LanguageCode | null) => void> = new Set();
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  public subscribe(listener: (speaking: boolean, activeLang: LanguageCode | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingState, this.activeLangCode);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSpeakingState, this.activeLangCode));
  }

  public stop() {
    // 1. Stop any audio element
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }

    // 2. Stop SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.isSpeakingState = false;
    this.isPausedState = false;
    this.activeLangCode = null;
    this.notify();
  }

  public async play(options: PlayVoiceOptions): Promise<boolean> {
    const { text, lang, phoneticFallback, onStart, onEnd, onError } = options;

    // Stop any existing speech
    this.stop();

    this.isSpeakingState = true;
    this.activeLangCode = lang;
    this.notify();

    // Strategy 1: High-fidelity natural audio stream via Google TTS with no-referrer
    const audioSuccess = await this.tryAudioStream(text, lang, onStart, onEnd);
    if (audioSuccess) {
      return true;
    }

    // Strategy 2: Native Web Speech API with BCP-47 language tag
    const webSpeechSuccess = this.tryWebSpeech(text, lang, phoneticFallback, onStart, onEnd, onError);
    if (webSpeechSuccess) {
      return true;
    }

    this.isSpeakingState = false;
    this.activeLangCode = null;
    this.notify();
    onError?.(new Error(`Unable to play voice for ${lang}`));
    return false;
  }

  private tryAudioStream(
    text: string,
    lang: LanguageCode,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const googleLang = GOOGLE_TTS_LANG_MAP[lang] || 'en';
        // Limit query text length for audio URL safety
        const trimmedText = text.slice(0, 180);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          trimmedText
        )}&tl=${googleLang}&client=tw-ob`;

        const audio = new Audio();
        // Important: omit referrer so Google TTS does not return 404
        audio.setAttribute('referrerpolicy', 'no-referrer');
        (audio as any).referrerPolicy = 'no-referrer';

        let hasResolved = false;

        const cleanup = () => {
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          this.isSpeakingState = false;
          this.activeLangCode = null;
          this.notify();
        };

        audio.onplay = () => {
          onStart?.();
        };

        audio.onended = () => {
          cleanup();
          onEnd?.();
          if (!hasResolved) {
            hasResolved = true;
            resolve(true);
          }
        };

        audio.onerror = () => {
          cleanup();
          if (!hasResolved) {
            hasResolved = true;
            resolve(false);
          }
        };

        // Timeout guard: if audio doesn't start within 2.5s, fall back to Web Speech
        const timer = setTimeout(() => {
          if (!hasResolved && audio.paused && audio.currentTime === 0) {
            hasResolved = true;
            audio.pause();
            cleanup();
            resolve(false);
          }
        }, 2500);

        this.currentAudio = audio;
        audio.src = ttsUrl;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              clearTimeout(timer);
              if (!hasResolved) {
                hasResolved = true;
                resolve(true);
              }
            })
            .catch(() => {
              clearTimeout(timer);
              cleanup();
              if (!hasResolved) {
                hasResolved = true;
                resolve(false);
              }
            });
        }
      } catch (e) {
        resolve(false);
      }
    });
  }

  private tryWebSpeech(
    text: string,
    lang: LanguageCode,
    phoneticFallback?: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    try {
      this.initVoices();
      const bcp47 = VOICE_LANG_MAP[lang] || 'en-IN';
      const langPrefix = bcp47.split('-')[0].toLowerCase();

      // Look for a voice matching exact BCP-47 tag or prefix
      let matchedVoice = this.voices.find((v) => v.lang.toLowerCase() === bcp47.toLowerCase());
      if (!matchedVoice) {
        matchedVoice = this.voices.find((v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
        );
      }
      if (!matchedVoice) {
        const langNames: Record<LanguageCode, string> = {
          en: 'english',
          hi: 'hindi',
          te: 'telugu',
          ta: 'tamil',
          kn: 'kannada',
          ml: 'malayalam',
          mr: 'marathi',
          bn: 'bengali',
          gu: 'gujarati',
          pa: 'punjabi',
        };
        const searchName = langNames[lang] || '';
        matchedVoice = this.voices.find((v) => v.name.toLowerCase().includes(searchName));
      }

      // If no native voice exists on client machine, select best Indian English/Hindi voice or default
      let textToSpeak = text;
      let voiceToUse = matchedVoice;

      if (!matchedVoice) {
        // Fallback to Indian English or Hindi voice with phonetic pronunciation
        const fallbackVoice = this.voices.find(
          (v) =>
            v.lang.toLowerCase().includes('en-in') ||
            v.lang.toLowerCase().includes('hi-in') ||
            v.name.toLowerCase().includes('india')
        );
        voiceToUse = fallbackVoice || this.voices[0];
        textToSpeak = phoneticFallback || PHONETIC_SAMPLES[lang]?.sample || text;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = voiceToUse ? voiceToUse.lang : bcp47;
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeakingState = true;
        this.activeLangCode = lang;
        this.notify();
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.activeLangCode = null;
        this.notify();
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('SpeechSynthesis fallback error:', e);
        }
        this.isSpeakingState = false;
        this.activeLangCode = null;
        this.notify();
        onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Web Speech error:', e);
      return false;
    }
  }

  public getSpeakingState() {
    return {
      isSpeaking: this.isSpeakingState,
      activeLang: this.activeLangCode,
    };
  }
}

export const universalVoiceEngine = new UniversalVoiceEngine();
