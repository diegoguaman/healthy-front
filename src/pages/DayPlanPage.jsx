import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createDayPlan, getUserDayPlans } from "../services/DayPlanService";
import { handleApiError } from "../utils/error-handler";
import DayPlanCard from "../components/DayPlanCard/DayPlanCard";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import { Alert, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { registerLocale } from "react-datepicker";
import "../index.css";
import "./DayPlanPage.css";

registerLocale("es", es);

/**
 * DayPlanPage Component
 * Allows users to create and view their daily meal plans.
 * Follows Single Responsibility: handles day plan creation and display.
 */
const DayPlanPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newPlan, setNewPlan] = useState(null);

  /**
   * Fetches user's day plans from the API.
   */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const userPlans = await getUserDayPlans();
        setPlans(Array.isArray(userPlans) ? userPlans : []);
      } catch (err) {
        setError(handleApiError(err, "Day Plans"));
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user]);

  /**
   * Handles day plan creation form submission.
   */
  const handleCreatePlan = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Debes iniciar sesión para crear un plan");
      return;
    }

    const startDate = selectedDate.toISOString().split("T")[0];
    const userPreferences = {
      objetive: user.objetive || "comer equilibrado",
      ability: user.ability || "medio",
      typeDiet: user.typeDiet || "omnivoro",
      alergic: user.alergic || "ninguna",
    };

    setCreating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await createDayPlan({
        startDate,
        userPreferences,
      });

      if (response?.dailyMealPlan) {
        setNewPlan(response.dailyMealPlan);
        setShowSuccessModal(true);
        setSuccessMessage("¡Plan generado exitosamente!");
        
        const updatedPlans = await getUserDayPlans();
        setPlans(Array.isArray(updatedPlans) ? updatedPlans : []);
      }
    } catch (err) {
      setError(handleApiError(err, "Day Plan Creation"));
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          <Alert.Heading>Acceso restringido</Alert.Heading>
          <p>Debes iniciar sesión para acceder a los planes de comidas.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="day-plan-page">
      <div className="container">
        {/* Header */}
        <div className="day-plan-header">
          <h1 className="day-plan-title">
            <i className="fa-solid fa-calendar-check me-2"></i>
            Planes de Comidas Diarios
          </h1>
          <p className="day-plan-subtitle">
            Genera planes personalizados basados en tus preferencias y objetivos
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)} className="mb-4">
            {successMessage}
          </Alert>
        )}

        {/* Create Plan Section */}
        <div className="create-plan-section">
          <div className="create-plan-card">
            <h2 className="create-plan-title">
              <i className="fa-solid fa-plus-circle me-2"></i>
              Crear Nuevo Plan
            </h2>
            <p className="create-plan-description">
              Selecciona una fecha y generaremos un plan de comidas personalizado para ti.
              Este proceso puede tardar 1-2 minutos.
            </p>

            <form onSubmit={handleCreatePlan} className="create-plan-form">
              <div className="form-group">
                <label htmlFor="planDate" className="form-label">
                  <i className="fa-solid fa-calendar me-2"></i>
                  Fecha del Plan
                </label>
                <DatePicker
                  id="planDate"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="form-control date-picker-custom"
                  placeholderText="Selecciona una fecha"
                  required
                />
              </div>

              <div className="user-preferences-info">
                <h4 className="preferences-title">Tus Preferencias:</h4>
                <div className="preferences-grid">
                  <div className="preference-item">
                    <i className="fa-solid fa-bullseye me-2"></i>
                    <strong>Objetivo:</strong> {user.objetive || "No especificado"}
                  </div>
                  <div className="preference-item">
                    <i className="fa-solid fa-fire me-2"></i>
                    <strong>Habilidad:</strong> {user.ability || "No especificado"}
                  </div>
                  <div className="preference-item">
                    <i className="fa-solid fa-leaf me-2"></i>
                    <strong>Dieta:</strong> {user.typeDiet || "No especificado"}
                  </div>
                  <div className="preference-item">
                    <i className="fa-solid fa-exclamation-triangle me-2"></i>
                    <strong>Alergias:</strong> {user.alergic || "Ninguna"}
                  </div>
                </div>
                <small className="text-muted">
                  <Link to="/user-profile" style={{ color: "#83a580", textDecoration: "none" }}>
                    <i className="fa-solid fa-edit me-1"></i>
                    Puedes actualizar tus preferencias en tu perfil
                  </Link>
                </small>
              </div>

              <Button
                type="submit"
                className="btn btn-custom create-plan-btn"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generando plan... (esto puede tardar 1-2 minutos)
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                    Generar Plan
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* My Plans Section */}
        <div className="my-plans-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-list me-2"></i>
              Mis Planes Guardados
            </h2>
            {plans.length > 0 && (
              <span className="badge bg-success fs-6">
                {plans.length} {plans.length === 1 ? "plan" : "planes"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <PacmanLoading />
            </div>
          ) : plans.length > 0 ? (
            <div className="plans-grid">
              {plans.map((plan) => (
                <div key={plan._id} className="plan-card-wrapper">
                  <DayPlanCard plan={plan} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="fa-solid fa-calendar-xmark"></i>
              </div>
              <h3 className="empty-state-title">Aún no has creado planes</h3>
              <p className="empty-state-description">
                Crea tu primer plan de comidas usando el formulario de arriba
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa-solid fa-check-circle text-success me-2"></i>
            ¡Plan Generado Exitosamente!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Tu plan de comidas para <strong>{new Date(newPlan?.date).toLocaleDateString("es-ES")}</strong> ha sido generado.
          </p>
          {newPlan?.meals && (
            <div className="generated-plan-preview">
              <h5>Comidas incluidas:</h5>
              <ul>
                {newPlan.meals.slice(0, 5).map((meal, index) => (
                  <li key={index}>
                    {meal?.meal?.recipe?.name || meal?.meal?.name || `Comida ${index + 1}`}
                  </li>
                ))}
                {newPlan.meals.length > 5 && (
                  <li className="text-muted">y {newPlan.meals.length - 5} más...</li>
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            className="btn-custom"
            onClick={() => {
              setShowSuccessModal(false);
              window.scrollTo({ top: document.querySelector(".my-plans-section").offsetTop - 100, behavior: "smooth" });
            }}
          >
            Ver Mis Planes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DayPlanPage;

