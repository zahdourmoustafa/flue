class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(0);
    this.resampleRatio = 1;
    this.targetSampleRate = 24000;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length === 0 || !input[0]) {
      return true;
    }

    // Determine resample ratio only once
    if (this.resampleRatio === 1) {
      this.resampleRatio = this.targetSampleRate / sampleRate;
    }

    // Resample the audio data
    const inputData = input[0];
    const resampledData = this.resample(inputData);

    // Convert to 16-bit PCM
    const int16Data = this.toFloat32ToInt16(resampledData);

    // Post the processed data back to the main thread
    if (int16Data.length > 0) {
      this.port.postMessage(int16Data);
    }

    return true;
  }

  resample(inputData) {
    if (this.resampleRatio === 1) {
      return inputData;
    }

    const outputLength = Math.floor(inputData.length * this.resampleRatio);
    const output = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const sourceIndex = i / this.resampleRatio;
      const index = Math.floor(sourceIndex);
      const fraction = sourceIndex - index;

      if (index + 1 < inputData.length) {
        output[i] =
          inputData[index] * (1 - fraction) + inputData[index + 1] * fraction;
      } else {
        output[i] = inputData[index] || 0;
      }
    }
    return output;
  }

  toFloat32ToInt16(buffer) {
    const int16Buffer = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      int16Buffer[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32768));
    }
    return int16Buffer;
  }
}

registerProcessor("audio-processor", AudioProcessor);
