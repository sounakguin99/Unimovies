import { configureStore } from "@reduxjs/toolkit";
import tmdbReducer from "./AllmovieSlice";

export const store = configureStore({
  reducer: {
    tmdb: tmdbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
