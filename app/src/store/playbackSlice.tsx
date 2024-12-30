import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FileState } from "../store/filesSlice";
import { generateWaveformSummary } from "@/core/waveformSummary";

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

export const uploadFile = createAsyncThunk(
  "playback/uploadFile",
  async (file: File, { dispatch }) => {
    return new Promise<FileState>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e && e.target && e.target.result) {
          const base64String = (e.target.result as string).split(",")[1];
          const dataUrl = `data:${file.type};base64,${base64String}`;
          const audio = new Audio(dataUrl);
          audio.onloadedmetadata = function () {
            const duration = audio.duration;
            const audioContext = new (window.AudioContext ||
              window.AudioContext)();

            generateWaveformSummary(audioContext, file).then((waveform) => {
              const fileState: FileState = {
                name: file.name,
                fileType: file.type,
                encoding: base64String,
                url: dataUrl,
                duration: duration,
                summary: waveform,
              };
              dispatch(setMedia(fileState));
              resolve(fileState);
            });
          };
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
);

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
  restartPlayback,
} = playbackSlice.actions;
export default playbackSlice.reducer;
