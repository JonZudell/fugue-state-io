import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DisplayState {
  zoomStart: number;
  zoomEnd: number;
  videoEnabled: boolean;
  waveformEnabled: boolean;
  spectrogramEnabled: boolean;
  spectrogramScale: number;
  fourierEnabled: boolean;
  fourierScale: number;
  layout:
    | "single"
    | "stacked"
    | "side-by-side"
    | "stacked-top-side-by-side"
    | "stacked-bottom-side-by-side"
    | "side-by-side-left-stacked"
    | "side-by-side-right-stacked"
    | "four";
  order: ("waveform" | "video" | "spectrogram" | "fourier")[];
  minimap: boolean;
  numberOfDisplayItems: number;
}

const initialState: DisplayState = {
  zoomStart: 0,
  zoomEnd: 1,
  videoEnabled: true,
  waveformEnabled: true,
  spectrogramEnabled: false,
  spectrogramScale: 4,
  fourierEnabled: false,
  fourierScale: 4,
  layout: "stacked",
  order: ["video", "waveform"],
  minimap: true,
  numberOfDisplayItems: 2,
};

export const selectZoomStart = (state: { display: DisplayState }) =>
  state.display.zoomStart;
export const selectZoomEnd = (state: { display: DisplayState }) =>
  state.display.zoomEnd;
export const selectLayout = (state: { display: DisplayState }) =>
  state.display.layout;
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
export const selectSpectrogramScale = (state: { display: DisplayState }) =>
  state.display.spectrogramScale;
export const selectFourierScale = (state: { display: DisplayState }) =>
  state.display.fourierScale;
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
      if (
        state.numberOfDisplayItems === 0 ||
        state.numberOfDisplayItems === 1
      ) {
        state.layout = "single";
      } else if (state.numberOfDisplayItems === 2) {
        state.layout = "stacked";
      } else if (state.numberOfDisplayItems === 3) {
        state.layout = "stacked-bottom-side-by-side";
      } else if (state.numberOfDisplayItems === 4) {
        state.layout = "four";
      }
      if (action.payload) {
        state.order.push("video");
      } else {
        state.order = state.order.filter((item) => item !== "video");
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
      if (
        state.numberOfDisplayItems === 0 ||
        state.numberOfDisplayItems === 1
      ) {
        state.layout = "single";
      } else if (state.numberOfDisplayItems === 2) {
        state.layout = "stacked";
      } else if (state.numberOfDisplayItems === 3) {
        state.layout = "stacked-bottom-side-by-side";
      } else if (state.numberOfDisplayItems === 4) {
        state.layout = "four";
      }

      if (action.payload) {
        state.order.push("waveform");
      } else {
        state.order = state.order.filter((item) => item !== "waveform");
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
      if (
        state.numberOfDisplayItems === 0 ||
        state.numberOfDisplayItems === 1
      ) {
        state.layout = "single";
      } else if (state.numberOfDisplayItems === 2) {
        state.layout = "stacked";
      } else if (state.numberOfDisplayItems === 3) {
        state.layout = "stacked-bottom-side-by-side";
      } else if (state.numberOfDisplayItems === 4) {
        state.layout = "four";
      }

      if (action.payload) {
        state.order.push("spectrogram");
      } else {
        state.order = state.order.filter((item) => item !== "spectrogram");
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
      if (
        state.numberOfDisplayItems === 0 ||
        state.numberOfDisplayItems === 1
      ) {
        state.layout = "single";
      } else if (state.numberOfDisplayItems === 2) {
        state.layout = "stacked";
      } else if (state.numberOfDisplayItems === 3) {
        state.layout = "stacked-bottom-side-by-side";
      } else if (state.numberOfDisplayItems === 4) {
        state.layout = "four";
      }

      if (action.payload) {
        state.order.push("fourier");
      } else {
        state.order = state.order.filter((item) => item !== "fourier");
      }
    },
    setOrder: (
      state: DisplayState,
      action: PayloadAction<DisplayState["order"]>,
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
