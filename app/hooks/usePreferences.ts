"use client";

import { useState, useCallback } from "react";

export type SortOption = "alphabetical" | "cuisine";

interface Preferences {
  sortOption: SortOption;
  searchHistory: string[];
  recentlyViewed: string[];
}

const PREFERENCES_KEY = "recipe-app-preferences";
const MAX_SEARCH_HISTORY = 10;
const MAX_RECENT_RECIPES = 50;

const defaultPreferences: Preferences = {
  sortOption: "alphabetical",
  searchHistory: [],
  recentlyViewed: [],
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window !== "undefined") {
      const savedPreferences = localStorage.getItem(PREFERENCES_KEY);
      if (savedPreferences) {
        return JSON.parse(savedPreferences);
      }
    }
    return defaultPreferences;
  });

  const updatePreferences = useCallback((newPreferences: Preferences) => {
    setPreferences(newPreferences);
    if (typeof window !== "undefined") {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
    }
  }, []);

  const setSortOption = useCallback(
    (sort: SortOption) => {
      updatePreferences({ ...preferences, sortOption: sort });
    },
    [preferences, updatePreferences]
  );

  const addSearchTerm = useCallback(
    (term: string) => {
      const newHistory = [
        term,
        ...preferences.searchHistory.filter(t => t !== term).slice(0, MAX_SEARCH_HISTORY - 1),
      ];

      updatePreferences({ ...preferences, searchHistory: newHistory });
    },
    [preferences, updatePreferences]
  );

  const clearSearchHistory = useCallback(() => {
    updatePreferences({ ...preferences, searchHistory: [] });
  }, [preferences, updatePreferences]);

  const addRecentlyViewed = useCallback(
    (recipeId: string) => {
      const newRecentlyViewed = [
        recipeId,
        ...preferences.recentlyViewed
          .filter(id => id !== recipeId)
          .slice(0, MAX_RECENT_RECIPES - 1),
      ];

      updatePreferences({ ...preferences, recentlyViewed: newRecentlyViewed });
    },
    [preferences, updatePreferences]
  );

  return {
    ...preferences,
    setSortOption,
    addSearchTerm,
    clearSearchHistory,
    addRecentlyViewed,
  };
}
