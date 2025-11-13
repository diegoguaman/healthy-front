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

/**
 * Generates a daily meal plan for the authenticated user.
 * Requires authentication and AI API key configured in backend.
 *
 * @param {Object} data - Plan data containing startDate and userPreferences
 * @param {string} data.startDate - Start date in YYYY-MM-DD format
 * @param {Object} data.userPreferences - User preferences (objetive, ability, typeDiet, alergic)
 * @returns {Promise<Object>} Daily meal plan object
 */
export const createDayPlan = (data) => {
  if (!data?.startDate || !data?.userPreferences) {
    return Promise.reject(new Error("startDate and userPreferences are required"));
  }
  return http.post("/dayPlan", data);
};