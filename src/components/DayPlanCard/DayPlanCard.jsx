import { Link } from "react-router-dom";
import "./DayPlanCard.css";

/**
 * DayPlanCard Component
 * Displays a daily meal plan summary card.
 * Follows Single Responsibility Principle: handles plan display only.
 *
 * @param {Object} props - Component props
 * @param {Object} props.plan - Daily meal plan object
 * @param {string} props.plan._id - Plan ID
 * @param {string} props.plan.date - Plan date (ISO string)
 * @param {Array} props.plan.meals - Array of meal objects
 * @param {Function} [props.onClick] - Optional click handler
 */
const DayPlanCard = ({ plan, onClick }) => {
  if (!plan || !plan._id) {
    return null;
  }

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

  // Handle different plan structures from backend
  const planDate = plan.date || plan.dailyMealPlan?.date;
  const planMeals = plan.meals || plan.dailyMealPlan?.meals || [];
  
  const mealCount = planMeals.length;
  const mealNames = planMeals.slice(0, 3).map((meal) => {
    return meal?.meal?.recipe?.name || meal?.meal?.name || "Comida";
  });

  const CardContent = (
    <div className="day-plan-card">
      <div className="day-plan-card-header">
        <div className="day-plan-date">
          <i className="fa-solid fa-calendar-day me-2"></i>
          <span>{formatDate(planDate)}</span>
        </div>
        <div className="day-plan-meal-count">
          <i className="fa-solid fa-utensils me-1"></i>
          <span>{mealCount} {mealCount === 1 ? "comida" : "comidas"}</span>
        </div>
      </div>

      {mealNames.length > 0 && (
        <div className="day-plan-meals-preview">
          <ul className="day-plan-meals-list">
            {mealNames.map((mealName, index) => (
              <li key={index}>
                <i className="fa-solid fa-check-circle me-2"></i>
                {mealName}
              </li>
            ))}
            {mealCount > 3 && (
              <li className="day-plan-more-meals">
                <i className="fa-solid fa-ellipsis me-2"></i>
                y {mealCount - 3} más...
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="day-plan-card-footer">
        <span className="day-plan-view-link">
          Ver detalles <i className="fa-solid fa-arrow-right ms-1"></i>
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={() => onClick(plan)} style={{ cursor: "pointer" }}>
        {CardContent}
      </div>
    );
  }

  return (
    <Link to={`/day-plan/${plan._id}`} className="day-plan-card-link">
      {CardContent}
    </Link>
  );
};

export default DayPlanCard;

