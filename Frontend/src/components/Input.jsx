const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-5 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-base ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Input;
