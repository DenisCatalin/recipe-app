import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectSortOption = (state: RootState) => state.preferences.sortOption;
export const selectRecentlyViewed = (state: RootState) => state.preferences.recentlyViewed;
export const selectSearchHistory = (state: RootState) => state.preferences.searchHistory;
export const selectShowRecentOnly = (state: RootState) => state.preferences.showRecentOnly;
export const selectPage = (state: RootState) => state.preferences.page;
export const selectItemsPerPage = (state: RootState) => state.preferences.itemsPerPage;

export const selectHasRecentlyViewed = createSelector(
  [selectRecentlyViewed],
  recentlyViewed => recentlyViewed.length > 0
);

export const selectPreferencesState = createSelector(
  [selectSortOption, selectShowRecentOnly, selectPage, selectItemsPerPage],
  (sortOption, showRecentOnly, page, itemsPerPage) => ({
    sortOption,
    showRecentOnly,
    page,
    itemsPerPage,
  })
);
