import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./features/favoritesSlice";
import preferencesReducer from "./features/preferencesSlice";
import recipeReducer from "./features/recipeSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    preferences: preferencesReducer,
    recipe: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
