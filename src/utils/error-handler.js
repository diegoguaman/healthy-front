/**
 * Centralized Error Handler Utility
 * Provides consistent error handling across the application.
 * Follows DRY principle: single source of truth for error handling.
 * Follows Single Responsibility: handles error formatting and logging only.
 */

/**
 * Formats error messages for user display.
 * Handles different error types (API errors, network errors, etc.).
 *
 * @param {Error|Object|string} error - Error object, error response, or error message
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") {
      if (data.includes("Cannot GET") || data.includes("404")) {
        return "El recurso solicitado no está disponible en este momento.";
      }
      return data;
    }
    if (data.toString && typeof data.toString === "function") {
      const dataString = data.toString();
      if (dataString.includes("Cannot GET") || dataString.includes("404")) {
        return "El recurso solicitado no está disponible en este momento.";
      }
    }
  }

  return "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.";
};

/**
 * Logs error details for debugging (development only).
 * Does not log in production to avoid exposing sensitive information.
 *
 * @param {Error|Object} error - Error object or error response
 * @param {string} context - Context where the error occurred (e.g., "Login", "Recipe Generation")
 */
export const logError = (error, context = "Application") => {
  if (import.meta.env.DEV) {
    console.error(`[${context}] Error:`, error);
  }
};

/**
 * Handles API errors with consistent formatting and logging.
 * Combines formatting and logging for convenience.
 *
 * @param {Error|Object} error - Error object or error response
 * @param {string} context - Context where the error occurred
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error, context = "API") => {
  logError(error, context);
  return formatErrorMessage(error);
};

