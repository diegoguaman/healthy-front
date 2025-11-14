import { useEffect, useState } from "react";
import { createUser } from "../services/UserService";
import Input from "../components/Input/Input";
import MultiStepForm from "../components/MultiStepForm/MultiStepForm";
import { useNavigate } from "react-router-dom";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { handleApiError } from "../utils/error-handler";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    weight: "",
    height: "",
    objetive: "",
    ability: "",
    typeDiet: "",
    alergic: "",
  });

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  /**
   * Handles input field changes.
   * Uses functional update pattern for better performance.
   * Clears error when user starts typing to provide immediate feedback.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - Input change event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing to correct the issue
    if (error) {
      setError("");
    }
  };

  /**
   * Prepares user data for API submission.
   * Converts string numbers to actual numbers and removes empty fields.
   *
   * @param {Object} userData - Raw user data from form
   * @returns {Object} Cleaned and formatted user data
   */
  const prepareUserData = (userData) => {
    const preparedData = { ...userData };

    // Convert weight and height to numbers if they have values
    if (preparedData.weight && preparedData.weight !== "") {
      preparedData.weight = Number(preparedData.weight);
    } else {
      // Remove weight if empty
      delete preparedData.weight;
    }

    if (preparedData.height && preparedData.height !== "") {
      preparedData.height = Number(preparedData.height);
    } else {
      // Remove height if empty
      delete preparedData.height;
    }

    // Remove empty string fields (except password which might be empty intentionally)
    Object.keys(preparedData).forEach((key) => {
      if (
        preparedData[key] === "" &&
        key !== "password" &&
        key !== "weight" &&
        key !== "height"
      ) {
        delete preparedData[key];
      }
    });

    return preparedData;
  };

  /**
   * Validates user data before submission.
   *
   * @param {Object} userData - User data to validate
   * @returns {Object} Validation result with isValid flag and error message
   */
  const validateUserData = (userData) => {
    if (!userData.name || userData.name.trim() === "") {
      return { isValid: false, error: "El nombre es requerido" };
    }

    if (!userData.email || userData.email.trim() === "") {
      return { isValid: false, error: "El email es requerido" };
    }

    if (!userData.password || userData.password.trim() === "") {
      return { isValid: false, error: "La contraseña es requerida" };
    }

    if (!userData.gender || userData.gender === "") {
      return { isValid: false, error: "El género es requerido" };
    }

    if (!userData.objetive || userData.objetive === "") {
      return { isValid: false, error: "El objetivo es requerido" };
    }

    if (!userData.ability || userData.ability === "") {
      return { isValid: false, error: "La habilidad en la cocina es requerida" };
    }

    if (!userData.typeDiet || userData.typeDiet === "") {
      return { isValid: false, error: "El tipo de dieta es requerido" };
    }

    if (!userData.alergic || userData.alergic === "") {
      return { isValid: false, error: "Debes indicar si tienes alergias o no" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { isValid: false, error: "El formato del email no es válido" };
    }

    // Validate password length
    if (userData.password.length < 6) {
      return {
        isValid: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    return { isValid: true, error: null };
  };

  /**
   * Handles form completion and user registration.
   * Separates concerns: form handling vs API call.
   */
  const handleComplete = async () => {
    setLoading(true);
    setError("");

    try {
      // Validate user data
      const validation = validateUserData(user);
      if (!validation.isValid) {
        setError(validation.error);
        setLoading(false);
        return;
      }

      // Prepare data for API (convert types, clean empty fields)
      const preparedData = prepareUserData(user);

      // Log data being sent (development only)
      if (import.meta.env.DEV) {
        console.log("Sending user data:", preparedData);
      }

      await createUser(preparedData);
      setShowModal(true);
    } catch (err) {
      const errorMessage = handleApiError(err, "User Registration");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Auto-dismisses error message after 5 minutes.
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 300000); // 5 minutos = 300000 ms

      return () => clearTimeout(timer);
    }
  }, [error]);

  const steps = [
    {
      title: "Datos personales",
      content: (
        <div>
          <h2 className="mb-4">Tus datos</h2>
          <Input
            value={user.name}
            onChange={handleInputChange}
            name="name"
            type="text"
            title="Nombre"
            required
          />
          <Input
            value={user.email}
            onChange={handleInputChange}
            name="email"
            type="email"
            title="Email"
            required
          />
          <Input
            value={user.password}
            onChange={handleInputChange}
            name="password"
            type="password"
            title="Contraseña"
            required
          />
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Género
            </label>
            <select
              id="gender"
              className="form-select"
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona el género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Detalles personales",
      content: (
        <div>
          <h2 className="mb-3">Objetivo</h2>
          <p className="text-muted mb-4">Información para tu plan de ejercicios</p>
          <Input
            value={user.weight}
            onChange={handleInputChange}
            name="weight"
            type="number"
            title="Tu peso"
            placeholder="En kilogramos"
          />
          <Input
            value={user.height}
            onChange={handleInputChange}
            name="height"
            type="number"
            title="Tu altura"
            placeholder="En centímetros"
          />
          <div className="mb-3">
            <label htmlFor="objetive" className="form-label">
              ¿Cuál es tu objetivo principal?
            </label>
            <select
              id="objetive"
              className="form-select"
              name="objetive"
              value={user.objetive}
              onChange={handleInputChange}
              required
            >
              <option value="">Elige tu objetivo</option>
              <option value="comer equilibrado">Comer equilibrado</option>
              <option value="perder peso">Perder peso</option>
              <option value="ganar músculo">Ganar músculo</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Plan de alimentación",
      content: (
        <div>
          <h2 className="mb-3">Tu Dieta</h2>
          <p className="text-muted mb-4">Información para tu dieta</p>
          <div className="mb-3">
            <label htmlFor="ability" className="form-label">
              Tu habilidad en la cocina
            </label>
            <select
              id="ability"
              className="form-select"
              name="ability"
              value={user.ability}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona tu nivel</option>
              <option value="bajo">
                Bajo: El colacao cuenta como cocinar
              </option>
              <option value="medio">
                Medio: Las lentejas no se me queman
              </option>
              <option value="avanzado">
                Avanzado: David muñoz a mi lado es un mindundi
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="typeDiet" className="form-label">
              Tipo de dieta
            </label>
            <select
              id="typeDiet"
              className="form-select"
              name="typeDiet"
              value={user.typeDiet}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona tu tipo de dieta</option>
              <option value="omnivoro">
                Omnivoro: como carne y casi todo
              </option>
              <option value="flexitariano">
                Flexitariano: no excluyo la carne del todo
              </option>
              <option value="vegetariano">Vegetariano</option>
              <option value="vegano">Vegano</option>
              <option value="otra">Otra</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="alergic" className="form-label">
              ¿Eres alérgico o intolerante a algún alimento?
            </label>
            <select
              id="alergic"
              className="form-select"
              name="alergic"
              value={user.alergic}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="ninguno">Ninguno</option>
              <option value="huevo">Huevo</option>
              <option value="marisco">Marisco</option>
              <option value="lactosa">Lactosa</option>
              <option value="gluten">Gluten</option>
              <option value="frutos secos">Frutos secos</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Validación",
      content: (
        <div className="text-center">
          <div className="mb-4">
            <i
              className="fa-solid fa-check-circle"
              style={{ fontSize: "4rem", color: "#83A580" }}
              aria-hidden="true"
            ></i>
          </div>
          <h2 className="mb-3">¡Enhorabuena! ¡Has completado todos los pasos!</h2>
          <p className="text-muted mb-4">
            ¡Estás en buenas manos! y no nos las lavamos a menudo
          </p>
          <blockquote className="blockquote">
            <p className="mb-0">
              Las buenas recetas son como los buenos amigos: hacen que la vida
              sea más deliciosa
            </p>
          </blockquote>
        </div>
      ),
    },
  ];

  return (
    <div className="register-container">
      {loading ? (
        <PacmanLoading />
      ) : (
        <>
          <MultiStepForm
            steps={steps}
            onComplete={handleComplete}
            activeColor="#83A580"
          />
          {error && (
            <div className="alert alert-danger register-error" role="alert">
              {error}
            </div>
          )}
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registro Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¡Te has registrado correctamente!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-custom ms-2"
            variant="primary"
            onClick={() => navigate("/login")}
          >
            Ir a Iniciar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
