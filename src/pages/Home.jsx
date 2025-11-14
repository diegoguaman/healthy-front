import { useEffect, useState } from "react";
import { createChat } from "../services/ChatService";
import { useAuth } from "../hooks/useAuth";
import { getRecipes } from "../services/RecipesService";
import { handleApiError } from "../utils/error-handler";
import { saveGeneratedRecipes } from "../utils/generatedRecipesStorage";
import RecipeCard from "../components/RecipeCard/RecipeCard";
import "../index.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import { BsSearch } from "react-icons/bs";
import { INGREDIENTS_VALUES } from "../utils/ingredientsButtons";
import { Button, Modal, Alert } from "react-bootstrap";

/**
 * Home Page Component
 * Displays recipes and allows authenticated users to generate custom recipes.
 * Follows Single Responsibility: handles recipe display and generation UI.
 */
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [customIngredients, setCustomIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recipesApi, setRecipesApi] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchInput = (event) => {
    const searchQuery = event.target.value;
    setSearch(searchQuery);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesDB = await getRecipes();
        setRecipes(Array.isArray(recipesDB) ? recipesDB : []);
      } catch (err) {
        handleApiError(err, "Recipes");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
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

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.find((ingredient) =>
        ingredient.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  /**
   * Handles ingredient button click.
   * Adds or removes ingredient from selected list and updates custom input.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - Click event
   */
  const handleIngredient = (e) => {
    const { value } = e.target;
    let updatedIngredients;
    
    if (ingredients.includes(value)) {
      updatedIngredients = ingredients.filter((ingredient) => ingredient !== value);
    } else {
      updatedIngredients = [...ingredients, value];
    }
    
    setIngredients(updatedIngredients);
    updateCustomIngredientsInput(updatedIngredients);
  };

  /**
   * Updates the custom ingredients input with selected ingredients.
   *
   * @param {Array<string>} selectedIngredients - Array of selected ingredient values
   */
  const updateCustomIngredientsInput = (selectedIngredients) => {
    const customInputValue = selectedIngredients.join(", ");
    setCustomIngredients(customInputValue);
  };

  /**
   * Handles custom ingredients input change.
   * Parses comma-separated values and updates ingredients list.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleCustomIngredientsChange = (e) => {
    const value = e.target.value;
    setCustomIngredients(value);
    
    const parsedIngredients = value
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0);
    
    setIngredients(parsedIngredients);
  };

  /**
   * Removes an ingredient from the list.
   *
   * @param {string} ingredientToRemove - Ingredient to remove
   */
  const removeIngredient = (ingredientToRemove) => {
    const updatedIngredients = ingredients.filter((ing) => ing !== ingredientToRemove);
    setIngredients(updatedIngredients);
    updateCustomIngredientsInput(updatedIngredients);
  };

  /**
   * Handles recipe generation form submission.
   * Separates concerns: form handling vs API call.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    const finalIngredients = ingredients.length > 0 
      ? ingredients 
      : customIngredients.split(",").map((ing) => ing.trim()).filter((ing) => ing.length > 0);

    if (finalIngredients.length === 0) {
      setError("Por favor, selecciona o escribe al menos un ingrediente");
      return;
    }

    setLoadingApi(true);
    setShowModal(false);
    setError(null);

    try {
      const response = await createChat(finalIngredients);
      const generatedRecipes = response.createdRecipes || response.recipes || [];
      
      if (generatedRecipes.length > 0) {
        saveGeneratedRecipes(generatedRecipes);
        setRecipesApi(generatedRecipes);
        setShowModal(true);
      }
      
      setIngredients([]);
      setCustomIngredients("");
      setError(null);
    } catch (err) {
      setError(handleApiError(err, "Recipe Generation"));
      setIngredients([]);
    } finally {
      setLoadingApi(false);
    }
  };

  return (
    <div className="container mt-3">
      {loadingApi ? (
        <>
          <div className="container text-center mb-5 mt-5">
            <h2 className="h2 mb-3">
              Sus recetas se están preparando...a fuego lento
            </h2>
            <p>En breves momentos las recibirá en su email</p>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-center">Bienvenido</h2>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <div className="container">
            {user && (
              <div className="custom-recipe-section">
                <div className="custom-recipe-header">
                  <h2 className="custom-recipe-title">
                    <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                    Crea tu receta personalizada
                  </h2>
                  <p className="custom-recipe-subtitle">
                    Elige ingredientes de la lista o escribe los tuyos propios
                  </p>
                </div>

                <form onSubmit={onSubmit} className="custom-recipe-form">
                  {/* Input para ingredientes personalizados */}
                  <div className="custom-ingredients-input-wrapper">
                    <label htmlFor="customIngredients" className="custom-input-label">
                      <i className="fa-solid fa-pencil me-2"></i>
                      Ingredientes seleccionados
                    </label>
                    <div className="input-with-chips">
                      <input
                        id="customIngredients"
                        type="text"
                        className="form-control custom-ingredients-input"
                        placeholder="Escribe ingredientes separados por comas o selecciona de la lista..."
                        value={customIngredients}
                        onChange={handleCustomIngredientsChange}
                      />
                      {ingredients.length > 0 && (
                        <div className="selected-ingredients-chips">
                          {ingredients.map((ingredient, index) => (
                            <span key={index} className="ingredient-chip">
                              {ingredient}
                              <button
                                type="button"
                                className="chip-remove-btn"
                                onClick={() => removeIngredient(ingredient)}
                                aria-label={`Eliminar ${ingredient}`}
                              >
                                <i className="fa-solid fa-times"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <small className="form-text text-muted">
                      Puedes escribir ingredientes separados por comas o hacer clic en los botones de abajo
                    </small>
                  </div>

                  {/* Grid de botones de ingredientes */}
                  <div className="ingredients-grid">
                    {INGREDIENTS_VALUES.map((ingredient) => {
                      const IconComponent = ingredient.iconComponent;
                      const isSelected = ingredients.includes(ingredient.value);
                      return (
                        <button
                          key={ingredient.value}
                          type="button"
                          className={`ingredient-btn ${isSelected ? "ingredient-btn-selected" : ""}`}
                          value={ingredient.value}
                          onClick={handleIngredient}
                        >
                          <span className="ingredient-icon">
                            {isSelected ? (
                              <i className="fa-solid fa-check-circle"></i>
                            ) : IconComponent ? (
                              <IconComponent />
                            ) : (
                              <i className={`fa-solid ${ingredient.icon}`}></i>
                            )}
                          </span>
                          <span className="ingredient-text">{ingredient.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Botón de envío */}
                  <div className="submit-button-wrapper">
                    <button
                      type="submit"
                      className="btn btn-custom submit-recipe-btn"
                      disabled={loadingApi || (ingredients.length === 0 && customIngredients.trim().length === 0)}
                    >
                      {loadingApi ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                          Generar Recetas
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Separador visual entre ingredientes y recetas */}
          {user && <div style={{ marginTop: "3rem", marginBottom: "2rem" }}></div>}
          
          {user && recipesApi && recipesApi.length > 0 && (
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="fa-solid fa-check-circle text-success me-2"></i>
                  ¡Tus recetas están listas!
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="mb-3">
                  Se han generado <strong>{recipesApi.length}</strong>{" "}
                  {recipesApi.length === 1 ? "receta personalizada" : "recetas personalizadas"} para ti.
                </p>
                <p className="text-muted small mb-3">
                  <i className="fa-solid fa-envelope me-1"></i>
                  También las hemos enviado a tu email.
                </p>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    className="btn-custom"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/generated-recipes");
                    }}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                    Ver mis recetas generadas
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Continuar explorando
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          )}
          {loading ? (
            <>
              <div>
                <PacmanLoading />
              </div>
            </>
          ) : (
            <>
              {/* Separador visual antes de las recetas */}
              <div style={{ position: "relative" }}>
            <input
              className="form-control me-2 mb-4 mt-3"
              type="search"
              placeholder="Busca tu receta"
              aria-label="Search"
              style={{ borderColor: "#83A580" }}
              onChange={handleSearchInput}
            />
            <BsSearch
              style={{
                position: "absolute",
                right: "30px",
                top: "8px",
                fontSize: "20px",
                color: "#83A580",
              }}
            />
          </div>
              <div style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
                <h3 className="text-center mb-4" style={{ color: "#83a580" }}>
                  <i className="fa-solid fa-utensils me-2"></i>
                  Recetas Disponibles
                </h3>
              </div>
              <div className="row">
                {filteredRecipes.map((recipe) => (
                  <div key={recipe._id} className="col-12 col-md-6 col-lg-4 mb-4">
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            </>
          )}
          <button
            className={`scroll-to-top ${showScroll ? "show" : ""}`}
            onClick={scrollToTop}
          >
            ↑
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
