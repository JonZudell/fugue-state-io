import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlaybackState {
  media: string;
  playing: boolean;
  timeElapsed: number;
  speed: number;
  volume: number;
}

const initialState: PlaybackState = {
  media: "",
  playing: true,
  timeElapsed: 0,
  speed: 1,
  volume: 1,
};

const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
      setMedia: (state: PlaybackState, action: PayloadAction<string>) => {
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

export const { setMedia, setVolume, setSpeed, setPlaying } = playbackSlice.actions;
export default playbackSlice.reducer;