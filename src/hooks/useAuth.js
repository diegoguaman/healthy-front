import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Custom hook to access authentication context.
 * Provides a clean API for components to interact with auth state.
 * Follows DRY principle: centralizes auth logic access.
 *
 * @returns {Object} Auth context value with user, login, logout, updateUser, and isAuthLoaded
 * @throws {Error} If used outside AuthContextProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
};

