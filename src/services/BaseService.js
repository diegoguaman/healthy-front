import axios from "axios";
import { getAccessToken, logout } from "../stores/AccessTokenStore";

const UNAUTHORIZED_STATUS_CODE = 401;
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Creates an HTTP client instance with optional authentication interceptor.
 * Follows Single Responsibility Principle: handles HTTP configuration and interceptors.
 *
 * @param {boolean} useAccessToken - Whether to include authentication token in requests
 * @returns {AxiosInstance} Configured axios instance
 */
const createHttp = (useAccessToken = false) => {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL environment variable is not defined");
  }

  const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  if (useAccessToken) {
    http.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  http.interceptors.response.use(
    (response) => {
      // Log successful responses in development
      if (import.meta.env.DEV) {
        console.log("[BaseService] Response:", {
          status: response.status,
          url: response.config?.url,
          data: response.data,
        });
      }
      return response.data;
    },
    (error) => {
      const statusCode = error?.response?.status;
      let errorData = error?.response?.data;

      // Log errors in development for debugging
      if (import.meta.env.DEV) {
        console.error("[BaseService] Request error:", {
          status: statusCode,
          url: error?.config?.url,
          method: error?.config?.method,
          data: error?.config?.data,
          responseData: errorData,
          message: error?.message,
        });
      }

      if (statusCode === UNAUTHORIZED_STATUS_CODE) {
        if (getAccessToken()) {
          logout();
        }
      }

      if (typeof errorData === "string" && errorData.includes("<!DOCTYPE")) {
        errorData = {
          message: statusCode === 404
            ? "El recurso solicitado no está disponible"
            : "Error del servidor",
          statusCode,
        };
      } else if (!errorData || typeof errorData !== "object") {
        errorData = {
          message: statusCode === 404
            ? "El recurso solicitado no está disponible"
            : "Ha ocurrido un error inesperado",
          statusCode,
        };
      }

      return Promise.reject({ ...errorData, response: error?.response });
    }
  );

  return http;
};

export default createHttp;
