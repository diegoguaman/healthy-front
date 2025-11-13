import { Link } from "react-router-dom";
import "./RecipeCard.css";

/**
 * RecipeCard Component
 * Reusable card component for displaying recipe information.
 * Follows Single Responsibility Principle: handles recipe display only.
 * Follows DRY principle: reusable across different pages.
 *
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe object
 * @param {string} props.recipe._id - Recipe ID
 * @param {string} props.recipe.name - Recipe name
 * @param {string} props.recipe.phrase - Recipe description/phrase
 * @param {number} props.recipe.preparationTime - Preparation time in minutes
 * @param {string} props.recipe.urlImage - Recipe image URL
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles object
 */
const RecipeCard = ({ recipe, className = "", style = {} }) => {
  if (!recipe || !recipe._id) {
    return null;
  }

  return (
    <div
      className={`recipe-card ${className}`}
      style={style}
    >
      <div className="card mb-3" style={{ maxWidth: "540px", margin: "0 auto" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={recipe.urlImage || "/images/default-recipe.jpg"}
              className="img-fluid rounded-start recipe-card__image"
              alt={recipe.name || "Recipe"}
              loading="lazy"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title recipe-card__title">{recipe.name}</h5>
              {recipe.phrase && (
                <p className="card-text recipe-card__description">{recipe.phrase}</p>
              )}
              {recipe.preparationTime && (
                <p className="card-text">
                  <small className="text-muted">
                    <i className="fa-regular fa-clock me-1"></i>
                    {recipe.preparationTime} min
                  </small>
                </p>
              )}
              <Link
                to={`/recipes/${recipe._id}`}
                className="btn btn-custom recipe-card__link"
                style={{ color: "#83a580" }}
              >
                Ver más <i className="fa-solid fa-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

