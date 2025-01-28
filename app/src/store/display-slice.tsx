import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Node = {
  id: string;
  splitDirection?: "horizontal" | "vertical";
  children?: Node[];
  content?: string;
  width: number;
  height: number;
};

export interface DisplayState {
  minimapEnabled: boolean;
  minimapSource: string;
  topBar: boolean;
  editor: boolean;
  root: Node | null;
  videoEnabled: boolean;
}

const initialState: DisplayState = {
  minimapEnabled: true,
  minimapSource: "",
  topBar: true,
  editor: true,
  root: null,
  videoEnabled: false,
};

export const selectDisplay = (state: { display: DisplayState }) =>
  state.display;

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    setMinimapEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.minimapEnabled = action.payload;
    },
    setMinimapSource: (state: DisplayState, action: PayloadAction<string>) => {
      state.minimapSource = action.payload;
    },
    setVideoEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.videoEnabled = action.payload;
    },
    setRoot: (state: DisplayState, action: PayloadAction<Node>) => {
      state.root = action.payload;
    },
  },
});

export const { setMinimapEnabled, setMinimapSource, setVideoEnabled } = displaySlice.actions;

export default displaySlice.reducer;
