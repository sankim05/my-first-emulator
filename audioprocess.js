class XOaudioProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'pitch',
        defaultValue: 64,
        minValue: 0,
        maxValue: 255,
        automationRate: 'k-rate'
        
      }
    ];
  }

  constructor() {
    super();
    this.sampleIndex = 0;
    this.phase = 0;
    this.wave = new Float32Array(16).fill(0);


    this.port.onmessage = (event) => {
      if (event.data.type === 'wave') {
        const wav = event.data.data;
        for (let i = 0; i < 16; i++) {
          this.wave[i] = (wav[i] * 2) / 255 - 1;
        }
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0][0];
    const pitch = parameters.pitch[0];

    const playbackRate = 500 * (2**((pitch-64)/48));
    const increment = playbackRate / sampleRate;

    for (let i = 0; i < output.length; i++) {
      const idx = Math.floor(this.phase) % 16;
      output[i] = this.wave[idx];
      this.phase += increment;
      if (this.phase >= 16) this.phase -= 16;
    }

    return true;
  }
}

registerProcessor('xoaudioProcessor', XOaudioProcessor);
