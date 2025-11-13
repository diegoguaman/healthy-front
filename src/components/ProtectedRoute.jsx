import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PacmanLoading from "./PacmanLoading/PacmanLoading";

/**
 * ProtectedRoute Component
 * Guards routes that require authentication.
 * Follows Single Responsibility Principle: handles route protection only.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Protected content or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoaded } = useAuth();

  if (!isAuthLoaded) {
    return <PacmanLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
