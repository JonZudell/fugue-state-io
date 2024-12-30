import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DisplayState {
  zoomStart: number;
  zoomEnd: number;
  displayMode:
    | "waveform"
    | "spectrogram"
    | "video"
    | "waveform-spectrogram"
    | "waveform-video"
    | "spectrogram-video"
    | "waveform-spectrogram-video";
  layout: "stacked" | "side-by-side";
  minimap: boolean;
}

const initialState: DisplayState = {
  zoomStart: 0,
  zoomEnd: 1,
  displayMode: "waveform-video",
  layout: "stacked",
  minimap: true,
};

export const selectZoomStart = (state: { display: DisplayState }) =>
  state.display.zoomStart;
export const selectZoomEnd = (state: { display: DisplayState }) =>
  state.display.zoomEnd;
export const selectDisplayMode = (state: { display: DisplayState }) =>
  state.display.displayMode;
export const selectLayout = (state: { display: DisplayState }) =>
  state.display.layout;
export const selectMinimap = (state: { display: DisplayState }) =>
  state.display.minimap;

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    setZoomStart: (state: DisplayState, action: PayloadAction<number>) => {
      state.zoomStart = action.payload;
    },
    setZoomEnd: (state: DisplayState, action: PayloadAction<number>) => {
      state.zoomEnd = action.payload;
    },
    setDisplayMode: (
      state: DisplayState,
      action: PayloadAction<DisplayState["displayMode"]>,
    ) => {
      state.displayMode = action.payload;
    },
    setLayout: (
      state: DisplayState,
      action: PayloadAction<DisplayState["layout"]>,
    ) => {
      state.layout = action.payload;
    },
    setMinimap: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.minimap = action.payload;
    },
  },
});

export const {
  setZoomStart,
  setZoomEnd,
  setDisplayMode,
  setLayout,
  setMinimap,
} = displaySlice.actions;
export default displaySlice.reducer;
