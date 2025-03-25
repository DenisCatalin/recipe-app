import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setRecentlyViewed } from "../store/features/preferencesSlice";
import { useSessionStorage } from "./useSessionStorage";

const RECENTLY_VIEWED_KEY = "recipe_app_recently_viewed";
const MAX_RECENT_ITEMS = 10;

export function useRecentlyViewed() {
  const dispatch = useAppDispatch();
  const recentlyViewed = useAppSelector(state => state.preferences.recentlyViewed);
  const [storedRecipes, setStoredRecipes] = useSessionStorage<string[]>(RECENTLY_VIEWED_KEY, []);

  useEffect(() => {
    if (storedRecipes.length > 0) {
      dispatch(setRecentlyViewed(storedRecipes));
    } else if (recentlyViewed.length > 0) {
      setStoredRecipes(recentlyViewed);
    }
  }, []);

  useEffect(() => {
    setStoredRecipes(recentlyViewed);
  }, [recentlyViewed]);

  const addRecentlyViewed = (recipeId: string) => {
    const newRecentlyViewed = [recipeId, ...recentlyViewed.filter(id => id !== recipeId)].slice(
      0,
      MAX_RECENT_ITEMS
    );

    dispatch(setRecentlyViewed(newRecentlyViewed));
  };

  const clearRecentlyViewed = () => {
    dispatch(setRecentlyViewed([]));
  };

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
