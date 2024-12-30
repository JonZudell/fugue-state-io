import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./filesSlice";
import playbackReducer from "./playbackSlice";
import commandReducer from "./commandSlice";
import displayReducer from "./displaySlice";
const RootState = configureStore({
  reducer: {
    files: filesReducer,
    playback: playbackReducer,
    command: commandReducer,
    display: displayReducer,
  },
});

export type AppDispatch = typeof RootState.dispatch;
export default RootState;
