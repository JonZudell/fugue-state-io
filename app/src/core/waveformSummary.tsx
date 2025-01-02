import FFT from "fft.js";
const SAMPLE_RATE = 44100;
const SAMPLE_BIN_SIZE = 4096;
const HALF_SAMPLE_BIN_SIZE = Math.floor(SAMPLE_BIN_SIZE / 2);
const fft = new FFT(SAMPLE_BIN_SIZE);
const WINDOW_FUNCTION = "hamming";
type Frame = {
  start: number;
  end: number;
  data: number[];
};

export type SummarizedFrame = {
  max: number;
  min: number;
  avg: number;
  fft: number[];
  magnitudes: number[];
};

export type Channels = {
  mono: SummarizedFrame[];
  left?: SummarizedFrame[];
  right?: SummarizedFrame[];
  side?: SummarizedFrame[];
};
function applyWindowFunction(data: number[], windowType: string): number[] {
  const N = data.length;
  switch (windowType) {
    case 'hamming':
      return data.map((value, n) => value * (0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1))));
    case 'hann':
      return data.map((value, n) => value * (0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)))));
    case 'blackman':
      return data.map((value, n) => value * (0.42 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1)) + 0.08 * Math.cos((4 * Math.PI * n) / (N - 1))));
    case 'rectangular':
      return data; // No windowing
    case 'bartlett':
      return data.map((value, n) => value * (2 / (N - 1)) * ((N - 1) / 2 - Math.abs(n - (N - 1) / 2)));
    default:
      throw new Error('Unknown window type');
  }
}
function getFrequencyBins(
  frequencies: number[],
  sampleRate: number,
  fftSize: number,
): number[] {
  return frequencies.map((frequency) =>
    Math.round((frequency * fftSize) / sampleRate),
  );
}
export const ABins = getFrequencyBins(
  [220, 440, 880, 1760, 3520, 7040, 14080],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const ASharpBins = getFrequencyBins(
  [233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62, 14917.24],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const BBins = getFrequencyBins(
  [246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13, 15804.26],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const CBins = getFrequencyBins(
  [261.63, 523.25, 1046.5, 2093.0, 4186.0, 8392.0, 16784.0],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const CSharpBins = getFrequencyBins(
  [277.18, 554.37, 1108.73, 2217.46, 4434.92, 8869.84, 17739.68],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const DBins = getFrequencyBins(
  [293.66, 587.33, 1174.66, 2349.32, 4698.64, 9397.27, 18794.55],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const DSharpBins = getFrequencyBins(
  [311.13, 622.25, 1244.51, 2489.02, 4978.03, 9956.06, 19912.12],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const EBins = getFrequencyBins(
  [329.63, 659.26, 1318.51, 2637.02, 5274.04, 10548.08, 21096.16],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const FBins = getFrequencyBins(
  [349.23, 698.46, 1396.91, 2793.83, 5587.65, 11175.30, 22350.61],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);

export const FSharpBins = getFrequencyBins(
  [369.99, 739.99, 1479.98, 2959.96, 5919.91, 11839.82, 23679.64],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);

export const GBins = getFrequencyBins(
  [392.0, 783.99, 1567.98, 3135.96, 6271.93, 12543.86],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);

export const GSharpBins = getFrequencyBins(
  [415.30, 830.61, 1661.22, 3322.44, 6644.88, 13289.75, 26579.51],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);

function frameFromSlice(array: number[], start: number, end: number): Frame {
  const data = Array.from(array.slice(start, end));
  const fft1: number[] = new Array(
    Math.pow(2, Math.ceil(Math.log2(data.length))),
  ).fill(0);
  fft.realTransform(fft1, data);
  return {
    data: data,
    start: start,
    end: end,
  };
}

function interleavedFramesFromChannelData(data: number[]): Frame[] {
  const frames: Frame[] = [];
  const interpolatedFrameCount = data.length / HALF_SAMPLE_BIN_SIZE;

  for (let i = 0; i < interpolatedFrameCount; i++) {
    const start = i * HALF_SAMPLE_BIN_SIZE;
    const end = Math.min(
      i * HALF_SAMPLE_BIN_SIZE + SAMPLE_BIN_SIZE,
      data.length,
    );
    const frame = frameFromSlice(data, start, end);
    frames.push(frame);
  }
  return frames;
}

function summarizeFrame(frame: Frame): SummarizedFrame {
  const count = frame.data.length;
  const max = Math.max(...frame.data);
  const min = Math.min(...frame.data);
  const avg = frame.data.reduce((a, b) => a + b, 0) / count;
  const input: number[] = new Array(SAMPLE_BIN_SIZE).fill(0);
  const output: number[] = new Array(SAMPLE_BIN_SIZE).fill(0);
  // Apply windowing function before transforming
  const windowedData = applyWindowFunction(frame.data, WINDOW_FUNCTION);

  windowedData.forEach((value, index) => {
    input[index] = value;
  });
  fft.realTransform(output, input);
  const magnitudes = [];
  for (let i = 0; i < output.length; i += 2) {
    magnitudes.push(Math.sqrt(output[i] ** 2 + output[i + 1] ** 2));
  }

  return {
    max: max,
    min: min,
    avg: avg,
    fft: output,
    magnitudes: magnitudes,
  };
}

function summarizeInterleavedFrames(frames: Frame[]): SummarizedFrame[] {
  let lastFrame: SummarizedFrame = summarizeFrame(frames[0]);
  const summarizedFrames: SummarizedFrame[] = [];

  let ndx = 0;

  while (ndx < frames.length) {
    const summarizedFrame = summarizeFrame(frames[ndx]);
    const thisFrame = { ...summarizedFrames[ndx] };

    thisFrame.max = (lastFrame.max + summarizedFrame.max) / 2;
    thisFrame.min = (lastFrame.min + summarizedFrame.min) / 2;
    thisFrame.avg = (lastFrame.avg + summarizedFrame.avg) / 2;
    thisFrame.fft = lastFrame.fft.map(
      (value, index) => (value + summarizedFrame.fft[index]) / 2,
    );
    thisFrame.magnitudes = lastFrame.magnitudes.map(
      (value, index) => (value + summarizedFrame.magnitudes[index]) / 2,
    );

    summarizedFrames.push(thisFrame);
    lastFrame = summarizedFrame;
    ndx++;
  }
  return summarizedFrames;
}

export async function generateWaveformSummary(
  audioContext: AudioContext,
  file: File,
): Promise<Channels> {
  const arrayBuffer = await file.arrayBuffer();

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  if (audioBuffer.numberOfChannels > 2) {
    throw new Error("Only mono and stereo files are supported");
  } else if (audioBuffer.numberOfChannels === 1) {
    const interleavedFrames: Frame[] = interleavedFramesFromChannelData(
      Array.from(audioBuffer.getChannelData(0)),
    );

    const mono: SummarizedFrame[] =
      summarizeInterleavedFrames(interleavedFrames);

    return { mono: mono };
  } else {
    const leftInterleaved: Frame[] = interleavedFramesFromChannelData(
      Array.from(audioBuffer.getChannelData(0)),
    );
    const rightInterleaved: Frame[] = interleavedFramesFromChannelData(
      Array.from(audioBuffer.getChannelData(1)),
    );

    const left: SummarizedFrame[] = summarizeInterleavedFrames(leftInterleaved);
    const right: SummarizedFrame[] =
      summarizeInterleavedFrames(rightInterleaved);

    const midChannel: Float32Array = new Float32Array(leftInterleaved.length);
    const sideChannel: Float32Array = new Float32Array(leftInterleaved.length);
    midChannel.forEach((value, index) => {
      midChannel[index] =
        (leftInterleaved[index].data[index] +
          rightInterleaved[index].data[index]) /
        2;
    });
    sideChannel.forEach((value, index) => {
      sideChannel[index] =
        (leftInterleaved[index].data[index] -
          rightInterleaved[index].data[index]) /
        2;
    });

    const mid: SummarizedFrame[] = summarizeInterleavedFrames(leftInterleaved);
    const side: SummarizedFrame[] =
      summarizeInterleavedFrames(rightInterleaved);

    return { mono: mid, left: left, right: right, side: side };
  }
}
