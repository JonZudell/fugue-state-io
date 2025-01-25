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
