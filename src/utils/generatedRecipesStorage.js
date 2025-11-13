/**
 * Generated Recipes Storage Utility
 * Manages storage of user-generated recipes in localStorage.
 * Provides fallback when backend endpoint is not available.
 * Follows Single Responsibility: handles recipe storage only.
 */

const STORAGE_KEY = "userGeneratedRecipes";

/**
 * Saves generated recipes to localStorage.
 *
 * @param {Array<Object>} recipes - Array of recipe objects
 */
export const saveGeneratedRecipes = (recipes) => {
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return;
  }

  try {
    const existingRecipes = getGeneratedRecipes();
    const newRecipes = recipes.filter(
      (recipe) => !existingRecipes.some((existing) => existing._id === recipe._id)
    );
    const allRecipes = [...existingRecipes, ...newRecipes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecipes));
  } catch (error) {
    console.error("Error saving generated recipes:", error);
  }
};

/**
 * Retrieves generated recipes from localStorage.
 *
 * @returns {Array<Object>} Array of recipe objects
 */
export const getGeneratedRecipes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving generated recipes:", error);
    return [];
  }
};

/**
 * Clears all generated recipes from localStorage.
 */
export const clearGeneratedRecipes = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing generated recipes:", error);
  }
};

/**
 * Removes a specific recipe by ID from localStorage.
 *
 * @param {string} recipeId - Recipe ID to remove
 */
export const removeGeneratedRecipe = (recipeId) => {
  try {
    const recipes = getGeneratedRecipes();
    const filtered = recipes.filter((recipe) => recipe._id !== recipeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing generated recipe:", error);
  }
};

