import { createSlice } from '@reduxjs/toolkit';
import { createItem, updateItem } from './apiSlices'; // Updated import path

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: FormState = {
  loading: false,
  error: null,
  success: false
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    resetForm: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createItem.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateItem.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  }
});

export const { resetForm } = formSlice.actions;
export default formSlice.reducer;