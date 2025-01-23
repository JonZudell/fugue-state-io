import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channels } from "@/lib/dsp";
export interface FileState {
  name: string;
  fileType: string;
  url: string;
  duration: number;
  summary?: Channels;
  sampleRate: number;
}
interface FilesState {
  files: FileState[];
}

const initialState: FilesState = {
  files: [],
};

// Define a memoized selector to get the list of files
export const selectFiles = (state: { files: { files: [] } }) => state.files;

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state: FilesState, action: PayloadAction<FileState>) => {
      const mediaFileTypes = ["video/mp4", "audio/mpeg"];
      if (!mediaFileTypes.includes(action.payload.fileType)) {
        throw new Error(
          "File type (" + action.payload.fileType + ") is not a media file",
        );
      }
      state.files.push(action.payload);
    },
  },
});

export const { addFile } = filesSlice.actions;
export default filesSlice.reducer;
