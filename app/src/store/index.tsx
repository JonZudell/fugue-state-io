import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "@/store/filesSlice";
import playbackReducer from "@/store/playback-slice";
import commandReducer from "@/store/commandSlice";
import displayReducer from "@/store/display-slice";

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
