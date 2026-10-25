// Web Audio API generator for TeenOS (Ambient focus sound & musical chords)
class AudioManager {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private isAmbientPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a rewarding gentle celebration chime
  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.24); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.36); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // AudioContext may be blocked before user gesture
    }
  }

  // Play musical chords (Em, G, D, Cmaj7, Am, F)
  playChord(chordName: string) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const chordFreqs: Record<string, number[]> = {
        'Em': [164.81, 246.94, 329.63, 392.00], // E3, B3, E4, G4
        'Em7': [164.81, 246.94, 293.66, 392.00], // E3, B3, D4, G4
        'G': [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4
        'D': [146.83, 220.00, 293.66, 369.99], // D3, A3, D4, F#4
        'D/F#': [185.00, 220.00, 293.66, 369.99], // F#3, A3, D4, F#4
        'Cadd9': [130.81, 196.00, 293.66, 329.63], // C3, G3, D4, E4
        'Cmaj7': [130.81, 196.00, 246.94, 329.63], // C3, G3, B3, E4
        'Am': [110.00, 220.00, 261.63, 329.63], // A2, A3, C4, E4
        'F': [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4
        'Dsus4': [146.83, 220.00, 293.66, 392.00], // D3, A3, D4, G4
      };

      const freqs = chordFreqs[chordName] || [261.63, 329.63, 392.00];
      const now = this.ctx.currentTime;

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03); // gentle arpeggio strum

        gain.gain.setValueAtTime(0.08, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + 1.8);
      });
    } catch {
      // Ignored if sound is restricted
    }
  }

  // Toggle procedural ambient noise (Rain or Lo-Fi warmth)
  toggleAmbient(type: 'rain' | 'lofi' | 'cafe'): boolean {
    try {
      this.initCtx();
      if (!this.ctx) return false;

      if (this.isAmbientPlaying) {
        if (this.ambientSource) {
          (this.ambientSource as any).stop?.();
          this.ambientSource.disconnect();
          this.ambientSource = null;
        }
        this.isAmbientPlaying = false;
        return false;
      }

      // Generate brown/pink noise buffer for rain/cafe
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter for soft rain
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 450;

      const gain = this.ctx.createGain();
      gain.gain.value = 0.08;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.ambientSource = whiteNoise;
      this.isAmbientPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as any).stop?.();
        this.ambientSource.disconnect();
      } catch {}
      this.ambientSource = null;
    }
    this.isAmbientPlaying = false;
  }
}

export const audioManager = new AudioManager();
