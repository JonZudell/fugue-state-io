import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
interface FilesState {
  files: {name: string, fileType: string, encoding: string}[];
}

const initialState: FilesState = {
  files: []
}
// Define a basic selector to get the files state
const selectFilesState = (state: { files: unknown; }) => state.files;

// Define a memoized selector to get the list of files
export const selectFiles = createSelector(
  [selectFilesState],
  (filesState) => filesState.files
);

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state: FilesState, action: PayloadAction<{name: string, fileType: string, encoding: string }>) => {
      state.files.push(action.payload);
    }
  },
});

export const { addFile } = filesSlice.actions;
export default filesSlice.reducer;