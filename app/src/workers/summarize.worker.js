const SAMPLE_BIN_SIZE = 4096;
const HALF_SAMPLE_BIN_SIZE = Math.floor(SAMPLE_BIN_SIZE / 2);
const WINDOW_FUNCTION = "hamming";

function applyWindowFunction(data, windowType) {
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

function radix_4_fft(input) {
  try {
    const N = input.length;
    if (N <= 1) return input;

    // Handle radix-2 case
    if (N === 2) {
      return [input[0] + input[1], input[0] - input[1]];
    }

    // Ensure the input length is a power of 4
    if ((N & (N - 1)) !== 0 || (N & 0x55555555) !== N) {
      throw new Error("Input length must be a power of 4");
    }

    // Split the input into four smaller arrays
    const even = [],
      odd = [],
      even2 = [],
      odd2 = [];
    for (let i = 0; i < N / 4; i++) {
      even.push(input[4 * i]);
      odd.push(input[4 * i + 1]);
      even2.push(input[4 * i + 2]);
      odd2.push(input[4 * i + 3]);
    }

    // Recursively apply the radix-4 FFT to the smaller arrays
    const evenFFT = radix_4_fft(even);
    const oddFFT = radix_4_fft(odd);
    const even2FFT = radix_4_fft(even2);
    const odd2FFT = radix_4_fft(odd2);

    // Combine the results using the butterfly operations
    const result = new Array(N);
    for (let k = 0; k < N / 4; k++) {
      const t0 = evenFFT[k];
      const t1 = oddFFT[k];
      const t2 = even2FFT[k];
      const t3 = odd2FFT[k];

      const twiddle1 = Math.exp((-2 * Math.PI * k) / N);
      const twiddle2 = Math.exp((-4 * Math.PI * k) / N);
      const twiddle3 = Math.exp((-6 * Math.PI * k) / N);

      result[k] = t0 + twiddle1 * t1 + twiddle2 * t2 + twiddle3 * t3;
      result[k + N / 4] = t0 - twiddle1 * t1 + twiddle2 * t2 - twiddle3 * t3;
      result[k + N / 2] = t0 + twiddle1 * t1 - twiddle2 * t2 - twiddle3 * t3;
      result[k + (3 * N) / 4] =
        t0 - twiddle1 * t1 - twiddle2 * t2 + twiddle3 * t3;
    }

    return result;
  } catch (error) {
    throw error;
  }
}
function frameFromSlice(array, start, end) {
  const data = array.slice(start, end);
  return {
    data: data,
    start: start,
    end: end,
  };
}
function interleavedFramesFromChannelData(data) {
  try {
    data = new Float32Array(data);
    const frames = [];
    const interpolatedFrameCount = data.length / HALF_SAMPLE_BIN_SIZE;
    console.log("Interpolated frame count:", interpolatedFrameCount);
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
  } catch (error) {
    console.error("Error in interleavedFramesFromChannelData:", error);
    throw error;
  }
}

function summarizeFrame(frame) {
  try {
    const count = frame.data.length;
    const max = Math.max(...frame.data);
    const min = Math.min(...frame.data);
    const avg = frame.data.reduce((a, b) => a + b, 0) / count;
    const input = new Array(SAMPLE_BIN_SIZE).fill(0);
    // Apply windowing function before transforming
    const windowedData = applyWindowFunction(frame.data, WINDOW_FUNCTION);

    windowedData.forEach((value, index) => {
      input[index] = value;
    });
    const output = radix_4_fft(input);
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
  } catch (error) {
    console.error("Error in summarizeFrame:", error);
    throw error;
  }
}

function summarizeInterleavedFrames(frames, channel, id, postMessage) {
  try {
    console.log("Summarizing frames", frames);
    let lastFrame = summarizeFrame(frames[0]);
    postMessage({
      type: "CHANNEL_PROGRESS",
      id: id,
      channel: channel,
      progress: 0,
    });

    const summarizedFrames = [];

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
      if (ndx % 100 === 0) {
        postMessage({
          type: "CHANNEL_PROGRESS",
          channel: channel,
          progress: ndx / frames.length,
          id: id,
        });
      }
      ndx++;
    }
    return summarizedFrames;
  } catch (error) {
    console.error("Error in summarizeInterleavedFrames:", error);
    throw error;
  }
}

function process(arrayBuffer, channel, id, postMessage) {
  try {
    console.log("Processing arrayBuffer:", arrayBuffer, channel);
    const frames = interleavedFramesFromChannelData(arrayBuffer);
    console.log("Interleaved frames:", frames, channel);
    const summarizedFrames = summarizeInterleavedFrames(
      frames,
      channel,
      id,
      postMessage,
    );
    postMessage({
      type: "CHANNEL_PROGRESS",
      channel: channel,
      id: id,
      progress: 1,
    });
    postMessage({
      type: "SUMMARIZED",
      summary: summarizedFrames,
      id: id,
      channel: channel,
    });
  } catch (error) {
    console.error(
      "Error in process_file (audioContext.decodeAudioData):",
      error,
    );
    postMessage({ type: "error", error });
  }
}
function checkReady(postMessage) {
  try {
    postMessage({ type: "READY" });
  } catch (error) {
    console.error("Error in checkReady:", error);
    postMessage({ type: "error", error });
  }
}

self.addEventListener("message", (event) => {
  try {
    console.log("Worker received message:", event.data);
    if (event.data && event.data.type === "SUMMARIZE") {
      process(
        event.data.arrayBuffer,
        event.data.channel,
        event.data.mediaId,
        self.postMessage,
      );
    } else if (event.data && event.data.type === "CHECK_READY") {
      checkReady(self.postMessage);
    }
  } catch (error) {
    console.error("Error in message event listener:", error);
    self.postMessage({ type: "error", error });
  }
});
