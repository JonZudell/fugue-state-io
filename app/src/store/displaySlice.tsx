import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

export interface ComponentTree {
  path?: number[];
  type: "root" | "display" | "waveform" | "fourier" | "spectrogram";
  direction?: "horizontal" | "vertical";
  components: (React.ReactNode | ComponentTree)[];
}

export interface DisplayState {
  minimap: boolean;
  root: ComponentTree;
}

const initialState: DisplayState = {
  minimap: true,
  root: { direction: "horizontal", type: "root", components: [] },
};

export const selectRoot = (state: { display: DisplayState }) => state.display.root;
const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    appendToComponentTree: (state: DisplayState, action: PayloadAction<React.ReactNode>) => {
      state.root.components.push(action.payload);
    },
    insertIntoComponentTree: (state: DisplayState, action: PayloadAction<{ path: number[]; component: React.ReactNode }>) => {
      const { path, component } = action.payload;
      let current = state.root;
      for (const index of path) {
        if (current.components[index] && typeof current.components[index] === "object" && "components" in current.components[index]) {
          current = current.components[index] as ComponentTree;
        } else {
          throw new Error("Invalid path");
        }
      }
      current.components.push(component);
    },
    setRoot: (state: DisplayState, action: PayloadAction<ComponentTree>) => {
      state.root = action.payload;
    },
  },
});

export const { appendToComponentTree, setRoot } = displaySlice.actions;
export default displaySlice.reducer;
