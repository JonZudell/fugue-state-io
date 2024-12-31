import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DisplayState {
  zoomStart: number;
  zoomEnd: number;
  videoEnabled: boolean;
  waveformEnabled: boolean;
  spectrogramEnabled: boolean;
  fourierEnabled: boolean;
  layout:
    | "single"
    | "stacked"
    | "side-by-side"
    | "stacked-top-side-by-side"
    | "stacked-bottom-side-by-side"
    | "side-by-side-left-stacked"
    | "side-by-side-right-stacked"
    | "four";
  layoutRatios: [number, number][];
  order: ("waveform" | "video" | "spectrogram" | "fourier")[];
  minimap: boolean;
  numberOfDisplayItems: number;
}

const RatioMap: { [key: string]: [number, number][] } = {
  single: [[1, 1]],
  stacked: [
    [1, 0.5],
    [1, 0.5],
  ],
  "side-by-side": [
    [0.5, 1],
    [0.5, 1],
  ],
  "stacked-top-side-by-side": [
    [0.5, 0.5],
    [0.5, 0.5],
    [1, 0.5],
  ],
  "stacked-bottom-side-by-side": [
    [1, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
  ],
  "side-by-side-left-stacked": [
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 1],
  ],
  "side-by-side-right-stacked": [
    [0.5, 1],
    [0.5, 0.5],
    [0.5, 0.5],
  ],
  four: [
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
  ],
};

const initialState: DisplayState = {
  zoomStart: 0,
  zoomEnd: 1,
  videoEnabled: false,
  waveformEnabled: true,
  spectrogramEnabled: false,
  fourierEnabled: false,
  layout: "single",
  layoutRatios: RatioMap["single"],
  order: ["waveform"],
  minimap: true,
};

export const selectZoomStart = (state: { display: DisplayState }) =>
  state.display.zoomStart;
export const selectZoomEnd = (state: { display: DisplayState }) =>
  state.display.zoomEnd;
export const selectLayout = (state: { display: DisplayState }) =>
  state.display.layout;
export const selectLayoutRatios = (state: { display: DisplayState }) =>
  state.display.layoutRatios;
export const selectMinimap = (state: { display: DisplayState }) =>
  state.display.minimap;
export const selectVideoEnabled = (state: { display: DisplayState }) =>
  state.display.videoEnabled;
export const selectWaveformEnabled = (state: { display: DisplayState }) =>
  state.display.waveformEnabled;
export const selectSpectrogramEnabled = (state: { display: DisplayState }) =>
  state.display.spectrogramEnabled;
export const selectFourierEnabled = (state: { display: DisplayState }) =>
  state.display.fourierEnabled;
export const selectOrder = (state: { display: DisplayState }) =>
  state.display.order;

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
    setLayout: (
      state: DisplayState,
      action: PayloadAction<DisplayState["layout"]>,
    ) => {
      state.layout = action.payload;
      state.layoutRatios = RatioMap[action.payload];
    },
    setMinimap: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.minimap = action.payload;
    },
    setVideoEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.videoEnabled = action.payload;
      if (action.payload) {
        state.numberOfDisplayItems = state.numberOfDisplayItems + 1;
      } else {
        state.numberOfDisplayItems = state.numberOfDisplayItems - 1;
      }
    },
    setWaveformEnabled: (
      state: DisplayState,
      action: PayloadAction<boolean>,
    ) => {
      state.waveformEnabled = action.payload;
      if (action.payload) {
        state.numberOfDisplayItems = state.numberOfDisplayItems + 1;
      } else {
        state.numberOfDisplayItems = state.numberOfDisplayItems - 1;
      }
    },
    setSpectrogramEnabled: (
      state: DisplayState,
      action: PayloadAction<boolean>,
    ) => {
      state.spectrogramEnabled = action.payload;
      if (action.payload) {
        state.numberOfDisplayItems = state.numberOfDisplayItems + 1;
      } else {
        state.numberOfDisplayItems = state.numberOfDisplayItems - 1;
      }
    },
    setFourierEnabled: (
      state: DisplayState,
      action: PayloadAction<boolean>,
    ) => {
      state.fourierEnabled = action.payload;
      if (action.payload) {
        state.numberOfDisplayItems = state.numberOfDisplayItems + 1;
      } else {
        state.numberOfDisplayItems = state.numberOfDisplayItems - 1;
      }
    },
    setOrder: (
      state: DisplayState,
      action: PayloadAction<
        ("waveform" | "video" | "spectrogram" | "fourier")[]
      >,
    ) => {
      state.order = action.payload;
    },
  },
});

export const {
  setZoomStart,
  setZoomEnd,
  setLayout,
  setMinimap,
  setVideoEnabled,
  setWaveformEnabled,
  setSpectrogramEnabled,
  setFourierEnabled,
  setOrder,
} = displaySlice.actions;
export default displaySlice.reducer;
