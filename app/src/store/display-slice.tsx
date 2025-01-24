import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DisplayState {
  minimap: boolean;
  topBar: boolean;
  editor: boolean;
  order: ("waveform" | "fourier" | "spectrogram" | "video" | "notation")[];
  layout: ("none" | "single" | "stacked" | "stacked-3") | string;
  videoEnabled: boolean;
}

const initialState: DisplayState = {
  minimap: true,
  topBar: true,
  editor: true,
  order: [],
  layout: "none",
  videoEnabled: false,
};

export const selectDisplay = (state: { display: DisplayState }) =>
  state.display;

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
    },
  },
});

export const { setLayout, setMinimap, setOrder, setVideoEnabled } =
  displaySlice.actions;

export default displaySlice.reducer;
