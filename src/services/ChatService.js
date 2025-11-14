import createHttp from "./BaseService";

const http = createHttp(true);

/**
 * Generates recipes using AI based on provided ingredients.
 * Requires authentication and AI API key configured in backend.
 *
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {Promise<Object>} Object containing generated recipes
 */
export const createChat = (ingredients) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return Promise.reject(new Error("Ingredients array is required and cannot be empty"));
  }
  return http.post("/chat", { ingredients });
};