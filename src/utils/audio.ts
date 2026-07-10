/**
 * Web Audio API Premium Sound Synthesizer for PredictX AI.
 * Synthesizes luxurious, crisp futuristic sound effects purely in-code.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      // Lazy initialization on user gesture
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private isEnabled(): boolean {
    return localStorage.getItem('predictx_sound_enabled') !== 'false';
  }

  /**
   * Play a organic digital button pop
   */
  public playClick() {
    if (!this.isEnabled()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.11);
  }

  /**
   * Play a crisp geometric cyber wheel tick
   * Pitch varies slightly depending on multiplier speed to feel highly dynamic
   */
  public playTick(pitchMultiplier = 1.0) {
    if (!this.isEnabled()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    const baseFreq = 1600 + (Math.random() * 200);
    osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600 * pitchMultiplier, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }

  /**
   * Play a premium glass chime success sound
   * Uses multi-layered sine waves to synthesize a high-end corporate digital bell chime
   */
  public playChime(multiplier: number) {
    if (!this.isEnabled()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Scale the pitch based on the multiplier size to signify bigger success!
    const sizeFactor = Math.min(Math.max(multiplier / 8, 0.9), 2.2);

    // Gorgeous luxury major chord frequencies
    const baseFreqs = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5, E5, G5, B5, D6
    
    // Play notes staggered slightly to create an arpeggiated bloom effect!
    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      osc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle'; // Blend for rich harmonics
      
      const targetFreq = freq * sizeFactor;
      osc.frequency.setValueAtTime(targetFreq * 0.95, now + (idx * 0.04));
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + (idx * 0.04) + 0.25);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, now);
      filterNode.frequency.exponentialRampToValueAtTime(800, now + 0.6);

      // Volume envelope
      const noteDelay = idx * 0.035;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.045, now + noteDelay + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + 1.2);

      osc.start(now + noteDelay);
      osc.stop(now + noteDelay + 1.3);
    });
  }

  /**
   * Play a dynamic cyber crash power-down sound
   * Triggers when the generated multiplier ends up at 0.00x
   */
  public playCrash() {
    if (!this.isEnabled()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Sub-bass glide
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    subOsc.connect(filter);
    filter.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    // Crackle / digital dissolve transient
    const noiseOsc = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseOsc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseOsc.type = 'triangle';
    noiseOsc.frequency.setValueAtTime(400, now);
    noiseOsc.frequency.exponentialRampToValueAtTime(10, now + 0.25);

    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.Q.setValueAtTime(4, now);

    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    subOsc.start(now);
    subOsc.stop(now + 0.75);

    noiseOsc.start(now);
    noiseOsc.stop(now + 0.35);
  }
}

export const audio = new AudioEngine();
