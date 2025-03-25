import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "@/app/services/recipeService";

interface RecipeState {
  allRecipes: Recipe[];
  displayedRecipes: Recipe[];
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  allRecipes: [],
  displayedRecipes: [],
  currentPage: 0,
  itemsPerPage: 4,
  hasMore: false,
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setAllRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.allRecipes = action.payload;
      state.displayedRecipes = action.payload.slice(0, state.itemsPerPage);
      state.hasMore = action.payload.length > state.itemsPerPage;
    },
    setPage: (state, action: PayloadAction<number>) => {
      const newPage = action.payload;
      const start = newPage * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      state.currentPage = newPage;
      state.displayedRecipes = state.allRecipes.slice(start, end);
      state.hasMore = end < state.allRecipes.length;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAllRecipes, setPage, setLoading, setError } = recipeSlice.actions;
export default recipeSlice.reducer;
