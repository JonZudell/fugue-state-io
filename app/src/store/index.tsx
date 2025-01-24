import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "@/store/asset-slice";
import playbackReducer from "@/store/playback-slice";
import displayReducer from "@/store/display-slice";

import logger from "redux-logger";

const RootState = configureStore({
  reducer: {
    files: filesReducer,
    playback: playbackReducer,
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
