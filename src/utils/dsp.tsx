import FFT from "fft.js";
const SAMPLE_RATE = 44100;
const SAMPLE_BIN_SIZE = 2048;
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
  mono?: SummarizedFrame[] | null;
  left?: SummarizedFrame[] | null;
  right?: SummarizedFrame[] | null;
  side?: SummarizedFrame[] | null;
};
function applyWindowFunction(data: number[], windowType: string): number[] {
  const N = data.length;
  switch (windowType) {
    case "hamming":
      return data.map(
        (value, n) =>
          value * (0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1))),
      );
    case "hann":
      return data.map(
        (value, n) =>
          value * (0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)))),
      );
    case "blackman":
      return data.map(
        (value, n) =>
          value *
          (0.42 -
            0.5 * Math.cos((2 * Math.PI * n) / (N - 1)) +
            0.08 * Math.cos((4 * Math.PI * n) / (N - 1))),
      );
    case "rectangular":
      return data; // No windowing
    case "bartlett":
      return data.map(
        (value, n) =>
          value * (2 / (N - 1)) * ((N - 1) / 2 - Math.abs(n - (N - 1) / 2)),
      );
    default:
      throw new Error("Unknown window type");
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
export function getFrequencyForBin(bin: number): number {
  return (bin * SAMPLE_RATE) / SAMPLE_BIN_SIZE;
}
export const ABins = getFrequencyBins(
  [11.25, 22.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const ASharpBins = getFrequencyBins(
  [
    12.78, 25.56, 41.26, 82.52, 165.04, 233.08, 466.16, 932.33, 1864.66,
    3729.31, 7458.62, 14917.24,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const BBins = getFrequencyBins(
  [
    15.45, 30.9, 61.79, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07,
    7902.13, 15804.26,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const CBins = getFrequencyBins(
  [
    16.85, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.0, 8392.0,
    16784.0,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const CSharpBins = getFrequencyBins(
  [
    18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64,
    9397.27, 18794.55,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const DBins = getFrequencyBins(
  [
    20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02, 5274.04,
    10548.08, 21096.16,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const DSharpBins = getFrequencyBins(
  [
    23.12, 46.25, 92.5, 185.0, 369.99, 739.99, 1479.98, 2959.96, 5919.91,
    11839.82, 23679.64,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const EBins = getFrequencyBins(
  [
    25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44, 6644.88,
    13289.75, 26579.51,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const FBins = getFrequencyBins(
  [
    29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62,
    14917.24, 29834.48,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const FSharpBins = getFrequencyBins(
  [
    32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01, 8372.02,
    16744.04, 33488.08,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const GBins = getFrequencyBins(
  [
    36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64, 9397.27,
    18794.55, 37589.1,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);
export const GSharpBins = getFrequencyBins(
  [
    41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02, 5274.04, 10548.08,
    21096.16, 42192.32,
  ],
  SAMPLE_RATE,
  SAMPLE_BIN_SIZE,
);

const binColors = [
  { bins: CBins, color: [255, 0, 0] }, // Red
  { bins: CSharpBins, color: [255, 68, 0] },
  { bins: DBins, color: [255, 127, 0] }, // Orange
  { bins: DSharpBins, color: [255, 187, 0] },
  { bins: EBins, color: [255, 255, 0] }, // Yellow
  { bins: FBins, color: [0, 255, 0] }, // Green
  { bins: FSharpBins, color: [148, 0, 211] },
  { bins: GBins, color: [0, 0, 255] }, // Blue
  { bins: GSharpBins, color: [107, 114, 128] },
  { bins: ABins, color: [99, 102, 241] }, // Indigo
  { bins: ASharpBins, color: [134, 93, 243] },
  { bins: BBins, color: [168, 85, 247] }, // Violet
];

const frequencyRanges = Array.from({ length: SAMPLE_BIN_SIZE }, (_, bin) => ({
  bin,
  frequency: getFrequencyForBin(bin),
  binColor: binColors.find((color) => color.bins.includes(bin))?.color,
}));
const indexesWithBinColor = frequencyRanges
  .filter((range) => range.binColor !== undefined)
  .map((range) => range.bin);

for (let i = 0; i < indexesWithBinColor[0]; i++) {
  frequencyRanges[i].binColor = [156, 163, 175];
}
for (let i = 1; i < indexesWithBinColor.length; i++) {
  const start = indexesWithBinColor[i - 1];
  const end = indexesWithBinColor[i];
  const startColor = frequencyRanges[start].binColor;
  const endColor = frequencyRanges[end].binColor;
  if (startColor && endColor) {
    const color = new Array(3).fill(0);
    const gradientWidth = end - start;
    for (let j = start; j < end; j++) {
      const ratio = (j - start) / gradientWidth;
      color[0] = Math.round(startColor[0] * (1 - ratio) + endColor[0] * ratio);
      color[1] = Math.round(startColor[1] * (1 - ratio) + endColor[1] * ratio);
      color[2] = Math.round(startColor[2] * (1 - ratio) + endColor[2] * ratio);
      frequencyRanges[j].binColor = [...color];
    }
  }
}
export function colorForBin(bin: number): number[] {
  return frequencyRanges[bin].binColor ?? [156, 163, 175];
}

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
const noteFrequencies = [
  { note: "C0", frequency: 16.35 },
  { note: "C#0", frequency: 17.32 },
  { note: "D0", frequency: 18.35 },
  { note: "D#0", frequency: 19.45 },
  { note: "E0", frequency: 20.6 },
  { note: "F0", frequency: 21.83 },
  { note: "F#0", frequency: 23.12 },
  { note: "G0", frequency: 24.5 },
  { note: "G#0", frequency: 25.96 },
  { note: "A0", frequency: 27.5 },
  { note: "A#0", frequency: 29.14 },
  { note: "B0", frequency: 30.87 },
  { note: "C1", frequency: 32.7 },
  { note: "C#1", frequency: 34.65 },
  { note: "D1", frequency: 36.71 },
  { note: "D#1", frequency: 38.89 },
  { note: "E1", frequency: 41.2 },
  { note: "F1", frequency: 43.65 },
  { note: "F#1", frequency: 46.25 },
  { note: "G1", frequency: 49.0 },
  { note: "G#1", frequency: 51.91 },
  { note: "A1", frequency: 55.0 },
  { note: "A#1", frequency: 58.27 },
  { note: "B1", frequency: 61.74 },
  { note: "C2", frequency: 65.41 },
  { note: "C#2", frequency: 69.3 },
  { note: "D2", frequency: 73.42 },
  { note: "D#2", frequency: 77.78 },
  { note: "E2", frequency: 82.41 },
  { note: "F2", frequency: 87.31 },
  { note: "F#2", frequency: 92.5 },
  { note: "G2", frequency: 98.0 },
  { note: "G#2", frequency: 103.83 },
  { note: "A2", frequency: 110.0 },
  { note: "A#2", frequency: 116.54 },
  { note: "B2", frequency: 123.47 },
  { note: "C3", frequency: 130.81 },
  { note: "C#3", frequency: 138.59 },
  { note: "D3", frequency: 146.83 },
  { note: "D#3", frequency: 155.56 },
  { note: "E3", frequency: 164.81 },
  { note: "F3", frequency: 174.61 },
  { note: "F#3", frequency: 185.0 },
  { note: "G3", frequency: 196.0 },
  { note: "G#3", frequency: 207.65 },
  { note: "A3", frequency: 220.0 },
  { note: "A#3", frequency: 233.08 },
  { note: "B3", frequency: 246.94 },
  { note: "C4", frequency: 261.63 },
  { note: "C#4", frequency: 277.18 },
  { note: "D4", frequency: 293.66 },
  { note: "D#4", frequency: 311.13 },
  { note: "E4", frequency: 329.63 },
  { note: "F4", frequency: 349.23 },
  { note: "F#4", frequency: 369.99 },
  { note: "G4", frequency: 392.0 },
  { note: "G#4", frequency: 415.3 },
  { note: "A4", frequency: 440.0 },
  { note: "A#4", frequency: 466.16 },
  { note: "B4", frequency: 493.88 },
  { note: "C5", frequency: 523.25 },
  { note: "C#5", frequency: 554.37 },
  { note: "D5", frequency: 587.33 },
  { note: "D#5", frequency: 622.25 },
  { note: "E5", frequency: 659.26 },
  { note: "F5", frequency: 698.46 },
  { note: "F#5", frequency: 739.99 },
  { note: "G5", frequency: 783.99 },
  { note: "G#5", frequency: 830.61 },
  { note: "A5", frequency: 880.0 },
  { note: "A#5", frequency: 932.33 },
  { note: "B5", frequency: 987.77 },
  { note: "C6", frequency: 1046.5 },
  { note: "C#6", frequency: 1108.73 },
  { note: "D6", frequency: 1174.66 },
  { note: "D#6", frequency: 1244.51 },
  { note: "E6", frequency: 1318.51 },
  { note: "F6", frequency: 1396.91 },
  { note: "F#6", frequency: 1479.98 },
  { note: "G6", frequency: 1567.98 },
  { note: "G#6", frequency: 1661.22 },
  { note: "A6", frequency: 1760.0 },
  { note: "A#6", frequency: 1864.66 },
  { note: "B6", frequency: 1975.53 },
  { note: "C7", frequency: 2093.0 },
  { note: "C#7", frequency: 2217.46 },
  { note: "D7", frequency: 2349.32 },
  { note: "D#7", frequency: 2489.02 },
  { note: "E7", frequency: 2637.02 },
  { note: "F7", frequency: 2793.83 },
  { note: "F#7", frequency: 2959.96 },
  { note: "G7", frequency: 3135.96 },
  { note: "G#7", frequency: 3322.44 },
  { note: "A7", frequency: 3520.0 },
  { note: "A#7", frequency: 3729.31 },
  { note: "B7", frequency: 3951.07 },
  { note: "C8", frequency: 4186.01 },
  { note: "C#8", frequency: 4434.92 },
  { note: "D8", frequency: 4698.64 },
  { note: "D#8", frequency: 4978.03 },
  { note: "E8", frequency: 5274.04 },
  { note: "F8", frequency: 5587.65 },
  { note: "F#8", frequency: 5919.91 },
  { note: "G8", frequency: 6271.93 },
  { note: "G#8", frequency: 6644.88 },
  { note: "A8", frequency: 7040.0 },
  { note: "A#8", frequency: 7458.62 },
  { note: "B8", frequency: 7902.13 },
  { note: "C9", frequency: 8372.02 },
  { note: "C#9", frequency: 8869.84 },
  { note: "D9", frequency: 9397.27 },
  { note: "D#9", frequency: 9956.06 },
  { note: "E9", frequency: 10548.08 },
  { note: "F9", frequency: 11175.3 },
  { note: "F#9", frequency: 11839.82 },
  { note: "G9", frequency: 12543.86 },
  { note: "G#9", frequency: 13289.75 },
  { note: "A9", frequency: 14080.0 },
  { note: "A#9", frequency: 14917.24 },
  { note: "B9", frequency: 15804.26 },
  { note: "C10", frequency: 16744.04 },
  { note: "C#10", frequency: 17739.68 },
  { note: "D10", frequency: 18794.55 },
  { note: "D#10", frequency: 19912.12 },
  { note: "E10", frequency: 21096.16 },
];
export function getNoteForFrequency(frequency: number): string {
  const closestNote = noteFrequencies.reduce((prev, curr) =>
    Math.abs(curr.frequency - frequency) < Math.abs(prev.frequency - frequency)
      ? curr
      : prev,
  );
  return closestNote.note;
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
