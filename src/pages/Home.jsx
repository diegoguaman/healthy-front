import { useEffect, useState } from "react";
import { createChat } from "../services/ChatService";
import { useAuth } from "../hooks/useAuth";
import { getRecipes } from "../services/RecipesService";
import { handleApiError } from "../utils/error-handler";
import { saveGeneratedRecipes } from "../utils/generatedRecipesStorage";
import RecipeCard from "../components/RecipeCard/RecipeCard";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
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

  const handleIngredient = (e) => {
    const { value } = e.target;
    if (ingredients.includes(value)) {
      setIngredients(
        ingredients.filter((ingredient) => {
          return ingredient !== value;
        })
      );
    } else {
      setIngredients([...ingredients, value]);
    }
  };

  /**
   * Handles recipe generation form submission.
   * Separates concerns: form handling vs API call.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    if (ingredients.length === 0) {
      return;
    }

    setLoadingApi(true);
    setShowModal(false);

    try {
      const response = await createChat(ingredients);
      const generatedRecipes = response.createdRecipes || response.recipes || [];
      
      if (generatedRecipes.length > 0) {
        saveGeneratedRecipes(generatedRecipes);
        setRecipesApi(generatedRecipes);
        setShowModal(true);
      }
      
      setIngredients([]);
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
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <div className="container">
            {user && (
              <>
                <h2 className="h2 mb-4">Puedes crear tu receta customizada</h2>
                <p className="text-center">
                  Elige los ingredientes que quieres probar y prepararemos
                  recetas para tí!
                </p>

                <form
                  onSubmit={onSubmit}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "center",
                    boxShadow: "0 0 10px #83a580",
                    padding: "15px",
                  }}
                >
                  {INGREDIENTS_VALUES.map((ingredient) => {
                    const IconComponent = ingredient.iconComponent;
                    return (
                      <button
                        key={ingredient.value}
                        type="button"
                        className="btn btn-custom-ingredients"
                        value={ingredient.value}
                        onClick={handleIngredient}
                      >
                        {!ingredients.includes(ingredient.value) ? (
                          IconComponent ? (
                            <IconComponent />
                          ) : (
                            <i className={`fa-solid ${ingredient.icon}`}></i>
                          )
                        ) : (
                          <i
                            className="fa-solid fa-check"
                            style={{ color: "#00ff6a" }}
                          ></i>
                        )}{" "}
                        {ingredient.text}
                      </button>
                    );
                  })}
                  <div className="row w-100 btn-lg-custom">
                    <div className="col d-flex justify-content-center mt-3">
                      <button
                        type="submit"
                        className="btn btn-custom btn-padding-custom"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
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
            <div className="row">
              {filteredRecipes.map((recipe) => (
                <div key={recipe._id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
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
