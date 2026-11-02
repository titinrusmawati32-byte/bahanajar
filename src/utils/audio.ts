// Web Audio API ambient & respiratory sound synthesizer

class AudioService {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private breathInterval: number | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public toggle(): boolean {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }

    return this.isEnabled;
  }

  public getStatus(): boolean {
    return this.isEnabled;
  }

  private startAmbient() {
    if (!this.ctx) return;
    try {
      this.oscillator = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(110, this.ctx.currentTime);

      this.gainNode.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.oscillator.start();

      this.breathInterval = window.setInterval(() => {
        if (!this.ctx || !this.gainNode || !this.isEnabled) return;
        const now = this.ctx.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0.04, now + 1.8);
        this.gainNode.gain.linearRampToValueAtTime(0.015, now + 3.8);
      }, 4000);
    } catch {
      // Ignore
    }
  }

  private stopAmbient() {
    if (this.breathInterval) {
      clearInterval(this.breathInterval);
      this.breathInterval = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {
        // silent
      }
      this.oscillator = null;
    }
  }

  public playClick() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // silent
    }
  }
}

export const audioService = new AudioService();
