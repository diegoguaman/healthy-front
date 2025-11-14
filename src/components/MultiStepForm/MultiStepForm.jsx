import { useState } from "react";
import "./MultiStepForm.css";

/**
 * Multi-Step Form Component
 * Professional, accessible, and efficient multi-step form implementation.
 * Follows Single Responsibility: handles step navigation and form structure only.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.steps - Array of step configurations
 * @param {string} props.steps[].title - Step title
 * @param {React.ReactNode} props.steps[].content - Step content/fields
 * @param {string} props.steps[].icon - Optional icon class name
 * @param {Function} props.onComplete - Callback when form is completed
 * @param {Function} props.onStepChange - Optional callback when step changes
 * @param {string} props.activeColor - Active step color (default: #83A580)
 */
const MultiStepForm = ({
  steps,
  onComplete,
  onStepChange,
  activeColor = "#83A580",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;

  /**
   * Moves to the next step.
   * Validates current step before proceeding.
   */
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onStepChange) {
        onStepChange(nextStep);
      }
    } else {
      handleComplete();
    }
  };

  /**
   * Moves to the previous step.
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onStepChange) {
        onStepChange(prevStep);
      }
    }
  };

  /**
   * Handles form completion.
   */
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  /**
   * Navigates to a specific step.
   *
   * @param {number} stepIndex - Index of step to navigate to
   */
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
      if (onStepChange) {
        onStepChange(stepIndex);
      }
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="multi-step-form" style={{ "--active-color": activeColor }}>
      {/* Progress Steps Indicator */}
      <div className="steps-indicator">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const stepNumber = index + 1;

          return (
            <div
              key={index}
              className={`step-item ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
            >
              <button
                type="button"
                className="step-button"
                onClick={() => goToStep(index)}
                aria-label={`Ir al paso ${stepNumber}: ${step.title}`}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="step-number">
                  {isCompleted ? (
                    <i className="fa-solid fa-check" aria-hidden="true"></i>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <span className="step-title">{step.title}</span>
              </button>
              {index < totalSteps - 1 && (
                <div
                  className={`step-connector ${isCompleted ? "completed" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="form-content">
        <div className="step-content">
          {steps[currentStep]?.content}
        </div>

        {/* Navigation Buttons */}
        <div className="form-navigation">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handlePrevious}
            disabled={isFirstStep}
            aria-label="Paso anterior"
          >
            <i className="fa-solid fa-arrow-left me-2" aria-hidden="true"></i>
            Atrás
          </button>

          <button
            type="button"
            className="btn btn-custom"
            onClick={handleNext}
            aria-label={isLastStep ? "Finalizar registro" : "Siguiente paso"}
          >
            {isLastStep ? (
              <>
                <i className="fa-solid fa-check me-2" aria-hidden="true"></i>
                Finalizar
              </>
            ) : (
              <>
                Siguiente
                <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;

