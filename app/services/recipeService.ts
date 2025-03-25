export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`/api/recipes?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
}

export async function getRecipeById(id: string): Promise<Recipe> {
  try {
    const response = await fetch(`/api/recipes/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recipe");
    }
    const data = await response.json();
    if (!data.meals || !data.meals[0]) {
      throw new Error("Recipe not found");
    }
    return data.meals[0];
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
}
