export class AudioCore {
  private audioEl: HTMLAudioElement;
  onEnd?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onProgress?: (time: number, duration: number) => void;

  constructor(src?: string, volume?: number) {
    this.audioEl = new Audio(src);
    this.audioEl.volume = volume || 1;

    this.audioEl.addEventListener('timeupdate', () => {
      if (this.onProgress) {
        this.onProgress(this.audioEl.currentTime, this.audioEl.duration);
      }
    });

    this.audioEl.addEventListener('ended', () => {
      this.audioEl.currentTime = 0;
      if (this.onEnd) { this.onEnd(); }
    });

    this.audioEl.addEventListener('play', () => {
      if (this.onPlay) { this.onPlay(); }
    });

    this.audioEl.addEventListener('pause', () => {
      if (this.onPause) { this.onPause(); }
    });
  }

  setSrc(src: string) {
    this.audioEl.src = src;
  }

  play(from?: number) {
    if (from) { this.audioEl.currentTime = from; }
    this.audioEl.play();
  }

  pause() {
    this.audioEl.pause();
  }

  getAudioEl() {
    return this.audioEl;
  }

  setVolume(value: number) {
    this.audioEl.volume = value;
  }

  setCurrentTime(value: number) {
    this.audioEl.currentTime = value;
  }
}
