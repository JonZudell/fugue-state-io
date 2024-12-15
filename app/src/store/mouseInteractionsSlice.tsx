import { createSlice } from '@reduxjs/toolkit';

interface MouseInteractionsState {
  isDragging: boolean;
}

const initialState: MouseInteractionsState = {
  isDragging: false,
};

const mouseInteractionsSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    setIsDragging(state, action) {
      state.isDragging = action.payload;
    }
  },
});

export const { setIsDragging } = mouseInteractionsSlice.actions;
export default mouseInteractionsSlice.reducer;