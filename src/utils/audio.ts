// Web Audio API Sound Synthesizer & Speech Guidance
class SoundController {
  private ctx: AudioContext | null = null;
  private isSoundEnabled = true;
  private isVoiceEnabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
  }

  // Cute bubble pop
  public playPop() {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext fallback
    }
  }

  // Sparkling star coin ding
  public playStarDing() {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.35);
    } catch {
      // Ignored
    }
  }

  // Happy success chord
  public playSuccess() {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch {
      // Ignored
    }
  }

  // Big Victory Fanfare
  public playFanfare() {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.5, d: 0.4 },
      ];
      let offset = 0;
      notes.forEach((item) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + item.d);
        offset += item.d;
      });
    } catch {
      // Ignored
    }
  }

  // Friendly soft cartoon boing (never scary)
  public playFriendlyBoing() {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignored
    }
  }

  // Rocket whoosh for Space Adventure
  public playRocketWhoosh() {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Ignored
    }
  }

  // Cute animal acoustic effect
  public playAnimalSound(cue: string) {
    if (!this.isSoundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (cue === 'meow') {
        // Meow: pitch slide 600 -> 900 -> 500
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (cue === 'bark') {
        // Two quick dog barks
        [0, 0.15].forEach((delay) => {
          if (!this.ctx) return;
          const t = now + delay;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(380, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.1);
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.1);
        });
      } else if (cue === 'roar') {
        // Lion roar low growl
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      } else {
        // Cheerful playful chirp
        this.playPop();
      }
    } catch {
      // Ignored
    }
  }

  // Friendly Child Voice Speech Synthesizer
  public speak(text: string, options: { lang?: string; pitch?: number; rate?: number } = {}) {
    if (!this.isVoiceEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop pending speech
      const utterance = new SpeechSynthesisUtterance(text);

      const lang = options.lang || 'en-US';
      utterance.lang = lang;
      utterance.pitch = options.pitch ?? 1.25; // Friendly higher pitch for mascot
      utterance.rate = options.rate ?? 0.88; // Slightly slow and clear for kids

      // Attempt to find a warm friendly voice or match language
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (lang.startsWith('ur')) {
          const urVoice = voices.find((v) => v.lang.startsWith('ur') || v.name.includes('Urdu'));
          if (urVoice) utterance.voice = urVoice;
        } else {
          const sweetVoice = voices.find(
            (v) =>
              (v.name.includes('Samantha') ||
                v.name.includes('Karen') ||
                v.name.includes('Zira') ||
                v.name.includes('Victoria') ||
                v.name.includes('Natural')) &&
              v.lang.startsWith('en')
          );
          if (sweetVoice) utterance.voice = sweetVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback gracefully
    }
  }
}

export const sound = new SoundController();
