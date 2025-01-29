import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Node = {
  id: string;
  splitDirection?: "horizontal" | "vertical";
  children?: Node[];
  type?: string;
  sourceId?: string;
  channel?: string;
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
    setMinimapEnabled: (
      state: DisplayState,
      action: PayloadAction<boolean>,
    ) => {
      state.minimapEnabled = action.payload;
    },
    setMinimapSource: (state: DisplayState, action: PayloadAction<string>) => {
      console.log("Setting minimap source", action.payload);
      state.minimapSource = action.payload;
    },
    setVideoEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.videoEnabled = action.payload;
    },
    setRoot: (state: DisplayState, action: PayloadAction<Node>) => {
      state.root = action.payload;
    },
    removeNode: (state: DisplayState, action: PayloadAction<string>) => {
      console.log("Removing node", action.payload);
      if (action.payload === "root") {
        console.log("Removing root node");
        state.root = null;
        return;
      }
      if (state.root === null) {
        return;
      }
      const removeNode = (node: Node): Node => {
        if (node.id === action.payload) {
          return null;
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map((child) => removeNode(child)),
          };
        }
        return node;
      };
      state.root = removeNode(state.root);
    },
    setNode: (
      state: DisplayState,
      action: PayloadAction<{ id: string; node: Node }>,
    ) => {
      if (state.root === null) {
        return;
      }
      const findNode = (node: Node): Node => {
        if (node.id === action.payload.id) {
          return action.payload.node;
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map((child) => findNode(child)),
          };
        }
        return node;
      };
      state.root = findNode(state.root);
    },
  },
});

export const {
  setMinimapEnabled,
  setMinimapSource,
  setVideoEnabled,
  setRoot,
  setNode,
  removeNode,
} = displaySlice.actions;

export default displaySlice.reducer;
