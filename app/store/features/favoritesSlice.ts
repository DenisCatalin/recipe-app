import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "@/app/services/recipeService";

interface FavoritesState {
  items: Recipe[];
}

const getInitialState = (): FavoritesState => {
  if (typeof window === "undefined") return { items: [] };

  const savedFavorites = localStorage.getItem("recipe-favorites");
  return {
    items: savedFavorites ? JSON.parse(savedFavorites) : [],
  };
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: getInitialState(),
  reducers: {
    addFavorite: (state, action: PayloadAction<Recipe>) => {
      if (!state.items.some(item => item.idMeal === action.payload.idMeal)) {
        state.items.push(action.payload);
        if (typeof window !== "undefined") {
          localStorage.setItem("recipe-favorites", JSON.stringify(state.items));
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.idMeal !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("recipe-favorites", JSON.stringify(state.items));
      }
    },
    clearFavorites: state => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("recipe-favorites");
      }
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
