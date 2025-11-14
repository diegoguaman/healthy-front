import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDayPlanById } from "../services/DayPlanService";
import { handleApiError } from "../utils/error-handler";
import { useAuth } from "../hooks/useAuth";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import { Alert, Button } from "react-bootstrap";
import RecipeCard from "../components/RecipeCard/RecipeCard";
import "../index.css";
import "./DayPlanDetails.css";

/**
 * DayPlanDetails Page Component
 * Displays detailed information about a specific daily meal plan.
 * Follows Single Responsibility: handles plan detail display.
 */
const DayPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const planData = await getDayPlanById(id);
        setPlan(planData);
      } catch (err) {
        setError(handleApiError(err, "Day Plan Details"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlan();
    }
  }, [id]);

  /**
   * Formats a date string to a readable Spanish format.
   * Handles various date formats and invalid dates gracefully.
   *
   * @param {string|Date} dateInput - Date string or Date object
   * @returns {string} Formatted date string or fallback text
   */
  const formatDate = (dateInput) => {
    if (!dateInput) {
      return "Fecha no disponible";
    }

    try {
      let date;
      
      // Handle different input types
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === "string") {
        // Try parsing the date string
        date = new Date(dateInput);
      } else {
        return "Fecha no disponible";
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Fecha no disponible";
      }

      // Format the date
      const formatted = date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Capitalize first letter
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (error) {
      console.error("Error formatting date:", error, dateInput);
      return "Fecha no disponible";
    }
  };

  /**
   * Formats a time string to HH:mm format.
   * Handles various time formats gracefully.
   *
   * @param {string} timeString - Time string (HH:mm:ss, HH:mm, etc.)
   * @returns {string} Formatted time string or empty string
   */
  const formatTime = (timeString) => {
    if (!timeString) {
      return "";
    }

    try {
      // Handle different time formats
      let time;
      
      // If it's already in HH:mm format, use it directly
      if (typeof timeString === "string" && timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      
      // Try parsing as full time string
      if (timeString.includes("T")) {
        time = new Date(timeString);
      } else {
        // Try parsing as time-only string
        time = new Date(`2000-01-01T${timeString}`);
      }

      // Check if time is valid
      if (isNaN(time.getTime())) {
        return "";
      }

      return time.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      console.error("Error formatting time:", error, timeString);
      return "";
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
        <Alert variant="danger">
          <Alert.Heading>Error al cargar el plan</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate("/day-plan")}>
            Volver a Planes
          </Button>
        </Alert>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          <Alert.Heading>Plan no encontrado</Alert.Heading>
          <p>El plan solicitado no existe o no tienes acceso a él.</p>
          <Button variant="primary" onClick={() => navigate("/day-plan")}>
            Volver a Planes
          </Button>
        </Alert>
      </div>
    );
  }

  const meals = plan.meals || [];
  const mealTypes = {
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    snack: "Merienda",
  };

  return (
    <div className="day-plan-details-page">
      <div className="container">
        {/* Header */}
        <div className="plan-details-header">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/day-plan")}
            className="back-button"
          >
            <i className="fa-solid fa-arrow-left me-2"></i>
            Volver a Planes
          </Button>
          <h1 className="plan-details-title">
            <i className="fa-solid fa-calendar-day me-2"></i>
            Plan de Comidas
          </h1>
          <p className="plan-details-date">{formatDate(plan.date)}</p>
        </div>

        {/* Plan Summary */}
        <div className="plan-summary-card">
          <div className="summary-item">
            <i className="fa-solid fa-utensils"></i>
            <div>
              <strong>{meals.length}</strong>
              <span>{meals.length === 1 ? " comida" : " comidas"}</span>
            </div>
          </div>
          {user && (
            <div className="summary-item">
              <i className="fa-solid fa-user"></i>
              <div>
                <strong>Personalizado</strong>
                <span> para ti</span>
              </div>
            </div>
          )}
        </div>

        {/* Meals List */}
        {meals.length > 0 ? (
          <div className="meals-section">
            <h2 className="meals-section-title">
              <i className="fa-solid fa-list-ul me-2"></i>
              Comidas del Día
            </h2>
            <div className="meals-list">
              {meals.map((meal, index) => {
                // Handle different response structures from backend
                const mealData = meal?.meal || meal;
                const recipe = mealData?.recipe || mealData;
                const mealTime = meal?.time || mealData?.time || meal?.meal?.time;
                const mealType = meal?.type || mealData?.type || meal?.meal?.type || "meal";
                const mealName = mealData?.name || meal?.meal?.name || recipe?.name;

                // Skip if no recipe data
                if (!recipe) {
                  return (
                    <div key={index} className="meal-item">
                      <div className="meal-time-badge">
                        {mealTime && (
                          <span className="time-label">
                            <i className="fa-solid fa-clock me-1"></i>
                            {formatTime(mealTime)}
                          </span>
                        )}
                        <span className="meal-type-label">
                          {mealTypes[mealType] || "Comida"}
                        </span>
                      </div>
                      <div className="meal-recipe">
                        <Alert variant="info">
                          <strong>{mealName || `Comida ${index + 1}`}</strong>
                          <p className="mb-0">Información de receta no disponible</p>
                        </Alert>
                      </div>
                    </div>
                  );
                }

                // Only render RecipeCard if we have a valid recipe with _id
                if (!recipe._id) {
                  return (
                    <div key={index} className="meal-item">
                      <div className="meal-time-badge">
                        {mealTime && (
                          <span className="time-label">
                            <i className="fa-solid fa-clock me-1"></i>
                            {formatTime(mealTime)}
                          </span>
                        )}
                        <span className="meal-type-label">
                          {mealTypes[mealType] || "Comida"}
                        </span>
                      </div>
                      <div className="meal-recipe">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">{recipe.name || mealName || `Comida ${index + 1}`}</h5>
                            {recipe.phrase && <p className="card-text">{recipe.phrase}</p>}
                            {recipe.preparationTime && (
                              <p className="card-text">
                                <small className="text-muted">
                                  {recipe.preparationTime} minutos
                                </small>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className="meal-item">
                    <div className="meal-time-badge">
                      {mealTime && (
                        <span className="time-label">
                          <i className="fa-solid fa-clock me-1"></i>
                          {formatTime(mealTime)}
                        </span>
                      )}
                      <span className="meal-type-label">
                        {mealTypes[mealType] || "Comida"}
                      </span>
                    </div>
                    <div className="meal-recipe">
                      <RecipeCard recipe={recipe} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <Alert variant="info">
            <Alert.Heading>Sin comidas</Alert.Heading>
            <p>Este plan no tiene comidas asignadas.</p>
          </Alert>
        )}

        {/* Actions */}
        <div className="plan-actions">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/day-plan")}
            className="btn-custom-outline"
          >
            <i className="fa-solid fa-list me-2"></i>
            Ver Todos los Planes
          </Button>
          <Button
            variant="primary"
            className="btn-custom"
            onClick={() => navigate("/day-plan")}
          >
            <i className="fa-solid fa-plus me-2"></i>
            Crear Nuevo Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DayPlanDetails;

