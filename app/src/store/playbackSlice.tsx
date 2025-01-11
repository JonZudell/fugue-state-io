import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FileState } from "../store/filesSlice";
import { generateWaveformSummary } from "@/core/waveformSummary";
import { setVideoEnabled } from "./displaySlice";

interface PlaybackState {
  audioContext: AudioContext | null;
  media: FileState | null;
  playing: boolean;
  looping: boolean;
  timeElapsed: number;
  speed: number;
  volume: number;
  loopStart: number;
  loopEnd: number;
  processing: boolean;
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
  processing: false,
  mode: "stereo",
};

export const selectMedia = (state: { playback: { media: FileState } }) =>
  state.playback.media;
export const selectAudioContext = (state: {
  playback: { audioContext: AudioContext };
}) => state.playback.audioContext;
export const selectVolume = (state: { playback: { volume: number } }) =>
  state.playback.volume;
export const selectSpeed = (state: { playback: { speed: number } }) =>
  state.playback.speed;
export const selectPlaying = (state: { playback: { playing: boolean } }) =>
  state.playback.playing;
export const selectTimeElapsed = (state: {
  playback: { timeElapsed: number };
}) => state.playback.timeElapsed;
export const selectLoopStart = (state: { playback: { loopStart: number } }) =>
  state.playback.loopStart;
export const selectLoopEnd = (state: { playback: { loopEnd: number } }) =>
  state.playback.loopEnd;
export const selectLooping = (state: { playback: { looping: boolean } }) =>
  state.playback.looping;
export const selectProcessing = (state: {
  playback: { processing: boolean };
}) => state.playback.processing;
export const selectMode = (state: { playback: { mode: "mono" | "stereo" } }) =>
  state.playback.mode;
export const uploadFile = createAsyncThunk(
  "playback/uploadFile",
  async ({ file, worker }: { file: File; worker: Worker }, { dispatch }) => {
    return new Promise<FileState>(async (resolve, reject) => {
      dispatch(setProcessing(true));
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(
        await file.arrayBuffer(),
      );
      const isStereo = audioBuffer.numberOfChannels > 1;
      console.log(`Audio buffer is ${isStereo ? "stereo" : "mono"}`);
      const media: FileState = {
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
      };

      dispatch(setMedia(media));
      if (isStereo) {
        console.log("Generating stereo summary");
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
    setMedia: (state: PlaybackState, action: PayloadAction<FileState>) => {
      state.media = action.payload;
    },
    setChannelSummary: (
      state: PlaybackState,
      action: PayloadAction<{ summary: Float32Array; channel: keyof Channels }>,
    ) => {
      (state.media.summary as any)[action.payload.channel] =
        action.payload.summary;
      if (state.mode === "stereo") {
        if (
          state.media.summary.left &&
          state.media.summary.right &&
          state.media.summary.mono &&
          state.media.summary.side
        ) {
          state.processing = false;
        } else {
          console.log("Still processing");
        }
      } else {
        state.processing = false;
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
    setProcessing: (state: PlaybackState, action: PayloadAction<boolean>) => {
      state.processing = action.payload;
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
  setProcessing,
  setMode,
  setChannelSummary,
  restartPlayback,
} = playbackSlice.actions;
export default playbackSlice.reducer;
