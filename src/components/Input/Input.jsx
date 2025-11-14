/**
 * Input Component
 * Reusable form input with label.
 * Follows Single Responsibility: handles input rendering only.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.name - Input name attribute
 * @param {string} props.type - Input type (text, email, password, number, etc.)
 * @param {string} props.title - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether input is required
 */
const Input = ({ value, onChange, name, type, title, placeholder, required }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <input
        name={name}
        value={value}
        type={type}
        className="form-control"
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;
