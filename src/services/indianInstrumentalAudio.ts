// DesiCraft - Procedural Indian Instrumental Background Music Synthesizer
// Uses pure Web Audio API: 100% offline, zero network requests, authentic Indian classical resonance
// Includes Tanpura drone (Sa-Pa-Sa'), Sitar plucks (Raag Bhupali), Bansuri flute tones, and soft percussion
// Supports real-time browser playback and MediaStreamDestination routing for 1080p MediaRecorder capture

class IndianInstrumentalSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private isPlaying = false;
  private intervalIds: number[] = [];
  private activeOscillators: OscillatorNode[] = [];
  private bgmVolume = 0.18; // Default soft Indian instrumental volume (18%)
  private isDucked = false;

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Create stream destination for video recording
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.musicGain.connect(this.mediaStreamDest);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  public getAudioContext(): AudioContext {
    return this.init();
  }

  public getMediaStreamDestination(): MediaStreamAudioDestinationNode {
    this.init();
    return this.mediaStreamDest!;
  }

  public setVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && this.ctx) {
      const target = this.isDucked ? this.bgmVolume * 0.35 : this.bgmVolume;
      this.musicGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.bgmVolume;
  }

  public duck(ducked: boolean) {
    this.isDucked = ducked;
    if (this.musicGain && this.ctx) {
      const target = ducked ? this.bgmVolume * 0.35 : this.bgmVolume;
      this.musicGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2);
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx || !this.musicGain) return;

    this.isPlaying = true;

    // 1. Start continuous meditative Tanpura drone
    this.startTanpuraDrone();

    // Trigger immediate melodic sitar opening pluck
    this.playSitarPluck(261.63);

    // 2. Start gentle sitar / santoor melody pattern (Raag Bhupali: Sa, Re, Ga, Pa, Dha)
    this.startSitarMelodyLoop();

    // 3. Start warm Bansuri flute long-tone phrases
    this.startBansuriFluteLoop();

    // 4. Start soft meditative pulse
    this.startRhythmPulseLoop();
  }

  public stop() {
    this.isPlaying = false;

    // Clear all interval timers
    this.intervalIds.forEach((id) => window.clearInterval(id));
    this.intervalIds = [];

    // Stop active oscillators
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    this.activeOscillators = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // --- 1. Authentic Tanpura Drone ---
  // Notes: Pa (196.0 Hz - G3), Sa (130.81 Hz - C3), Sa' (261.63 Hz - C4)
  private startTanpuraDrone() {
    if (!this.ctx || !this.musicGain) return;

    const tanpuraPitches = [
      { freq: 196.0, gain: 0.12, detune: -4 },  // Pa (G3)
      { freq: 130.81, gain: 0.18, detune: 0 },  // Sa (C3)
      { freq: 130.81, gain: 0.15, detune: 3 },  // Sa (C3 unison)
      { freq: 261.63, gain: 0.09, detune: 5 },  // Sa' (C4)
      { freq: 392.0, gain: 0.04, detune: -2 },  // Pa' (G4 harmonic)
    ];

    tanpuraPitches.forEach((pitch) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch.freq, this.ctx.currentTime);
      osc.detune.setValueAtTime(pitch.detune, this.ctx.currentTime);

      // Lowpass filter to give authentic wooden acoustic warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      // Subtle LFO modulation on filter to simulate acoustic string vibration
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.25 + Math.random() * 0.15, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.activeOscillators.push(lfo);

      gain.gain.setValueAtTime(pitch.gain, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      this.activeOscillators.push(osc);
    });
  }

  // --- 2. Sitar / Plucked Santoor Melody ---
  // Raag Bhupali Pentatonic Scale: C4, D4, E4, G4, A4, C5
  private startSitarMelodyLoop() {
    if (!this.ctx) return;

    // Frequencies in Hz for Raag Bhupali
    const bhupaliScale = [
      261.63, // C4 (Sa)
      293.66, // D4 (Re)
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      440.00, // A4 (Dha)
      523.25, // C5 (Sa')
      587.33, // D5 (Re')
      659.25, // E5 (Ga')
    ];

    // Elegant, slow Indian classical melody pattern
    const melodySeq = [
      0, 2, 3, 4, 3, 2, 0,
      1, 2, 4, 5, 4, 3, 2,
      3, 4, 5, 7, 5, 4, 3,
      2, 0, 1, 2, 0, 3, 2,
    ];
    let noteIdx = 0;

    const pluckInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.musicGain) return;

      const scaleIdx = melodySeq[noteIdx % melodySeq.length];
      const freq = bhupaliScale[scaleIdx] || 261.63;
      noteIdx++;

      // Play rich sitar-like plucked note
      this.playSitarPluck(freq);
    }, 1800); // Pluck every 1.8 seconds for calm meditative feel

    this.intervalIds.push(pluckInterval);
  }

  private playSitarPluck(freq: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Dual oscillator: fundamental + high metallic harmonic
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq * 2, now); // Octave overtone

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.setValueAtTime(3.0, now);

    // Exponential pluck envelope
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.03); // Quick pluck attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.2); // Resonant wooden decay

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.3);
    osc2.stop(now + 2.3);
  }

  // --- 3. Bansuri (Bamboo Flute) Ambient Swells ---
  private startBansuriFluteLoop() {
    if (!this.ctx) return;

    const fluteNotes = [
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      440.00, // A4 (Dha)
      523.25, // C5 (Sa)
      392.00, // G4
    ];
    let fluteIdx = 0;

    const fluteInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.musicGain) return;

      const freq = fluteNotes[fluteIdx % fluteNotes.length];
      fluteIdx++;

      this.playFlutePhrase(freq);
    }, 7200); // Gentle breath every 7.2 seconds

    this.intervalIds.push(fluteInterval);
  }

  private playFlutePhrase(freq: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm vibrato
    vibrato.frequency.setValueAtTime(5.2, now);
    vibratoGain.gain.setValueAtTime(3.5, now);
    vibrato.connect(osc.frequency);
    vibrato.start(now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    // Soft breath envelope (slow attack, sustained tone, gentle fade)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.8);
    gain.gain.setValueAtTime(0.07, now + 2.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 4.3);
    vibrato.stop(now + 4.3);
  }

  // --- 4. Soft Meditative Rhythm Pulse ---
  private startRhythmPulseLoop() {
    if (!this.ctx) return;

    const pulseInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.musicGain) return;
      this.playGentleBassPulse();
    }, 3600);

    this.intervalIds.push(pulseInterval);
  }

  private playGentleBassPulse() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65.4, now); // Low C2
    osc.frequency.exponentialRampToValueAtTime(45.0, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.95);
  }

  // Authentic temple chime / chime harmonic tone for scene transitions
  public playSceneCueTone(sceneId: number) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    const chimePitches = [523.25, 587.33, 659.25, 784.0, 880.0, 1046.5]; // High Sa, Re, Ga, Pa, Dha, Sa'
    const freq = chimePitches[sceneId % chimePitches.length] || 523.25;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 1.45);
  }
}

export const indianInstrumentalSynth = new IndianInstrumentalSynthesizer();
