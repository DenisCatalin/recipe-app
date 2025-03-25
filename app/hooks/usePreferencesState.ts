import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  selectPreferencesState,
  selectHasRecentlyViewed,
  selectSearchHistory,
} from "../store/selectors/preferences";
import {
  setSortOption,
  toggleRecentOnly,
  addSearchTerm,
  clearSearchHistory,
  addRecentlyViewed,
  incrementPage,
  resetPage,
  setItemsPerPage,
  SortOption,
} from "../store/features/preferencesSlice";

export function usePreferencesState() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector(selectPreferencesState);
  const hasRecentlyViewed = useAppSelector(selectHasRecentlyViewed);
  const searchHistory = useAppSelector(selectSearchHistory);

  return {
    ...preferences,
    hasRecentlyViewed,
    searchHistory,

    setSortOption: (option: SortOption) => dispatch(setSortOption(option)),
    toggleRecentOnly: () => dispatch(toggleRecentOnly()),
    addSearchTerm: (term: string) => dispatch(addSearchTerm(term)),
    clearSearchHistory: () => dispatch(clearSearchHistory()),
    addRecentlyViewed: (recipeId: string) => dispatch(addRecentlyViewed(recipeId)),
    incrementPage: () => dispatch(incrementPage()),
    resetPage: () => dispatch(resetPage()),
    setItemsPerPage: (count: number) => dispatch(setItemsPerPage(count)),
  };
}
