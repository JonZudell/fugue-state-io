import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MediaFile } from "@/store/project-slice";
import { setMinimapSource } from "./display-slice";

interface MediaSource {
  id: string;
}

interface PlaybackState {
  audioContext: AudioContext | null;
  mediaSources: MediaSource[];
  playing: boolean;
  looping: boolean;
  timeElapsed: number;
  timelineDuration: number;
  speed: number;
  volume: number;
  loopStart: number;
  loopEnd: number;
  mode: "mono" | "stereo";
}

const initialState: PlaybackState = {
  audioContext: null,
  mediaSources: [],
  playing: false,
  looping: false,
  timeElapsed: 0,
  timelineDuration: 0,
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
      if (state.timeElapsed < state.loopStart * state.timelineDuration) {
        state.timeElapsed = state.loopStart * state.timelineDuration;
      }
    },
    setLoopEnd: (state: PlaybackState, action: PayloadAction<number>) => {
      state.loopEnd = action.payload;
      if (
        state.looping &&
        state.timeElapsed > state.loopEnd * state.timelineDuration
      ) {
        state.timeElapsed = state.loopEnd * state.timelineDuration;
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
      state.timeElapsed = state.loopStart * state.timelineDuration;
      state.playing = true;
    },
    registerMedia: (state: PlaybackState, action: PayloadAction<MediaFile>) => {
      if (
        state.mediaSources.find((source) => source.id === action.payload.id)
      ) {
        return;
      } else {
        state.mediaSources.push({
          id: action.payload.id,
        });
        if (action.payload.duration > state.timelineDuration) {
          state.timelineDuration = action.payload.duration;
        }
      }
    },
  },
});

export const {
  setVolume,
  setSpeed,
  setPlaying,
  setTimeElapsed,
  setLoopStart,
  setLoopEnd,
  setLooping,
  setMode,
  restartPlayback,
  registerMedia,
} = playbackSlice.actions;
export default playbackSlice.reducer;
