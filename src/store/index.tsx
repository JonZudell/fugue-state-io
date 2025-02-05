import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/store/project-slice";
import playbackReducer from "@/store/playback-slice";
import displayReducer from "@/store/display-slice";

import logger from "redux-logger";

const RootState = configureStore({
  reducer: {
    project: projectReducer,
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
