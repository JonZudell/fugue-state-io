import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Node = {
  id: string;
  splitDirection?: "horizontal" | "vertical"; // Split container
  children?: Node[]; // Children for split nodes
  content?: string; // Content for leaf nodes (windows)
  width: number; // Width of the node
  height: number; // Height of the node
};

export interface DisplayState {
  minimap: boolean;
  topBar: boolean;
  editor: boolean;
  root: Node | null;
  videoEnabled: boolean;
}

const initialState: DisplayState = {
  minimap: true,
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
    setMinimap: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.minimap = action.payload;
    },
    setVideoEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.videoEnabled = action.payload;
    },
    setRoot: (state: DisplayState, action: PayloadAction<Node>) => {
      state.root = action.payload;
    },
  },
});

export const { setMinimap, setVideoEnabled } = displaySlice.actions;

export default displaySlice.reducer;
