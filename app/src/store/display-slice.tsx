import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DisplayState {
  minimap: boolean;
  order: ("waveform" | "fourier" | "spectrogram" | "video" | "none")[];
  layout: ("none" | "single" | "stacked" | "stacked-3") | string;
  videoEnabled: boolean;
}

const initialState: DisplayState = {
  minimap: true,
  order: [],
  layout: "none",
  videoEnabled: false,
};

export const selectMinimap = (state: { display: DisplayState }) =>
  state.display.minimap;
export const selectOrder = (state: { display: DisplayState }) =>
  state.display.order;
export const selectLayout = (state: { display: DisplayState }) => {
  console.log(state.display.layout);
  return state.display.layout;
};
export const selectVideoEnabled = (state: { display: DisplayState }) =>
  state.display.videoEnabled;

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    setLayout: (state: DisplayState, action: PayloadAction<string>) => {
      state.layout = action.payload;
    },
    setMinimap: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.minimap = action.payload;
    },
    setOrder: (
      state: DisplayState,
      action: PayloadAction<DisplayState["order"]>,
    ) => {
      console.log(action.payload);
      state.order = action.payload;
    },
    setVideoEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.videoEnabled = action.payload;
    }
  },
});

export const { setLayout, setMinimap, setOrder, setVideoEnabled } = displaySlice.actions;

export default displaySlice.reducer;
