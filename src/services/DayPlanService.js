import createHttp from "./BaseService";

const http = createHttp(true);

/**
 * Generates a daily meal plan for the authenticated user.
 * Requires authentication and AI API key configured in backend.
 * Can take 1-2 minutes to complete.
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

  if (!data.userPreferences.objetive || !data.userPreferences.ability || !data.userPreferences.typeDiet) {
    return Promise.reject(new Error("userPreferences must include objetive, ability, and typeDiet"));
  }

  return http.post("/dayPlan", data);
};

/**
 * Retrieves all daily meal plans for the authenticated user.
 * Requires authentication.
 *
 * @returns {Promise<Array>} Array of daily meal plan objects
 */
export const getUserDayPlans = () => {
  return http.get("/userDayPlans");
};

/**
 * Retrieves a specific daily meal plan by ID.
 * Requires authentication.
 * Note: Currently fetches all plans and filters by ID on the client side
 * because the backend endpoint /userDayPlans/:id is not yet implemented.
 *
 * @param {string} planId - Daily meal plan ID
 * @returns {Promise<Object>} Daily meal plan object
 */
export const getDayPlanById = async (planId) => {
  if (!planId) {
    return Promise.reject(new Error("Plan ID is required"));
  }
  
  // TODO: Replace with direct endpoint when backend implements GET /userDayPlans/:id
  // For now, fetch all plans and filter by ID
  const allPlans = await http.get("/userDayPlans");
  const plan = Array.isArray(allPlans) 
    ? allPlans.find((p) => p._id === planId || p.dailyMealPlan?._id === planId)
    : null;
  
  if (!plan) {
    return Promise.reject(new Error("Plan not found"));
  }
  
  // Handle both response formats: direct plan object or nested in dailyMealPlan
  return plan.dailyMealPlan || plan;
};

