import { createContext, useEffect, useState, useCallback } from "react";
import { getAccessToken, setAccessToken } from "../stores/AccessTokenStore";
import { getCurrentUserService } from "./../services/AuthService";

export const AuthContext = createContext();

/**
 * AuthContext Provider Component
 * Manages authentication state and user data.
 * Follows Single Responsibility Principle: handles only authentication state.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  /**
   * Fetches current user data from the API.
   * Uses useCallback to prevent unnecessary re-renders (React optimization).
   *
   * @param {Function} onSuccess - Optional callback to execute on success
   */
  const fetchCurrentUser = useCallback((onSuccess) => {
    getCurrentUserService()
      .then((userData) => {
        setUser(userData);
        setIsAuthLoaded(true);
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        }
      })
      .catch(() => {
        setUser(null);
        setIsAuthLoaded(true);
      });
  }, []);

  /**
   * Updates user state with new data.
   * Follows DRY principle: single function for user updates.
   *
   * @param {Object} updatedUser - Updated user object
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  /**
   * Handles user login by storing token and fetching user data.
   * Separates concerns: token storage vs user data fetching.
   *
   * @param {string} token - JWT authentication token
   * @param {Function} onSuccess - Optional callback to execute after successful login
   */
  const login = useCallback((token, onSuccess) => {
    if (!token) {
      throw new Error("Token is required for login");
    }
    setAccessToken(token);
    fetchCurrentUser(onSuccess);
  }, [fetchCurrentUser]);

  /**
   * Handles user logout by clearing user state and token.
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthLoaded(false);
  }, []);

  /**
   * Initializes authentication state on mount.
   * Checks for existing token and loads user if available.
   */
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser();
    } else {
      setIsAuthLoaded(true);
    }
  }, [fetchCurrentUser]);

  const value = {
    login,
    logout,
    user,
    updateUser,
    isAuthLoaded,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};