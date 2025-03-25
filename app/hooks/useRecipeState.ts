import { useMemo } from "react";
import { Recipe } from "../services/recipeService";
import { useAppSelector } from "../store/hooks";
import { selectSortOption, selectRecentlyViewed } from "../store/selectors/preferences";

export function useRecipeState(recipes: Recipe[]) {
  const sortOption = useAppSelector(selectSortOption);
  const recentlyViewed = useAppSelector(selectRecentlyViewed);
  const showRecentOnly = useAppSelector(state => state.preferences.showRecentOnly);

  const filteredRecipes = useMemo(() => {
    if (!recipes.length) return [];
    if (!showRecentOnly) return recipes;

    return recipes.filter(recipe => recentlyViewed.includes(recipe.idMeal));
  }, [recipes, showRecentOnly, recentlyViewed]);

  const sortedRecipes = useMemo(() => {
    if (!filteredRecipes.length) return [];

    switch (sortOption) {
      case "alphabetical":
        return [...filteredRecipes].sort((a, b) => a.strMeal.localeCompare(b.strMeal));

      case "cuisine":
        return [...filteredRecipes].sort((a, b) => a.strArea.localeCompare(b.strArea));

      default:
        return filteredRecipes;
    }
  }, [filteredRecipes, sortOption]);

  const stats = useMemo(
    () => ({
      hasRecipes: recipes.length > 0,
      hasFilteredRecipes: showRecentOnly ? filteredRecipes.length > 0 : recipes.length > 0,
      totalRecipes: recipes.length,
      filteredCount: filteredRecipes.length,
    }),
    [recipes, filteredRecipes, showRecentOnly]
  );

  return {
    sortedRecipes,
    stats,
  };
}
