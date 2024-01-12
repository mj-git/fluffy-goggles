import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
};

export const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setError: (state, action) => {
            state.value = action.payload;
        },
        clearError: (state) => {
            state.value = null;
        },
    },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
