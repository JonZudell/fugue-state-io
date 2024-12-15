import { createSlice } from '@reduxjs/toolkit';

interface ProjectState {
  assets: Array<string>;
}

const initialState: ProjectState = {
  assets: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
  },
});

//export const { setIsDragging } = projectSlice.actions;
export default projectSlice.reducer;