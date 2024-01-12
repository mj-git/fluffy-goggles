import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import { apiSlice } from "../api/apiSlice";
import errorReducer, { setError } from "../redux/error/errorSlice";

import { isRejectedWithValue } from "@reduxjs/toolkit";

/**
 * Log a warning and show a toast!
 */
const rtkQueryErrorLogger = (store) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
        store.dispatch(setError("Something went wrong!"));
    }

    return next(action);
};

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        error: errorReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware, rtkQueryErrorLogger),
});
