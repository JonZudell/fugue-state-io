import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./filesSlice";
import playbackReducer from "./playbackSlice";
import commandReducer from "./commandSlice";
import displayReducer from "./displaySlice";

import logger from "redux-logger";

const RootState = configureStore({
  reducer: {
    files: filesReducer,
    playback: playbackReducer,
    command: commandReducer,
    display: displayReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(logger),
});

export type AppDispatch = typeof RootState.dispatch;
export default RootState;
