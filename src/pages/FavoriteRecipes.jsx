import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import { getFavorites } from "../services/RecipesService";
import { handleApiError } from "../utils/error-handler";
import RecipeCard from "../components/RecipeCard/RecipeCard";
import { Alert } from "react-bootstrap";

/**
 * FavoriteRecipes Page Component
 * Displays user's favorite recipes.
 * Follows Single Responsibility: handles display of favorite recipes.
 */
const FavoriteRecipes = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const favoritesDB = await getFavorites();
        setFavorites(Array.isArray(favoritesDB) ? favoritesDB : []);
      } catch (err) {
        setError(handleApiError(err, "Favorite Recipes"));
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <PacmanLoading />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="h2 mb-3" style={{ color: "#83a580" }}>
            <i className="fa-solid fa-heart me-2"></i>
            Recetas Favoritas
          </h1>
          <p className="text-muted">
            Tus recetas guardadas para acceso rápido
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          <Alert.Heading>Error al cargar recetas favoritas</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {favorites.length > 0 ? (
        <>
          <div className="row mb-3">
            <div className="col-12 text-end">
              <span className="badge bg-danger fs-6">
                {favorites.length} {favorites.length === 1 ? "receta favorita" : "recetas favoritas"}
              </span>
            </div>
          </div>

          <div className="row">
            {favorites.map((recipe) => (
              <div key={recipe._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-5 py-5">
          <div className="mb-4">
            <i className="fa-solid fa-heart" style={{ fontSize: "4rem", color: "#83a580", opacity: 0.5 }}></i>
          </div>
          <h3 className="h4 mb-3">Aún no has guardado recetas como favoritas</h3>
          <p className="text-muted mb-4">
            Explora las recetas disponibles y marca tus favoritas para acceso rápido
          </p>
          <Link to="/" className="btn btn-custom">
            <i className="fa-solid fa-arrow-left me-2"></i>
            Volver a la página principal
          </Link>
        </div>
      )}

      <button
        className={`scroll-to-top ${showScroll ? "show" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default FavoriteRecipes;
