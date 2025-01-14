import FourierDisplay from "@/components/FourierDisplay";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ComponentTree {
  direction?: "horizontal" | "vertical";
  components: (React.ReactNode | ComponentTree)[];
}

export interface DisplayState {
  minimap: boolean;
  root: ComponentTree;
}

const initialState: DisplayState = {
  minimap: true,
  root: { direction: "horizontal", components: [] },
};

export const selectDisplay = (state: { display: DisplayState }) =>
  state.display;

const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    appendToComponentTree: (
      state: DisplayState,
      action: PayloadAction<{ node: React.ReactNode; indices: number[] }>,
    ) => {},
    removeFromComponentTree: (
      state: DisplayState,
      action: PayloadAction<{ indices: number[] }>,
    ) => {},
    swapElements: (
      state: DisplayState,
      action: PayloadAction<{ first: number[]; second: number[] }>,
    ) => {},
    setRoot: (state: DisplayState, action: PayloadAction<ComponentTree>) => {
      state.root = action.payload;
    },
  },
});

export const { appendToComponentTree, setRoot } = displaySlice.actions;
export default displaySlice.reducer;
