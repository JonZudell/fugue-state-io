import FFT from 'fft.js';
const SAMPLE_RATE = 44100;
const SAMPLE_BIN_SIZE = 2048;
const HALF_SAMPLE_BIN_SIZE = Math.floor(SAMPLE_BIN_SIZE / 2);
const fft = new FFT(SAMPLE_BIN_SIZE);

type Frame = {
  start: number;
  end: number;
  data: number[];
};  

type SummarizedFrame = {
  max: number;
  min: number;
  avg: number;
  fft: number[];
};

export type Channels = {
  mono: SummarizedFrame[];
  left?: SummarizedFrame[];
  right?: SummarizedFrame[];
  side?: SummarizedFrame[];
};

function frameFromSlice(array: number[], start: number, end: number): Frame {
  const data = Array.from(array.slice(start, end))
  const fft1: number[] = new Array(Math.pow(2, Math.ceil(Math.log2(data.length)))).fill(0);
  fft.transform(fft1, data);
  return {
    data: data,
    start: start,
    end: end
  };
}

function interleavedFramesFromChannelData(data: number[]): Frame[] {
  const frames: Frame[] = [];
  const interpolatedFrameCount = data.length / HALF_SAMPLE_BIN_SIZE;

  for (let i = 0; i < interpolatedFrameCount; i++) {
    const start = i * HALF_SAMPLE_BIN_SIZE;
    const end = Math.min((i * HALF_SAMPLE_BIN_SIZE) + SAMPLE_BIN_SIZE, data.length);
    const frame = frameFromSlice(data, start, end);
    frames.push(frame);
  }
  console.log('interleavedFrames:', frames);
  return frames;
}

function summarizeFrame(frame: Frame): SummarizedFrame {
  const count = frame.data.length;
  const max = Math.max(...frame.data);
  const min = Math.min(...frame.data);
  const avg = frame.data.reduce((a, b) => a + b, 0) / count;
  const input: number[] = new Array(SAMPLE_BIN_SIZE).fill(0);
  const output: number[] = new Array(SAMPLE_BIN_SIZE).fill(0);
  frame.data.forEach((value, index) => {
    input[index] = value;
  });
  fft.realTransform(output, input);
  return {
    max: max,
    min: min,
    avg: avg,
    fft: output
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
    thisFrame.fft = lastFrame.fft.map((value, index) => (value + summarizedFrame.fft[index]) / 2);

  
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
  console.debug('ArrayBuffer length:', arrayBuffer.byteLength);

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  console.debug('AudioBuffer duration:', audioBuffer.duration);
  console.debug('AudioBuffer number of channels:', audioBuffer.numberOfChannels);

  if (audioBuffer.numberOfChannels > 2) {
    throw new Error("Only mono and stereo files are supported");
  } else if (audioBuffer.numberOfChannels === 1) {
    const interleavedFrames: Frame[] = interleavedFramesFromChannelData(Array.from(audioBuffer.getChannelData(0)));
    console.debug('Interleaved frames length (mono):', interleavedFrames.length);

    const mono: SummarizedFrame[] = summarizeInterleavedFrames(interleavedFrames);
    console.debug('Summarized frames length (mono):', mono.length);

    return {mono: mono};
  } else {
    const leftInterleaved: Frame[] = interleavedFramesFromChannelData(Array.from(audioBuffer.getChannelData(0)));
    const rightInterleaved: Frame[] = interleavedFramesFromChannelData(Array.from(audioBuffer.getChannelData(1)));
    console.debug('Interleaved frames length (left):', leftInterleaved.length);
    console.debug('Interleaved frames length (right):', rightInterleaved.length);

    const left: SummarizedFrame[] = summarizeInterleavedFrames(leftInterleaved);
    const right: SummarizedFrame[] = summarizeInterleavedFrames(rightInterleaved);
    console.debug('Summarized frames length (left):', left.length);
    console.debug('Summarized frames length (right):', right.length);

    const midChannel: Float32Array = new Float32Array(leftInterleaved.length);
    const sideChannel: Float32Array = new Float32Array(leftInterleaved.length);
    midChannel.forEach((value, index) => {
      midChannel[index] = (leftInterleaved[index].data[index] + rightInterleaved[index].data[index]) / 2;}
    );
    sideChannel.forEach((value, index) => {
      sideChannel[index] = (leftInterleaved[index].data[index] - rightInterleaved[index].data[index]) / 2;}
    );
    console.debug('Mid channel length:', midChannel.length);
    console.debug('Side channel length:', sideChannel.length);

    const mid: SummarizedFrame[] = summarizeInterleavedFrames(leftInterleaved);
    const side: SummarizedFrame[] = summarizeInterleavedFrames(rightInterleaved);
    console.debug('Summarized frames length (mid):', mid.length);
    console.debug('Summarized frames length (side):', side.length);

    return {mono: mid, left: left, right: right, side: side};
  }
}