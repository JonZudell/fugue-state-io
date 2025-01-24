import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { MediaFile } from "@/store/project-slice";
import { setVideoEnabled, setLayout, setOrder } from "@/store/display-slice";
import { Channels } from "@/lib/dsp";
import { v4 as uuidv4 } from "uuid";

interface PlaybackState {
  audioContext: AudioContext | null;
  media: MediaFile | null;
  playing: boolean;
  looping: boolean;
  timeElapsed: number;
  speed: number;
  volume: number;
  loopStart: number;
  loopEnd: number;
  mode: "mono" | "stereo";
}

const initialState: PlaybackState = {
  audioContext: null,
  media: null,
  playing: false,
  looping: false,
  timeElapsed: 0,
  speed: 1,
  volume: 1,
  loopStart: 0,
  loopEnd: 1,
  mode: "stereo",
};

export const selectPlayback = (state: { playback: PlaybackState }) =>
  state.playback;

export const uploadFile = createAsyncThunk(
  "playback/uploadFile",
  async ({ file, worker }: { file: File; worker: Worker }, { dispatch }) => {
    return new Promise<MediaFile>(async (_resolve, _reject) => {
      const id = uuidv4();
      if (file.type.startsWith("video")) {
        dispatch(setVideoEnabled(true));
      }
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(
        await file.arrayBuffer(),
      );
      const isStereo = audioBuffer.numberOfChannels > 1;
      console.log(`Audio buffer is ${isStereo ? "stereo" : "mono"}`);
      const media: MediaFile = {
        id: id,
        name: file.name,
        fileType: file.type,
        url: (() => {
          try {
            return URL.createObjectURL(new Blob([file], { type: file.type }));
          } catch (error) {
            console.error("Failed to create object URL", error);
            return "";
          }
        })(),
        duration: audioBuffer.duration,
        summary: { left: null, right: null, mono: null, side: null },
        sampleRate: 44100,
        processing: true,
        progress: isStereo
          ? [
              { channel: "left", progress: 0 },
              { channel: "right", progress: 0 },
              { channel: "mono", progress: 0 },
              { channel: "side", progress: 0 },
            ]
          : [{ channel: "mono", progress: 0 }],
      };

      if (file.type.startsWith("video")) {
        dispatch(setVideoEnabled(true));
        dispatch(setOrder(["video", "fourier", "notation"]));
        dispatch(setLayout("side-by-side-right-stacked"));
      } else {
        dispatch(setVideoEnabled(false));
        dispatch(setOrder(["fourier", "notation"]));
        dispatch(setLayout("stacked"));
      }

      dispatch(setMedia(media));
      if (isStereo) {
        const leftChannel = audioBuffer.getChannelData(0);
        const rightChannel = audioBuffer.getChannelData(1);
        const monoChannel = new Float32Array(leftChannel.length);
        const sideChannel = new Float32Array(leftChannel.length);
        for (let i = 0; i < leftChannel.length; i++) {
          monoChannel[i] = (leftChannel[i] + rightChannel[i]) / 2;
        }
        for (let i = 0; i < leftChannel.length; i++) {
          sideChannel[i] = leftChannel[i] - rightChannel[i] / 2;
        }
        const framesNeeded = (leftChannel.length / 2048 - 1) * 8 * 4;
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: monoChannel.buffer,
          channel: "mono",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: sideChannel.buffer,
          channel: "side",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: leftChannel.buffer,
          channel: "left",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: rightChannel.buffer,
          channel: "right",
        });
      } else {
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: audioBuffer.getChannelData(0).buffer,
          channel: "mono",
        });
      }
    });
  },
);

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    setAudioContext: (
      state: PlaybackState,
      action: PayloadAction<AudioContext>,
    ) => {
      state.audioContext = action.payload;
    },
    setMedia: (state: PlaybackState, action: PayloadAction<MediaFile>) => {
      state.media = action.payload;
    },
    setChannelSummary: (
      state: PlaybackState,
      action: PayloadAction<{
        summary: Float32Array;
        id: string;
        channel: keyof Channels;
      }>,
    ) => {
      if (!state.media || !state.media.summary) {
        return;
      }
      (state.media.summary as any)[action.payload.channel] =
        action.payload.summary;
    },
    setProgress: (
      state: PlaybackState,
      action: PayloadAction<{ id: string; channel: string; progress: number }>,
    ) => {
      if (!state.media || !state.media.progress) {
        return;
      }
      const progress = state.media.progress.find(
        (p) =>
          p.channel === action.payload.channel && p.id === action.payload.id,
      );
      if (progress) {
        progress.progress = action.payload.progress;
      }
    },
    setVolume: (state: PlaybackState, action: PayloadAction<number>) => {
      state.volume = Math.min(Math.max(0, action.payload), 1);
    },
    setSpeed: (state: PlaybackState, action: PayloadAction<number>) => {
      state.speed = Math.min(Math.max(0.2, action.payload), 2);
    },
    setTimeElapsed: (state: PlaybackState, action: PayloadAction<number>) => {
      state.timeElapsed = action.payload;
    },
    setPlaying: (state: PlaybackState, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
    setLoopStart: (state: PlaybackState, action: PayloadAction<number>) => {
      state.loopStart = action.payload;
      if (
        state.looping &&
        state.media &&
        state.timeElapsed < state.loopStart * state.media.duration
      ) {
        state.timeElapsed = state.loopStart * state.media.duration;
      }
    },
    setLoopEnd: (state: PlaybackState, action: PayloadAction<number>) => {
      state.loopEnd = action.payload;
      if (
        state.looping &&
        state.media &&
        state.timeElapsed > state.loopEnd * state.media!.duration
      ) {
        state.timeElapsed = state.loopEnd * state.media.duration;
      }
    },
    setLooping: (state: PlaybackState, action: PayloadAction<boolean>) => {
      state.looping = action.payload;
      if (state.looping) {
        state.loopStart = 0;
        state.loopEnd = 1;
      }
    },
    setMode: (
      state: PlaybackState,
      action: PayloadAction<"mono" | "stereo">,
    ) => {
      state.mode = action.payload;
    },
    restartPlayback: (state: PlaybackState) => {
      if (state.media) {
        state.timeElapsed = state.loopStart * state.media.duration;
        state.playing = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.media = action.payload;
    });
  },
});

export const {
  setMedia,
  setVolume,
  setSpeed,
  setPlaying,
  setTimeElapsed,
  setLoopStart,
  setLoopEnd,
  setLooping,
  setMode,
  setChannelSummary,
  restartPlayback,
} = playbackSlice.actions;
export default playbackSlice.reducer;
