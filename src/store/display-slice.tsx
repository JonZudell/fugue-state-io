import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";
export type Node = {
  id?: string | null;
  splitDirection?: "horizontal" | "vertical" | null;
  children?: Node[] | null;
  type?: string | null;
  sourceId?: string | null;
  channel?: string | null;
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

const compressTree = (node: Node): Node => {
  if (node.children) {
    if (node.children.length === 1) {
      return compressTree(node.children[0]);
    }
    return {
      ...node,
      children: node.children.map(compressTree),
    };
  }
  return node;
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
    setEditor: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.editor = action.payload;
    },
    setVideoEnabled: (state: DisplayState, action: PayloadAction<boolean>) => {
      state.videoEnabled = action.payload;
    },
    setRoot: (state: DisplayState, action: PayloadAction<Node>) => {
      state.root = action.payload;
    },
    setNode: (
      state: DisplayState,
      action: PayloadAction<{ nodeId?: string | null; node?: Node | null }>,
    ) => {
      console.log("Setting node", action.payload);
      if (!action.payload.node) {
        return;
      }
      if (state.root === null) {
        state.root = action.payload.node;
        return;
      }
      if (!action.payload.nodeId) {
        return;
      }
      if (action.payload.nodeId === "root") {
        state.root = action.payload.node;
        return;
      }
      if (state.root === null) {
        return;
      }
      const findNode = (node: Node, nodeId: string): Node => {
        console.log("Checking node", node.id, nodeId);
        if (node.id === nodeId && action.payload.node) {
          return action.payload.node;
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map((child) => findNode(child, nodeId)),
          };
        }
        return node;
      };
      state.root = findNode(state.root, action.payload.nodeId);
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
        if (node.children) {
          return {
            ...node,
            children: node.children
              .filter((child) => child.id !== action.payload)
              .map((child) => removeNode(child)),
          };
        }
        return node;
      };
      state.root = compressTree(removeNode(state.root));
      state.root.id = "root";
    },
    splitNode: (
      state: DisplayState,
      action: PayloadAction<{
        nodeId: string;
        direction: "horizontal" | "vertical";
        parentId?: string | null;
      }>,
    ) => {
      console.log("Splitting node", action.payload);
      if (state.root === null) {
        return;
      }
      const splitNode = (node: Node): Node => {
        if (node.id === action.payload.nodeId) {
          return {
            id: node.id,
            splitDirection: action.payload.direction,
            type: "split",
            children: [
              {
                id: uuidv4(),
                type: node.type,
                sourceId: node.sourceId,
                channel: node.channel,
              },
              {
                id: uuidv4(),
                type: node.type,
                sourceId: node.sourceId,
                channel: node.channel,
              },
            ],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map((child) => splitNode(child)),
          };
        }
        return node;
      };
      state.root = compressTree(splitNode(state.root));
      state.root.id = "root";
    },
    toggleEditor: (state: DisplayState) => {
      state.editor = !state.editor;
    },
  },
});

export const {
  setMinimapEnabled,
  setMinimapSource,
  setVideoEnabled,
  setRoot,
  setNode,
  setEditor,
  removeNode,
  splitNode,
  toggleEditor,
} = displaySlice.actions;

export default displaySlice.reducer;
