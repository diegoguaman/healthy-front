import createHttp from "./BaseService";

const http = createHttp(true);

/**
 * Retrieves the current authenticated user's information.
 * Requires authentication token.
 *
 * @returns {Promise<Object>} User object
 */
export const getCurrentUserService = () => {
  return http.get("/users/me");
};
