import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SortOption = "alphabetical" | "cuisine" | "recent";

interface PreferencesState {
  sortOption: SortOption;
  searchHistory: string[];
  recentlyViewed: string[];
  showRecentOnly: boolean;
  page: number;
  itemsPerPage: number;
}

const PREFERENCES_KEY = "recipe-app-preferences";
const MAX_SEARCH_HISTORY = 10;
const MAX_RECENT_RECIPES = 50;

const defaultState: PreferencesState = {
  sortOption: "alphabetical",
  searchHistory: [],
  recentlyViewed: [],
  showRecentOnly: false,
  page: 1,
  itemsPerPage: 4,
};

const initialState: PreferencesState = (() => {
  if (typeof window !== "undefined") {
    try {
      const savedPreferences = localStorage.getItem(PREFERENCES_KEY);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        return {
          ...defaultState,
          ...parsed,
          recentlyViewed: Array.isArray(parsed.recentlyViewed) ? parsed.recentlyViewed : [],
          searchHistory: Array.isArray(parsed.searchHistory) ? parsed.searchHistory : [],
        };
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  }
  return defaultState;
})();

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state));
    },
    toggleRecentOnly: state => {
      state.showRecentOnly = !state.showRecentOnly;
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state));
    },
    addSearchTerm: (state, action: PayloadAction<string>) => {
      const term = action.payload;
      state.searchHistory = [
        term,
        ...state.searchHistory.filter(t => t !== term).slice(0, MAX_SEARCH_HISTORY - 1),
      ];
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state));
    },
    clearSearchHistory: state => {
      state.searchHistory = [];
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state));
    },
    addRecentlyViewed: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      const currentViewed = Array.isArray(state.recentlyViewed) ? [...state.recentlyViewed] : [];
      const newRecentlyViewed = [recipeId];

      for (const id of currentViewed) {
        if (id !== recipeId && newRecentlyViewed.length < MAX_RECENT_RECIPES) {
          newRecentlyViewed.push(id);
        }
      }

      state.recentlyViewed = newRecentlyViewed;
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state));
    },
    incrementPage: state => {
      state.page += 1;
    },
    resetPage: state => {
      state.page = 1;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.page = 1;
    },
    setRecentlyViewed: (state, action: PayloadAction<string[]>) => {
      state.recentlyViewed = action.payload;
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state));
    },
  },
});

export const {
  setSortOption,
  toggleRecentOnly,
  addSearchTerm,
  clearSearchHistory,
  addRecentlyViewed,
  incrementPage,
  resetPage,
  setItemsPerPage,
  setRecentlyViewed,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
