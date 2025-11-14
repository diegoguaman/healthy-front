import { useEffect, useState } from "react";
import { getRecipe, toggleFavorite } from "../services/RecipesService";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../utils/error-handler";
import "../index.css";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import { useParams } from "react-router-dom";
import "./RecipesDetails.css";

/**
 * RecipeDetails Page Component
 * Displays detailed information about a specific recipe.
 * Follows Single Responsibility: handles recipe detail display.
 */
function RecipeDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  library.add(solidHeart, regularHeart);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const rcp = await getRecipe(id);
        setRecipe(rcp);
        setIsFavorite(rcp.isFavorite || false);
      } catch (err) {
        setError(handleApiError(err, "Recipe Details"));
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
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

  const handleToggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      const recipeDB = await toggleFavorite(id);
      setRecipe(recipeDB);
    } catch (err) {
      handleApiError(err, "Toggle Favorite");
      setIsFavorite(!isFavorite);
    }
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar la receta</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-details-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="recipe-details-card">
              <div className="row g-0">
                {/* Imagen a la izquierda */}
                <div className="col-12 col-md-5">
                  <div className="recipe-details-image-wrapper">
                    <img
                      src={recipe.urlImage}
                      alt={recipe.name}
                      className="recipe-details-image"
                    />
                    {user && (
                      <button
                        onClick={handleToggleFavorite}
                        className="recipe-details-favorite-btn"
                        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                      >
                        <FontAwesomeIcon
                          icon={isFavorite ? solidHeart : regularHeart}
                          className={isFavorite ? "favorite-active" : "favorite-inactive"}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Contenido a la derecha */}
                <div className="col-12 col-md-7">
                  <div className="recipe-details-content">
                    <h1 className="recipe-details-title">{recipe.name}</h1>
                    
                    {recipe.phrase && (
                      <p className="recipe-details-phrase">{recipe.phrase}</p>
                    )}

                    {recipe.preparationTime && (
                      <div className="recipe-details-info">
                        <i className="fa-regular fa-clock me-2"></i>
                        <span><strong>Tiempo de preparación:</strong> {recipe.preparationTime} minutos</span>
                      </div>
                    )}

                    {recipe.people && (
                      <div className="recipe-details-info">
                        <i className="fa-solid fa-users me-2"></i>
                        <span><strong>Porciones:</strong> {recipe.people} personas</span>
                      </div>
                    )}

                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <div className="recipe-details-section">
                        <h3 className="recipe-details-section-title">
                          <i className="fa-solid fa-list-ul me-2"></i>
                          Ingredientes
                        </h3>
                        <ul className="recipe-details-list">
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                              <i className="fa-solid fa-check-circle me-2"></i>
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {recipe.steps && recipe.steps.length > 0 && (
                      <div className="recipe-details-section">
                        <h3 className="recipe-details-section-title">
                          <i className="fa-solid fa-clipboard-list me-2"></i>
                          Elaboración
                        </h3>
                        <ol className="recipe-details-steps">
                          {recipe.steps.map((step, index) => (
                            <li key={index}>
                              <strong>Paso {index + 1}:</strong> {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className={`scroll-to-top ${showScroll ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
}

export default RecipeDetails;
