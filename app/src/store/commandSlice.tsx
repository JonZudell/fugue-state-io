import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface FileState {
  name: string;
  fileType: string;
  encoding: string;
  url: string;
  duration: number;
}
interface CommandState {
  controlDown: boolean;
  showCommandLegend: boolean;
  isCommandFocused: boolean;
  kDown: boolean;
  escPressed?: boolean;
}

const initialState: CommandState = {
  controlDown: false,
  showCommandLegend: false,
  isCommandFocused: false,
  kDown: false,
  escPressed: false,
};

// Define a memoized selector to get the list of files
export const selectControlDown = (state: { command: CommandState }) =>
  state.command.controlDown;
export const selectShowCommandLegend = (state: { command: CommandState }) =>
  state.command.showCommandLegend;
export const selectIsCommandFocused = (state: { command: CommandState }) =>
  state.command.isCommandFocused;
export const selectKDown = (state: { command: CommandState }) =>
  state.command.kDown;
export const selectEscDown = (state: { command: CommandState }) =>
  state.command.escPressed;

const commandSlice = createSlice({
  name: "command",
  initialState,
  reducers: {
    setShowCommandLegend: (
      state: CommandState,
      action: PayloadAction<boolean>,
    ) => {
      state.showCommandLegend = action.payload;
    },
    setIsCommandFocused: (
      state: CommandState,
      action: PayloadAction<boolean>,
    ) => {
      state.isCommandFocused = action.payload;
      if (!action.payload) {
        state.showCommandLegend = false;
      } else {
        state.showCommandLegend = true;
      }
    },
    setControlDown: (state: CommandState, action: PayloadAction<boolean>) => {
      state.controlDown = action.payload;
    },
    setKDown: (state: CommandState, action: PayloadAction<boolean>) => {
      state.kDown = action.payload;
    },
    setEscDown: (state: CommandState, action: PayloadAction<boolean>) => {
      state.escPressed = action.payload;
    },
  },
});

export const {
  setControlDown,
  setShowCommandLegend,
  setIsCommandFocused,
  setKDown,
  setEscDown,
} = commandSlice.actions;
export default commandSlice.reducer;
