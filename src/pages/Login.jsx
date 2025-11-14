import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loginService } from "../services/UserService";
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../utils/error-handler";
import "../index.css";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";

/**
 * Login Page Component
 * Handles user authentication.
 * Follows Single Responsibility: handles login form and authentication flow.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  /**
   * Handles input field changes.
   * Uses functional update pattern for better performance.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission and authentication.
   * Separates concerns: form handling vs authentication logic.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await loginService(credentials);
      login(token, () => {
        navigate("/user-profile");
      });
    } catch (err) {
      setError(handleApiError(err, "Login"));
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="mt-3 mb-2">
      {loading ? (
        <PacmanLoading />
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label form-label-center">
                Email
              </label>
              <input
                name="email"
                onChange={handleInputChange}
                value={credentials.email}
                type="email"
                className="form-control form-control-custom"
                id="email"
                required
                placeholder="Add a email..."
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label form-label-center"
              >
                Password
              </label>
              <input
                name="password"
                onChange={handleInputChange}
                value={credentials.password}
                type="password"
                className="form-control form-control-custom"
                id="password"
                required
                placeholder="Add a password..."
                disabled={loading}
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="btn-container">
              <button type="submit" className="btn btn-custom btn-lg px-5">
                Entrar
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
