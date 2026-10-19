// Real-time microphone audio frequency and decibel analyzer using Web Audio API

export class AudioAnalyser {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private isAnalyzing: boolean = false;

  public async start(onUpdate: (volume: number, frequencies: number[]) => void): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(stream);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64; // Gives 32 frequency bins
      this.analyser.smoothingTimeConstant = 0.8;

      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.isAnalyzing = true;

      const loop = () => {
        if (!this.isAnalyzing || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalizedVolume = Math.min(100, Math.round((avg / 128) * 100));

        // Get 8 distinct frequency band values (0 to 100)
        const bands: number[] = [];
        const step = Math.floor(bufferLength / 8);
        for (let i = 0; i < 8; i++) {
          const val = dataArray[i * step] || 0;
          bands.push(Math.min(100, Math.round((val / 255) * 100)));
        }

        onUpdate(normalizedVolume, bands);

        this.animationFrameId = requestAnimationFrame(loop);
      };

      loop();
      return true;
    } catch (err) {
      console.warn('Microphone analyzer permission or setup issue:', err);
      return false;
    }
  }

  public stop(): void {
    this.isAnalyzing = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
