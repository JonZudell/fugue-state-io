import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addFile, FileState } from "../store/filesSlice";
interface PlaybackState {
  media: FileState | null;
  playing: boolean;
  looping: boolean;
  timeElapsed: number;
  speed: number;
  volume: number;
  loopStart: number;
  loopEnd: number;
}

const initialState: PlaybackState = {
  media: null,
  playing: false,
  looping: false,
  timeElapsed: 0,
  speed: 1,
  volume: 1,
  loopStart: 0,
  loopEnd: 0,
};

export const selectMedia = (state: { playback: { media: FileState } }) =>
  state.playback.media;
export const selectVolume = (state: { playback: { volume: number } }) =>
  state.playback.volume;
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

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    setMedia: (state: PlaybackState, action: PayloadAction<FileState>) => {
      state.media = action.payload;
    },
    setVolume: (state: PlaybackState, action: PayloadAction<number>) => {
      state.volume = Math.min(Math.max(0, action.payload), 1);
    },
    setSpeed: (state: PlaybackState, action: PayloadAction<number>) => {
      state.speed = Math.min(Math.max(0.2, action.payload), 2);
    },
    setTimeElapsed: (state: PlaybackState, action: PayloadAction<number>) => {
      if (
        state.media &&
        action.payload >= state.loopEnd * state.media.duration &&
        state.looping
      ) {
        state.timeElapsed = state.loopStart * state.media.duration;
        state.playing = false; // Pause the video
        setTimeout(() => {
          state.playing = true; // Play the video after setting the time
        }, 0);
      } else if (
        state.media &&
        action.payload < state.loopStart * state.media.duration &&
        state.looping
      ) {
        state.timeElapsed = state.loopStart * state.media.duration;
      } else if (state.media && action.payload >= state.media.duration) {
        state.timeElapsed = state.media.duration;
        state.playing = false;
      } else {
        state.timeElapsed = action.payload;
      }
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
  restartPlayback,
} = playbackSlice.actions;
export default playbackSlice.reducer;
