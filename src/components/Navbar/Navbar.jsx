import { Link, useNavigate } from "react-router-dom";
import { clearAccessToken } from "../../stores/AccessTokenStore";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import "./navbar.css";

/**
 * Navbar Component
 * Main navigation bar with authentication-aware menu items.
 * Follows Single Responsibility: handles navigation UI only.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout: logoutFromContext } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Closes mobile menu on scroll for better UX.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  /**
   * Toggles mobile menu visibility.
   */
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /**
   * Handles user logout.
   * Separates concerns: token clearing vs navigation.
   */
  const handleLogout = () => {
    clearAccessToken();
    logoutFromContext();
    navigate("/login");
  };


  return (
    <nav
      className="navbar navbar-expand-lg bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={{ color: "#83A580" }}>
          <img
            src="/Logo-Healthy2.png"
            className="img-fluid"
            style={{ width: "auto", height: "70px" }}
            alt="Healthy App"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          style={{ borderColor: "#83A580" }}
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              {!user && (
                <Link className="nav-link" aria-current="page" to="/register">
                  Registro
                </Link>
              )}
            </li>
            <li className="nav-item">
              {!user && (
                <Link className="nav-link" aria-current="page" to="/login">
                  Iniciar sesión
                </Link>
              )}
            </li>
            {user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Mi perfil
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <Link className="dropdown-item" to="/user-profile">
                      Mis datos personales
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/generated-recipes">
                      <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                      Mis recetas generadas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/favorite-recipes">
                      <i className="fa-solid fa-heart me-2"></i>
                      Mis recetas favoritas
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fa-solid fa-user me-2"></i>
                      Ver perfil completo
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            <li className="nav-item">
              {user && (
                <Link className="nav-link" aria-current="page" to="/calendar">
                  Calendario
                </Link>
              )}
            </li>
            <li className="nav-item">
              {user && (
                <button onClick={handleLogout} className="btn btn-custom ms-2">
                  Cerrar Sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
