"use client";

import { useCallback, useState, useEffect } from "react";
import { Recipe, searchRecipes, getRecipeById } from "../services/recipeService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addSearchTerm, toggleRecentOnly } from "../store/features/preferencesSlice";
import { setAllRecipes, setPage } from "../store/features/recipeSlice";

interface UseRecipeSearchResult {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  search: (query: string) => Promise<void>;
  loadMore: () => void;
}

export function useRecipeSearch(): UseRecipeSearchResult {
  const dispatch = useAppDispatch();
  const { allRecipes, currentPage, hasMore } = useAppSelector(state => state.recipe);
  const { showRecentOnly, recentlyViewed } = useAppSelector(state => state.preferences);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecentlyViewed = useCallback(async () => {
    if (!recentlyViewed.length) {
      dispatch(setAllRecipes([]));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const recipes = await Promise.all(
        recentlyViewed.map(id => getRecipeById(id).catch(() => null))
      );

      const validRecipes = recipes.filter((recipe): recipe is Recipe => recipe !== null);
      dispatch(setAllRecipes(validRecipes));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load recently viewed recipes";
      console.error("[Recent Recipes] Error:", errorMessage);
      setError(errorMessage);
      dispatch(setAllRecipes([]));
    } finally {
      setLoading(false);
    }
  }, [dispatch, recentlyViewed]);

  useEffect(() => {
    if (showRecentOnly) {
      loadRecentlyViewed();
    }
  }, [showRecentOnly, loadRecentlyViewed]);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        dispatch(setAllRecipes([]));
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (showRecentOnly) {
          dispatch(toggleRecentOnly());
        }

        const results = await searchRecipes(query);
        if (results.length === 0) {
          setError("No recipes found for your search.");
        }
        dispatch(setAllRecipes(results));
        dispatch(addSearchTerm(query));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to search recipes";
        console.error("[Recipe Search] Error:", errorMessage);
        setError(errorMessage);
        dispatch(setAllRecipes([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, showRecentOnly]
  );

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(setPage(currentPage + 1));
      return Promise.resolve();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more recipes");
      console.error("[LoadMore] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, hasMore, loading, currentPage]);

  return {
    recipes: allRecipes,
    loading,
    error,
    hasMore,
    search,
    loadMore,
  };
}
