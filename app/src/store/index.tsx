import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./filesSlice";
import playbackReducer from "./playbackSlice";
const RootState = configureStore({
  reducer: {
    files: filesReducer,
    playback: playbackReducer,
  },
});

export default RootState;
