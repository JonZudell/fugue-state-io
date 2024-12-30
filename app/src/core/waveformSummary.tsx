export type TreeNode = {
  max: number;
  min: number;
  avg: number;
  count: number;
  sampleStart: number;
  sampleEnd: number;
  left?: TreeNode;
  right?: TreeNode;
};

export type Channels = {
  mono: TreeNode;
  left?: TreeNode;
  right?: TreeNode;
  side?: TreeNode;
};

export type Summary = {
  stereo: boolean;
  channels: Channels;
  sampleRate: number;
  duration: number;
};
const TREE_SAMPLE_RATE = 2048;
export async function generateWaveformSummary(
  audioContext: AudioContext,
  file: File,
): Promise<Summary> {
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  if (audioBuffer.numberOfChannels > 2) {
    throw new Error("Only mono and stereo files are supported");
  } else if (audioBuffer.numberOfChannels === 1) {
    const tree = await constructTree(
      audioBuffer.getChannelData(0),
      TREE_SAMPLE_RATE,
      0,
      audioBuffer.getChannelData(0).length,
      0,
      "mono",
    );
    const summary: Summary = {
      stereo: false,
      channels: { mono: tree },
      sampleRate: audioBuffer.sampleRate,
      duration: audioBuffer.duration,
    };
    return summary;
  } else {
    const channelOne = audioBuffer.getChannelData(0);
    const channelTwo = audioBuffer.getChannelData(1);
    const channelMid = channelOne.map(
      (value, index) => (value + channelTwo[index]) / 2,
    );
    const channelSide = channelOne.map(
      (value, index) => (value - channelTwo[index]) / 2,
    );
    const summary: Summary = {
      stereo: true,
      channels: {
        mono: await constructTree(
          channelMid,
          TREE_SAMPLE_RATE,
          0,
          audioBuffer.getChannelData(0).length,
          0,
          "mono",
        ),
        left: await constructTree(
          channelOne,
          TREE_SAMPLE_RATE,
          0,
          audioBuffer.getChannelData(0).length,
          0,
          "left",
        ),
        right: await constructTree(
          channelTwo,
          TREE_SAMPLE_RATE,
          0,
          audioBuffer.getChannelData(0).length,
          0,
          "right",
        ),
        side: await constructTree(
          channelSide,
          TREE_SAMPLE_RATE,
          0,
          audioBuffer.getChannelData(0).length,
          0,
          "side",
        ),
      },
      sampleRate: audioBuffer.sampleRate,
      duration: audioBuffer.duration,
    };
    return summary;
  }
}

async function constructTree(
  data: Float32Array<ArrayBufferLike>,
  minSamples: number,
  startTime: number,
  endTime: number,
  depth: number = 0,
  channel: string,
): Promise<TreeNode> {
  if (data.length <= minSamples) {
    const node = {
      max: Math.max(...data),
      min: Math.min(...data),
      avg: data.reduce((a, b) => a + b, 0) / data.length,
      count: data.length,
      sampleStart: startTime,
      sampleEnd: endTime,
    };
    return node;
  } else {
    const midIndex = Math.floor(data.length / 2);
    const midTime = (startTime + endTime) / 2;
    const left = await constructTree(
      data.slice(0, midIndex),
      minSamples,
      startTime,
      midTime,
      depth + 1,
      channel,
    );
    const right = await constructTree(
      data.slice(midIndex),
      minSamples,
      midTime,
      endTime,
      depth + 1,
      channel,
    );
    const node = {
      max: Math.max(left.max, right.max),
      min: Math.min(left.min, right.min),
      avg:
        (left.avg * left.count + right.avg * right.count) /
        (left.count + right.count),
      count: left.count + right.count,
      sampleStart: startTime,
      sampleEnd: endTime,
      left: left,
      right: right,
    };
    return node;
  }
}

export function getSlice(
  tree: TreeNode,
  start: number,
  end: number,
): { high: number; low: number; avg: number } {
  if (tree.sampleEnd - tree.sampleStart <= TREE_SAMPLE_RATE) {
    return {
      high: tree.max,
      low: tree.min,
      avg: tree.avg,
    };
  }

  const mid = (tree.sampleStart + tree.sampleEnd) / 2;

  if (start >= mid) {
    if (!tree.right) throw new Error("Right child is undefined");
    return getSlice(tree.right, start, end);
  } else if (end <= mid) {
    if (!tree.left) throw new Error("Left child is undefined");
    return getSlice(tree.left, start, end);
  } else {
    if (!tree.left || !tree.right)
      throw new Error("Left or right child is undefined");
    const leftSlice = getSlice(tree.left, start, mid);
    const rightSlice = getSlice(tree.right, mid, end);
    return {
      high: Math.max(leftSlice.high, rightSlice.high),
      low: Math.min(leftSlice.low, rightSlice.low),
      avg:
        (leftSlice.avg * (mid - start) + rightSlice.avg * (end - mid)) /
        (end - start),
    };
  }
}
