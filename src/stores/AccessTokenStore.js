const JWT_TOKEN_KEY = "accessToken";

let _accessToken = localStorage.getItem(JWT_TOKEN_KEY) || "";

/**
 * Stores the access token in localStorage and memory.
 * Follows Single Responsibility: handles token storage only.
 *
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  if (!token) {
    throw new Error("Token cannot be empty");
  }
  localStorage.setItem(JWT_TOKEN_KEY, token);
  _accessToken = token;
};

/**
 * Retrieves the current access token from memory.
 * Uses in-memory cache for better performance (avoids localStorage reads).
 *
 * @returns {string} Current access token or empty string
 */
export const getAccessToken = () => {
  if (!_accessToken) {
    _accessToken = localStorage.getItem(JWT_TOKEN_KEY) || "";
  }
  return _accessToken;
};

/**
 * Removes the access token from localStorage and memory.
 * Does not handle navigation (separation of concerns).
 * Navigation should be handled by components or context.
 */
export const clearAccessToken = () => {
  localStorage.removeItem(JWT_TOKEN_KEY);
  _accessToken = "";
};

/**
 * Legacy logout function for backward compatibility.
 * Redirects to login page after clearing token.
 * @deprecated Use clearAccessToken() and handle navigation in components
 */
export const logout = () => {
  clearAccessToken();
  window.location.assign("/login");
};