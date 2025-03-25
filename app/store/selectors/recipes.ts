import { createSelector } from "@reduxjs/toolkit";
import { Recipe } from "../../services/recipeService";
import { selectRecentlyViewed, selectShowRecentOnly, selectSortOption } from "./preferences";

const selectRecipes = (_state: unknown, recipes: Recipe[]) => recipes;

export const selectFilteredRecipes = createSelector(
  [selectRecipes, selectShowRecentOnly, selectRecentlyViewed],
  (recipes, showRecentOnly, recentlyViewed) => {
    if (!showRecentOnly || !recentlyViewed?.length) {
      return recipes;
    }

    return recipes.filter(recipe => recentlyViewed.includes(recipe.idMeal));
  }
);

export const selectSortedRecipes = createSelector(
  [selectFilteredRecipes, selectSortOption, selectShowRecentOnly, selectRecentlyViewed],
  (filteredRecipes, sortOption, showRecentOnly, recentlyViewed) => {
    const sortedRecipes = [...filteredRecipes];

    if (showRecentOnly && recentlyViewed?.length) {
      return sortedRecipes.sort((a, b) => {
        const aIndex = recentlyViewed.indexOf(a.idMeal);
        const bIndex = recentlyViewed.indexOf(b.idMeal);
        return aIndex - bIndex;
      });
    }

    return sortedRecipes.sort((a, b) => {
      switch (sortOption) {
        case "alphabetical":
          return a.strMeal.localeCompare(b.strMeal);
        case "cuisine":
          return a.strArea.localeCompare(b.strArea) || a.strMeal.localeCompare(b.strMeal);
        default:
          return 0;
      }
    });
  }
);

export const selectRecipeStats = createSelector(
  [selectRecipes, selectFilteredRecipes],
  (allRecipes, filteredRecipes) => ({
    totalCount: allRecipes.length,
    filteredCount: filteredRecipes.length,
    hasRecipes: allRecipes.length > 0,
    hasFilteredRecipes: filteredRecipes.length > 0,
  })
);
