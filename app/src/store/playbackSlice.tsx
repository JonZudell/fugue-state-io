import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileState } from "../store/filesSlice";
interface PlaybackState {
  media: FileState | null;
  playing: boolean;
  timeElapsed: number;
  speed: number;
  volume: number;
}

const initialState: PlaybackState = {
  media: null,
  playing: true,
  timeElapsed: 0,
  speed: 1,
  volume: 1,
};
// Define a memoized selector to get the list of files
export const selectMedia = (state: { playback: { media: FileState } }) =>
  state.playback.media;
export const selectVolume = (state: { playback: { volume: number } }) =>
  state.playback.volume;
export const selectPlaying = (state: { playback: { playing: boolean } }) =>
  state.playback.playing;

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
      state.timeElapsed = action.payload;
    },
    setPlaying: (state: PlaybackState, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
  },
});

export const { setMedia, setVolume, setSpeed, setPlaying } =
  playbackSlice.actions;
export default playbackSlice.reducer;
