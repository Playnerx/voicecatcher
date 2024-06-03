class AudioAnalyzer {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.source = null;
    this.gradient = null;
    this.canvasWidth = 1000;
    this.canvasHeight = 300;
    this.barWidth = 2;
  }
 
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          this.context = new (window.AudioContext || window.webkitAudioContext)();
          this.createAnalyzer();
        })
        .catch(() => {
          window.addEventListener('click', () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then((stream) => {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.createAnalyzer();
                this.source = this.context.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
                this.draw();
              })
              .catch((error) => {
                console.error('Errore durante l\'acquisizione audio:', error);
              });
          }, { once: true });
        });
    });
  }
 
 
  createAnalyzer() {
    if (!this.context) {
      console.error('Errore durante la creazione dell\'AudioContext');
      return;
    }
 
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.9;
 
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    this.gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    this.gradient.addColorStop(1, '#2467C1');
    this.gradient.addColorStop(0.65, '#ADD8E6');
    this.gradient.addColorStop(0.45, '#A1D5F1');
    this.gradient.addColorStop(0, 'ghostwhite');
    ctx.fillStyle = this.gradient;
 
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.source = this.context.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
        this.draw();
      })
      .catch((error) => {
        console.error('Errore durante l\'acquisizione audio:', error);
      });
  }
 
  draw() {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (this.canvasWidth / bufferLength) * this.barWidth;
    let x = 0;

    const drawFrame = () => {
      this.analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 256 * this.canvasHeight;
        ctx.fillRect(x, this.canvasHeight - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      x = 0;
      requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  }
}

export default AudioAnalyzer;