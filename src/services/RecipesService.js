import createHttp from "./BaseService";

const httpPublic = createHttp(false);
const httpAuthenticated = createHttp(true);

/**
 * Retrieves all recipes (public endpoint).
 *
 * @returns {Promise<Array>} Array of recipes
 */
export const getRecipes = () => {
  return httpPublic.get("/recipes");
};

/**
 * Retrieves a specific recipe by ID (public endpoint).
 *
 * @param {string} id - Recipe ID
 * @returns {Promise<Object>} Recipe object
 */
export const getRecipe = (id) => {
  return httpPublic.get(`/recipes/${id}`);
};

/**
 * Toggles favorite status for a recipe (requires authentication).
 *
 * @param {string} id - Recipe ID
 * @returns {Promise<Object>} Updated recipe object
 */
export const toggleFavorite = (id) => {
  return httpAuthenticated.put(`/recipes/${id}/favorite`);
};

/**
 * Retrieves user's favorite recipes (requires authentication).
 *
 * @returns {Promise<Array>} Array of favorite recipes
 */
export const getFavorites = () => {
  return httpAuthenticated.get("/recipes/favorites");
};

/**
 * Retrieves user's generated recipes (requires authentication).
 * These are recipes created by the user through AI generation.
 *
 * @returns {Promise<Array>} Array of user's generated recipes
 */
export const getUserGeneratedRecipes = () => {
  return httpAuthenticated.get("/recipes/user/generated");
};
