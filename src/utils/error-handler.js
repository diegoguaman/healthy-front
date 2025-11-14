/**
 * Centralized Error Handler Utility
 * Provides consistent error handling across the application.
 * Follows DRY principle: single source of truth for error handling.
 * Follows Single Responsibility: handles error formatting and logging only.
 */

/**
 * Formats error messages for user display.
 * Handles different error types (API errors, network errors, etc.).
 * Prioritizes backend error messages over generic messages.
 *
 * @param {Error|Object|string} error - Error object, error response, or error message
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  // Priority 1: Check error.response.data (from axios interceptors)
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Check for message property
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
    
    // Check for error property
    if (data?.error && typeof data.error === "string") {
      return data.error;
    }
    
    // Check if data is a string directly
    if (typeof data === "string") {
      if (data.includes("Cannot GET") || data.includes("404")) {
        return "El recurso solicitado no está disponible en este momento.";
      }
      return data;
    }
    
    // Check for nested error objects
    if (data?.error?.message) {
      return data.error.message;
    }
  }

  // Priority 2: Check top-level message property
  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  // Priority 3: Check for network errors
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return "La solicitud tardó demasiado. Por favor, intenta de nuevo.";
  }

  if (error?.message?.includes("Network Error")) {
    return "Error de conexión. Verifica tu conexión a internet.";
  }

  // Default fallback message
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

