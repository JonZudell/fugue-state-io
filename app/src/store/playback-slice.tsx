import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FileState } from "@/store/filesSlice";
import { setVideoEnabled } from "@/store/display-slice";
import { Channels } from "@/lib/dsp";
import { EventCallbackReturn } from "abcjs";
interface Progress {
  channel: keyof Channels;
  progress: number;
}

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
  progess: Progress[];
  notationList: string[];
  timingCallbacks: ((ev: EventCallbackReturn) => EventCallbackReturn) | null;
  changedSelection: {start: number, end: number};
  noteTimings: { [key: string]: number };
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
  progess: [],
  notationList: [],
  timingCallbacks: null,
  changedSelection: {start: 0, end: 0},
  noteTimings: {},
};

export const selectMedia = (state: { playback: { media: FileState } }) =>
  state.playback.media;
export const selectTimingCallbacks = (state: {
  playback: { timingCallbacks: ((ev: EventCallbackReturn) => void)[] };
}) => state.playback.timingCallbacks;
export const selectNoteTimings = (state: {
  playback: { noteTimings: { [key: string]: number } };
}) => state.playback.noteTimings;
export const selectChangedSelection = (state: {
  playback: { changedSelection: { start: number; end: number } };
}) => state.playback.changedSelection;
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
export const selectProgress = (state: { playback: { progess: Progress[] } }) =>
  state.playback.progess;
export const selectProcessing = (state: {
  playback: { processing: boolean };
}) => state.playback.processing;
export const selectMode = (state: { playback: { mode: "mono" | "stereo" } }) =>
  state.playback.mode;
export const selectNotationList = (state: {
  playback: { notationList: string[] };
}) => state.playback.notationList;

export const uploadFile = createAsyncThunk(
  "playback/uploadFile",
  async ({ file, worker }: { file: File; worker: Worker }, { dispatch }) => {
    return new Promise<FileState>(async (_resolve, _reject) => {
      dispatch(setProcessing(true));
      if (!file.type.startsWith("video")) {
        dispatch(setVideoEnabled(false));
      }
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
        sampleRate: 44100
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
        const framesNeeded = (leftChannel.length / 2048 - 1) * 8 * 4;
        console.log(`Frames needed: ${framesNeeded}`);
        dispatch(setProgress({ channel: "mono", progress: 0 }));
        dispatch(setProgress({ channel: "side", progress: 0 }));
        dispatch(setProgress({ channel: "left", progress: 0 }));
        dispatch(setProgress({ channel: "right", progress: 0 }));
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
        dispatch(setProgress({ channel: "mono", progress: 0 }));
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
    setNotationList: (
      state: PlaybackState,
      action: PayloadAction<string[]>,
    ) => {
      state.notationList = action.payload;
    },
    setChangedSelection: (
      state: PlaybackState,
      action: PayloadAction<{ start: number; end: number }>,
    ) => {
      state.changedSelection = action.payload;
    },
    setNoteTimings: (
      state: PlaybackState,
      action: PayloadAction<{ [key: string]: number }>,
    ) => {
      state.noteTimings = action.payload;
    },
    setMedia: (state: PlaybackState, action: PayloadAction<FileState>) => {
      state.media = action.payload;
    },
    setProgress: (
      state: PlaybackState,
      action: PayloadAction<{ channel: keyof Channels; progress: number }>,
    ) => {
      const progressIndex = state.progess.findIndex(
        (progress) => progress.channel === action.payload.channel,
      );
      if (progressIndex === -1) {
        state.progess.push(action.payload);
      } else {
        state.progess[progressIndex] = action.payload;
      }
    },
    setTimingCallbacks: (
      state: PlaybackState,
      action: PayloadAction<((ev: any) => EventCallbackReturn)>,
    ) => {
      state.timingCallbacks = action.payload;
    },
    setChannelSummary: (
      state: PlaybackState,
      action: PayloadAction<{ summary: Float32Array; channel: keyof Channels }>,
    ) => {
      if (!state.media || !state.media.summary) {
        return;
      }
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
  setProgress,
  restartPlayback,
  setNotationList,
  setTimingCallbacks,
  setChangedSelection,
  setNoteTimings,
} = playbackSlice.actions;
export default playbackSlice.reducer;
