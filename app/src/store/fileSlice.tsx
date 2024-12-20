import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
interface FileState {
  file: { name: string, fileType: string, encoding: string } | null;
}

const initialState: FileState = {
  file: null
}
// Define a basic selector to get the files state
const selectFileState = (state: { file: FileState; }) => state.file;

// Define a memoized selector to get the list of files
export const selectFile = createSelector(
  [selectFileState],
  (fileState) => fileState.file
);

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    addFile: (state: FileState, action: PayloadAction<{ name: string, fileType: string, encoding: string }>) => {
      const mediaFileTypes = ['video/mp4', 'audio/mp3'];
      if (!mediaFileTypes.includes(action.payload.fileType)) {
        throw new Error('File type (' + action.payload.fileType + ') is not a media file');
      }
      state.file = action.payload;
    }
  },
});

export const { addFile } = fileSlice.actions;
export default fileSlice.reducer;