import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { editUser } from "../services/ProtectUserService";
import { handleApiError } from "../utils/error-handler";
import PacmanLoading from "../components/PacmanLoading/PacmanLoading";
import Input from "../components/Input/Input";
import { Alert, Button, Card } from "react-bootstrap";
import "../index.css";
import "./UserProfile.css";

/**
 * UserProfile Page Component
 * Allows users to view and edit their profile information and preferences.
 * Follows Single Responsibility: handles user profile management.
 */
const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    weight: 0,
    height: 0,
    objetive: "",
    ability: "",
    typeDiet: "",
    alergic: "",
  });

  /**
   * Initializes user data from context when user is available.
   */
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        weight: user.weight || 0,
        height: user.height || 0,
        objetive: user.objetive || "",
        ability: user.ability || "",
        typeDiet: user.typeDiet || "",
        alergic: user.alergic || "",
      });
    }
  }, [user]);

  if (!user) {
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
  /**
   * Handles input field changes.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - Input change event
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "height" ? Number(value) || 0 : value,
    }));
  };

  /**
   * Enables edit mode.
   */
  const handleEdit = () => {
    setEditMode(true);
    setError(null);
    setSuccessMessage(null);
  };

  /**
   * Cancels edit mode and resets form data.
   */
  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    setSuccessMessage(null);
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        weight: user.weight || 0,
        height: user.height || 0,
        objetive: user.objetive || "",
        ability: user.ability || "",
        typeDiet: user.typeDiet || "",
        alergic: user.alergic || "",
      });
    }
  };

  /**
   * Handles form submission and user data update.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await editUser(user._id, userData);
      updateUser(updatedUser || userData);
      setSuccessMessage("Perfil actualizado exitosamente");
      setEditMode(false);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(handleApiError(err, "Profile Update"));
    } finally {
      setLoading(false);
    }
  };

  const generateAvatarUrl = (name) => {
    const initial = name ? name.trim().charAt(0).toUpperCase() : "";
    return `https://ui-avatars.com/api/?name=${initial}&size=150&background=83a580&color=fff&bold=true`;
  };

  return (
    <div className="user-profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">
            <i className="fa-solid fa-user-circle me-2"></i>
            Mi Perfil
          </h1>
          <p className="profile-subtitle">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            <Alert.Heading>Error al actualizar perfil</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)} className="mb-4">
            <i className="fa-solid fa-check-circle me-2"></i>
            {successMessage}
          </Alert>
        )}

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Profile Card */}
            <Card className="profile-card">
              <Card.Body>
                {/* Avatar Section */}
                <div className="profile-avatar-section">
                  <div className="avatar-wrapper">
                    <img
                      src={generateAvatarUrl(user.name)}
                      alt="Avatar"
                      className="profile-avatar"
                    />
                    {!editMode && (
                      <div className="avatar-badge">
                        <i className="fa-solid fa-check"></i>
                      </div>
                    )}
                  </div>
                  {!editMode && (
                    <div className="profile-info">
                      <h2 className="profile-name">{user.name}</h2>
                      <p className="profile-email">
                        <i className="fa-solid fa-envelope me-2"></i>
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Section */}
                {editMode ? (
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                      <h3 className="form-section-title">
                        <i className="fa-solid fa-user me-2"></i>
                        Información Personal
                      </h3>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <Input
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            type="text"
                            title="Nombre"
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                            <input
                              id="email"
                              type="email"
                              className="form-control"
                              value={userData.email}
                              disabled
                              readOnly
                            />
                            <small className="form-text text-muted">
                              El email no se puede modificar
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 col-md-6">
                          <label htmlFor="gender" className="form-label">
                            Género
                          </label>
                          <select
                            id="gender"
                            className="form-select"
                            name="gender"
                            value={userData.gender}
                            onChange={handleInputChange}
                          >
                            <option value="">Selecciona el género</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-3">
                          <Input
                            name="weight"
                            value={userData.weight}
                            onChange={handleInputChange}
                            type="number"
                            title="Peso (kg)"
                            placeholder="Ej: 70"
                            min="0"
                          />
                        </div>
                        <div className="col-12 col-md-3">
                          <Input
                            name="height"
                            value={userData.height}
                            onChange={handleInputChange}
                            type="number"
                            title="Altura (cm)"
                            placeholder="Ej: 175"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3 className="form-section-title">
                        <i className="fa-solid fa-sliders me-2"></i>
                        Preferencias para Planes y Recetas
                      </h3>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <label htmlFor="objetive" className="form-label">
                            <i className="fa-solid fa-bullseye me-2"></i>
                            Objetivo Principal
                          </label>
                          <select
                            id="objetive"
                            className="form-select"
                            name="objetive"
                            value={userData.objetive}
                            onChange={handleInputChange}
                          >
                            <option value="">Elige tu objetivo</option>
                            <option value="comer equilibrado">Comer equilibrado</option>
                            <option value="perder peso">Perder peso</option>
                            <option value="ganar músculo">Ganar músculo</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="ability" className="form-label">
                            <i className="fa-solid fa-fire me-2"></i>
                            Habilidad en la Cocina
                          </label>
                          <select
                            id="ability"
                            className="form-select"
                            name="ability"
                            value={userData.ability}
                            onChange={handleInputChange}
                          >
                            <option value="">Tu habilidad en la cocina</option>
                            <option value="bajo">Bajo: El colacao cuenta como cocinar</option>
                            <option value="medio">Medio: Las lentejas no se me queman</option>
                            <option value="avanzado">
                              Avanzado: David muñoz a mi lado es un mindundi
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 col-md-6">
                          <label htmlFor="typeDiet" className="form-label">
                            <i className="fa-solid fa-leaf me-2"></i>
                            Tipo de Dieta
                          </label>
                          <select
                            id="typeDiet"
                            className="form-select"
                            name="typeDiet"
                            value={userData.typeDiet}
                            onChange={handleInputChange}
                          >
                            <option value="">Tipo de dieta</option>
                            <option value="omnivoro">Omnívoro: como carne y casi todo</option>
                            <option value="flexitariano">
                              Flexitariano: no excluyo la carne del todo
                            </option>
                            <option value="vegetariano">Vegetariano</option>
                            <option value="vegano">Vegano</option>
                            <option value="otra">Otra</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="alergic" className="form-label">
                            <i className="fa-solid fa-exclamation-triangle me-2"></i>
                            Alergias o Intolerancias
                          </label>
                          <select
                            id="alergic"
                            className="form-select"
                            name="alergic"
                            value={userData.alergic}
                            onChange={handleInputChange}
                          >
                            <option value="">Alergias o intolerancias alimentarias</option>
                            <option value="ninguna">Ninguna</option>
                            <option value="huevo">Huevo</option>
                            <option value="marisco">Marisco</option>
                            <option value="lactosa">Lactosa</option>
                            <option value="gluten">Gluten</option>
                            <option value="frutos secos">Frutos secos</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <i className="fa-solid fa-times me-2"></i>
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="btn-custom"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-save me-2"></i>
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-view">
                    {/* Personal Information */}
                    <div className="info-section">
                      <h3 className="info-section-title">
                        <i className="fa-solid fa-user me-2"></i>
                        Información Personal
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <i className="fa-solid fa-venus-mars"></i>
                          <div>
                            <strong>Género:</strong>
                            <span>{user.gender || "No especificado"}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <i className="fa-solid fa-weight"></i>
                          <div>
                            <strong>Peso:</strong>
                            <span>{user.weight ? `${user.weight} kg` : "No especificado"}</span>
                          </div>
                        </div>
                        <div className="info-item">
                          <i className="fa-solid fa-ruler-vertical"></i>
                          <div>
                            <strong>Altura:</strong>
                            <span>{user.height ? `${user.height} cm` : "No especificado"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="info-section">
                      <h3 className="info-section-title">
                        <i className="fa-solid fa-sliders me-2"></i>
                        Preferencias
                      </h3>
                      <div className="preferences-grid">
                        <div className="preference-card">
                          <i className="fa-solid fa-bullseye"></i>
                          <div>
                            <strong>Objetivo:</strong>
                            <span>{user.objetive || "No especificado"}</span>
                          </div>
                        </div>
                        <div className="preference-card">
                          <i className="fa-solid fa-fire"></i>
                          <div>
                            <strong>Habilidad:</strong>
                            <span>{user.ability || "No especificado"}</span>
                          </div>
                        </div>
                        <div className="preference-card">
                          <i className="fa-solid fa-leaf"></i>
                          <div>
                            <strong>Dieta:</strong>
                            <span>{user.typeDiet || "No especificado"}</span>
                          </div>
                        </div>
                        <div className="preference-card">
                          <i className="fa-solid fa-exclamation-triangle"></i>
                          <div>
                            <strong>Alergias:</strong>
                            <span>{user.alergic || "Ninguna"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="profile-actions">
                      <Button
                        variant="primary"
                        className="btn-custom edit-profile-btn"
                        onClick={handleEdit}
                      >
                        <i className="fa-solid fa-edit me-2"></i>
                        Editar Perfil
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
