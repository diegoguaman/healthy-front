import PropTypes from "prop-types";
import "./PacmanLoading.css";

/**
 * PacmanLoading Component
 * Displays a loading spinner with optional text.
 * Uses CSS spinner with brand color #83A580 as fallback if GIF is not available.
 *
 * @param {Object} props - Component props
 * @param {string} [props.text] - Optional text to display above the loader
 */
const PacmanLoading = ({ text }) => {
  return (
    <div className="PacmanLoading">
      {text && <h1>{text}</h1>}
      <div className="loading-container">
        {/* Try to load GIF, fallback to CSS spinner */}
        <img
          src="/gif-loading-color.gif"
          className="loading-gif"
          alt="Loading..."
          onError={(e) => {
            // Hide GIF if it fails to load, CSS spinner will show
            e.target.style.display = "none";
            e.target.parentElement.classList.add("use-spinner");
          }}
        />
        <div className="css-spinner" aria-hidden="true">
          <div className="spinner-ring"></div>
        </div>
      </div>
    </div>
  );
};

PacmanLoading.propTypes = {
  text: PropTypes.string,
};

PacmanLoading.defaultProps = {
  text: "",
};

export default PacmanLoading;
